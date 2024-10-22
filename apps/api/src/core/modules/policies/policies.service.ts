import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { PoliciesRepository } from './policies.repository';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { isNull, and } from 'drizzle-orm';
import { policies } from './db/policies.db';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyFlowDto } from './dto/policy-flow.dto';
import { PolicyHistoryService } from '../policy_histories/policy_histories.service';

import { diff } from 'deep-object-diff';
import { UpdatePolicyStatusDto } from './dto/update-policy-status.dto';
import { ProductPolicyValidator } from './validators/product-policy-validator';

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
    try {
      return await this.policiesRepository.create({
        ...createPolicyDto,
        status: 'draft'
      });
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


    const existingPolicy = await this.findOne(uid);

    if(!existingPolicy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }

    const isActive = existingPolicy.status === 'active';

    // In case, new_flow is not intended to be updated, old flow represents it
    const policy_flow = updatePolicyDto.policy_flow ?? existingPolicy.policy_flow
    const flowIsComplete = this._flowIsComplete(policy_flow, existingPolicy.policy_type);
    const flowChanged = this._flowChanged(existingPolicy.policy_flow, policy_flow);

    if(isActive && !flowIsComplete) {
      throw new BadRequestException(`An active status cannot be published with incomplete flow`);
    }

    try {

      // republishing && flowWasActive && flowIsComplete && flowChanged
      if(isActive && flowIsComplete && flowChanged) { 

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

      }
 
      return await this.policiesRepository.update(uid, updatePolicyDto)

    }catch(error) {
      throw new InternalServerErrorException('Error updating policy');
    }
    
  }

  async updateStatus(uid: string, updatePolicyStatusDto: UpdatePolicyStatusDto) {
    const { status } = updatePolicyStatusDto;

    const policy = await this.findOne(uid);
    if(!policy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }

    if(policy.status === status) {
      throw new BadRequestException(`Policy is already ${status}`);
    }

    if(policy.status !== 'active') {

      if(status !== 'draft') {
        try {

          ProductPolicyValidator.parse(policy.policy_flow);

        } catch (error) {
          
          throw new BadRequestException(`Invalid policy flow, make sure it is complete and valid`);
        }
      }

      return await this.policiesRepository.updateStatus(uid, updatePolicyStatusDto);
      
    } else {

      // Check if policy has been assigned to any products
      // Policy with no products assigned to it can be downgraded to draft/published

      // Policy with products assigned to it cannot be downgraded to draft/published
      throw new BadRequestException(`Sorry you cannot downgrade the status of an active policy`);

    }
  
  }

  async delete(uid: string) {
    const policy = await this.policiesRepository.get('uid', uid);
    if (!policy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }

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
