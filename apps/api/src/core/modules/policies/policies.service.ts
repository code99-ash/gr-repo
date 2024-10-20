import { Injectable } from '@nestjs/common';
import { PoliciesRepository } from './policies.repository';
import { CreatePolicyDto, UnprocessedPolicyCreateDto } from './dto/create-policy.dto';
import { isNull, eq, and } from 'drizzle-orm'; // Ensure eq is imported
import { CreatePolicy, NodeRecord, policies, SelectPolicy } from './db/policies.db';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { FlowRecordDto, NodeRecordDto } from './dto/policy-flow.dto';
import { createId } from '@paralleldrive/cuid2';
import { diff } from 'deep-object-diff'
import { ORM } from 'src/common/repository';

@Injectable()
export class PoliciesService {
  constructor(private readonly policiesRepository: PoliciesRepository) {}

  private _getCreateDto(unprocessed: UnprocessedPolicyCreateDto, current_flow: FlowRecordDto) {
    return CreatePolicy.parse({...unprocessed, current_flow, policy_history: []})
  }

  private _createFlow(policy_flow: NodeRecordDto, policy_name: string): FlowRecordDto {

    const parsePolicyFlow = NodeRecord.parse(policy_flow)

    let record = {
        policy_name,
        policy_flow: parsePolicyFlow,
        created_at: new Date().toISOString(),
        policy_flow_uid: createId(),
        activated_by: null
    }

    return record;
  }

  private _flowIsComplete(policy_flow: NodeRecordDto): boolean {
    
    if(!policy_flow) return false;
    // console.log('checking complete flow on', policy_flow)

    const head = Object.values(policy_flow).find(each => each.id === 'head');
    if(!head) return false;

    return head.branches.length > 0 && !this._incompleteUserInputs(policy_flow);
  }

  private _incompleteUserInputs(policy_flow: NodeRecordDto): boolean {
    const nodes = Object.values(policy_flow);
    const incomplete = nodes.some(each => each.node_type === 'user-input' && (
                                          (each.data.input_type === 'upload' && each.branches.length < 1) ||
                                          (each.data.input_type === 'question' && each.branches.length < 2)
                                        ))
    return incomplete;
  }

  private _flowChanged(original: NodeRecordDto, current: NodeRecordDto) {
    return Object.keys(diff(original, current)).length > 0
  }

  create(policy_flow: NodeRecordDto, unprocessedPolicy: UnprocessedPolicyCreateDto) {
    const {status} = unprocessedPolicy;

    // Prevent Save for non-draft status if flow is incomplete
    if(status && status !== 'draft' && !this._flowIsComplete(policy_flow)) {
      throw new Error(`Incomplete flow cannot be ${status}`);
    }

    const current_flow = this._createFlow(policy_flow, unprocessedPolicy.policy_name)
    const policyDto =  this._getCreateDto(unprocessedPolicy, current_flow)

    return this.policiesRepository.saveAs(policyDto);
  }

  findAll(organization_uid?: string) {
    return this.policiesRepository.list({
      where: and(
        isNull(policies.deleted_at),
        // eq(policies.organization_uid, organization_uid)
      )
    });
  }
  
  findOne(id: number) {
    return this.policiesRepository.get('id', id)
  }

  async update(id: number, updatePolicyDto: UpdatePolicyDto, new_flow: NodeRecordDto) {
    // find policy;
    const existingPolicy = await this.findOne(id);
    // console.log('existingPolicy', existingPolicy);

    if(!existingPolicy) {
      throw new Error(`Policy with ID ${id} not found.`)
    }

    const newStatus = updatePolicyDto.status ?? existingPolicy.status;

    // In case, new_flow is not intended to be updated

    const policy_flow = new_flow ?? existingPolicy.current_flow.policy_flow
    if(newStatus !== 'draft' && !this._flowIsComplete(policy_flow)) {
      throw new Error(`Incomplete flow cannot be ${newStatus}`);
    }


    // Deep check differences in policy flow
    const existing_flow = existingPolicy.current_flow;

    if(this._flowChanged(existing_flow.policy_flow, policy_flow)) { // flow Changed,
      // console.log('flow changed');
      return await this.updateWithPolicyFlow(id, updatePolicyDto, existing_flow, new_flow)
    
    }else {
      // console.log('flow DID NOT change');
      return await this.policiesRepository.update(id, updatePolicyDto)
    }
    

  }

  async updateWithPolicyFlow(id: number, updatePolicyDto: UpdatePolicyDto, existingFlow: FlowRecordDto, newFlow: NodeRecordDto) {
    const data = { // prepare flow record
      ...updatePolicyDto,
      current_flow: {
        ...existingFlow,
        policy_flow: newFlow
      }
    } as UpdatePolicyDto

    return await this.policiesRepository.update(id, data)
  }

  async delete(id: number) {
    const policy = await this.policiesRepository.get('id', id);
    if(!policy) {
      throw new Error(`Policy with ID ${id} not found`)
    }
    if(policy.status === 'active') {
      return this.setAsDeleted(id)
    }
    return this.deleteAnyway(id)
  }

  deleteAnyway(id: number) {
    return this.policiesRepository.deleteAnyway('id', id)
  }

  setAsDeleted(id: number) {
    return this.policiesRepository.setAsDeleted('id', id)
  }
}
