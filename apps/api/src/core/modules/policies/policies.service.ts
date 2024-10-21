import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PoliciesRepository } from './policies.repository';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { isNull, eq, and } from 'drizzle-orm'; // Ensure eq is imported
import { policies } from './db/policies.db';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyFlowDto } from './dto/policy-flow.dto';
import { PolicyHistoryService } from '../policy_histories/policy_histories.service';
// import { diff } from 'deep-object-diff';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly policiesRepository: PoliciesRepository,
    private readonly historyService: PolicyHistoryService
  ) {}


  private _flowIsComplete(policy_flow: PolicyFlowDto): boolean {
    
    if(!policy_flow) return false;
    // console.log('checking complete flow on', policy_flow)

    const head = Object.values(policy_flow).find(each => each.id === 'head');
    if(!head) return false;

    return head.branches.length > 0 && !this._incompleteUserInputs(policy_flow);
  }

  private _incompleteUserInputs(policy_flow: PolicyFlowDto): boolean {
    const nodes = Object.values(policy_flow);
    const incomplete = nodes.some(each => each.node_type === 'user-input' && (
                                          (each.data.input_type === 'upload' && each.branches.length < 1) ||
                                          (each.data.input_type === 'question' && each.branches.length < 2)
                                        ))
    return incomplete;
  }

  // private _flowChanged(original: PolicyFlowDto, current: PolicyFlowDto) {
  //   return Object.keys(diff(original, current)).length > 0
  // }

  async create(createPolicyDto: CreatePolicyDto) {
    const { status, policy_flow } = createPolicyDto;
    // Prevent Save for non-draft status if flow is incomplete
    if(status && status !== 'draft' && !this._flowIsComplete(policy_flow)) {
      throw new BadRequestException(`Incomplete flow cannot be ${status}`);
    }

    try {
      return await this.policiesRepository.saveAs(createPolicyDto);
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
    if(updatePolicyDto.status === 'active') { // Cant activate on this end;
      throw new BadRequestException(`Policy status can either be draft or published`);
    }
    // find policy;
    const existingPolicy = await this.findOne(uid);
    // console.log('existingPolicy', existingPolicy);

    if(!existingPolicy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }

    const statusInUse = updatePolicyDto.status ?? existingPolicy.status;
    
    // In case, new_flow is not intended to be updated
    const policy_flow = updatePolicyDto.policy_flow ?? existingPolicy.policy_flow
    const flowChanged = this._flowIsComplete(policy_flow);

    if(statusInUse !== 'draft' && !flowChanged) {
      throw new BadRequestException(`Incomplete flow cannot be ${statusInUse}`);
    }

    try {

      // If policy was active & flowChanges
      if(existingPolicy.status === 'active' && flowChanged) { 

        // Add previous policy to policy_histores
        await this.historyService.create({
          policy_uid: existingPolicy.uid,
          policy_name: existingPolicy.policy_name,
          policy_type: existingPolicy.policy_type,
          status: existingPolicy.status,
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

    if (policy.status === 'active') {
      return this.setAsDeleted(uid);
    }
    return this.deleteAnyway(uid);
  }

  async deleteAnyway(uid: string) {
    try {
      return await this.policiesRepository.deleteAnyway(uid);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting policy');
    }
  }

  async setAsDeleted(uid: string) {
    try {
      return await this.policiesRepository.setAsDeleted(uid);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting policy');
    }
  }
}
