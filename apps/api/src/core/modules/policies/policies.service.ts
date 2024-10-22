import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PoliciesRepository } from './policies.repository';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { isNull, eq, and } from 'drizzle-orm'; // Ensure eq is imported
import { policies } from './db/policies.db';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyFlowDto } from './dto/policy-flow.dto';
import { PolicyHistoryService } from '../policy_histories/policy_histories.service';

import { diff } from 'deep-object-diff';

type PolicyType = 'product' | 'order' | 'customer' | 'duration';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly policiesRepository: PoliciesRepository,
    private readonly historyService: PolicyHistoryService
  ) {}


  private _flowIsComplete(policy_flow: PolicyFlowDto, policy_type: PolicyType): boolean {
    
    if(!(policy_flow && policy_flow.head)) return false;

    const head = policy_flow.head;

    return head.branches.length > 0 && 
          !this._incompleteUserInputs(policy_flow) && 
          !this._productConditionIncomplete(policy_flow, policy_type);
  }

  private _productConditionIncomplete(policy_flow: PolicyFlowDto, policy_type: PolicyType): boolean {
    const head = policy_flow.head;

    const incomplete = policy_type === 'product' && (
      head.branches.length < 1 || head.data.list.length < 1
    );
    return incomplete;
  }

  private _incompleteUserInputs(policy_flow: PolicyFlowDto): boolean {
    const nodes = Object.values(policy_flow);
  
    const incomplete = nodes.some(each => each.node_type === 'user-input' && (
                                          (each.data.input_type === 'upload' && each.branches.length < 1) ||
                                          (each.data.input_type === 'question' && each.branches.length < 2)
                                        ))
    return incomplete;
  }

  private _flowChanged(original: PolicyFlowDto, current: PolicyFlowDto) {
    return Object.keys(diff(original, current)).length > 0
  }

  async create(createPolicyDto: CreatePolicyDto) {
    const { status, policy_flow, policy_type } = createPolicyDto;
    // Prevent Save for non-draft status if flow is incomplete
    if(status && status !== 'draft' && !this._flowIsComplete(policy_flow, policy_type)) {
      throw new BadRequestException(`Incomplete flow cannot be ${status}`);
    }

    try {
      return await this.policiesRepository.create(createPolicyDto);
    } catch (error) {
      throw new InternalServerErrorException('Error saving policy');
    }
  }

  async findAll(organization_uid?: string) {
    try {
      return await this.policiesRepository.list({
        where: and(isNull(policies.deleted_at)),
        // eq(policies.organization_uid, organization_uid)
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching policies');
    }
  }
  
  async findOne(uid: string) {
    const policy = await this.policiesRepository.get('uid', uid);
    if (!policy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }
    return policy;
  }

  async update(uid: string, updatePolicyDto: UpdatePolicyDto) {

    // find policy;
    const existingPolicy = await this.findOne(uid);
    // console.log('existingPolicy', existingPolicy);

    if(!existingPolicy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }

    const statusInUse = updatePolicyDto.status ?? existingPolicy.status;

    if(existingPolicy.status === 'active' && statusInUse !== 'active') {
      throw new BadRequestException(`Sorry you cannot downgrade the status of an active policy`);
    }


    
    // In case, new_flow is not intended to be updated, old flow represents it
    const policy_flow = updatePolicyDto.policy_flow ?? existingPolicy.policy_flow
    const flowIsComplete = this._flowIsComplete(policy_flow, existingPolicy.policy_type);

    if(statusInUse !== 'draft' && !flowIsComplete) {
      throw new BadRequestException(`Incomplete flow cannot be ${statusInUse}`);
    }

    try {

      // republishing && flowWasActive && flowIsComplete && flowChanged
      if(
        statusInUse !== 'draft' && 
        existingPolicy.status === 'active' && 
        flowIsComplete && this._flowChanged(existingPolicy.policy_flow, policy_flow)
      ) { 

        // Add previous policy to policy_histores
        await this.historyService.create({
          policy_uid: existingPolicy.uid,
          policy_name: existingPolicy.policy_name,
          policy_type: existingPolicy.policy_type,
          status: 'active', // new policy_history implies current version is active
          policy_flow: existingPolicy.policy_flow,
          activated_at: existingPolicy.activated_at,
          activated_by: existingPolicy.activated_by
        })

        // Create a new version as below
      }
      
      // Update Policy 
      return await this.policiesRepository.update(uid, updatePolicyDto)

    }catch(error) {
      throw new InternalServerErrorException('Error updating policy');
    }
    
  }

  async delete(uid: string) {
    const policy = await this.policiesRepository.get('uid', uid);
    if (!policy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }

    console.log('policy status', policy.status)
    if (policy.status === 'active') {
      return this.softDelete(uid);
    }
    return this.hardDelete(uid);
  }

  async hardDelete(uid: string) {
    try {
      return await this.policiesRepository.hardDelete(uid);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting policy');
    }
  }

  async softDelete(uid: string) {
    try {
      return await this.policiesRepository.softDelete(uid);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting policy');
    }
  }
}
