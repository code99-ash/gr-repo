import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PoliciesRepository } from './policies.repository';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyFlowDto } from './dto/policy-flow.dto';
import { PolicyHistoryService } from '../policy_histories/policy_histories.service';

import { diff } from 'deep-object-diff';
import { UpdatePolicyStatusDto } from './dto/update-policy-status.dto';
import { ProductPolicyValidator } from './validators/product-policy-validator';
import { DurationPolicyValidator } from './validators/duration-policy-validator';
import { CustomerPolicyValidator } from './validators/customer-policy-validator';
import { OrderPolicyValidator } from './validators/order-policy-validator';
import { SelectPolicyDto } from './dto/select-policy.dto';

type PolicyType = 'product' | 'order' | 'customer' | 'duration';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly policiesRepository: PoliciesRepository,
    private readonly historyService: PolicyHistoryService
  ) {}


  private _flowIsComplete(policy_flow: PolicyFlowDto, policy_type: PolicyType) {
    let isValid = true;

    try {

      switch (policy_type) { 
        case 'order':
          OrderPolicyValidator.parse(policy_flow);
          break;
        case 'customer':
          CustomerPolicyValidator.parse(policy_flow);
          break;
        case 'duration':
          DurationPolicyValidator.parse(policy_flow);
          break;
        default:
          ProductPolicyValidator.parse(policy_flow);
      }

    } catch (error) {
      isValid = false;
    }

    return isValid;
  }

  private _flowChanged(original: PolicyFlowDto, current: PolicyFlowDto) {
    return Object.keys(diff(original, current)).length > 0
  }

  async create(createPolicyDto: CreatePolicyDto) {
    try {
      return await this.policiesRepository.create({
        ...createPolicyDto,
        policy_status: 'draft'
      });
    } catch (error) {
      throw new InternalServerErrorException('Error saving policy');
    }
  }

  async findAll(organization_uid?: string) {
    try {
      return await this.policiesRepository.list();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching policies');
    }
  }
  
  async filterFetch(filters: string[]) {
    try {
      return await this.policiesRepository.filterFetch(filters)
    } catch (error) {
      throw new InternalServerErrorException('Error fetching policies');
    }
  }

  async filterFetchInArray(filters: string[]) {
    try {
      return await this.policiesRepository.filterFetchInArray(filters)
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

  private async _updateActivePolicy(
    updatePolicyDto: UpdatePolicyDto,
    existing_policy: SelectPolicyDto
) {
    try {
        const flow_to_update = updatePolicyDto.policy_flow;

        if(flow_to_update && this._flowChanged(existing_policy.policy_flow, flow_to_update)) {
          await this._createHistory(existing_policy);
        }   

    }catch(error) {
      throw new InternalServerErrorException('Error updating policy');
    }
  }

  private async _createHistory(currentPolicy: SelectPolicyDto) {
    try {
        return await this.historyService.create({
            policy_uid: currentPolicy.uid,
            policy_name: currentPolicy.policy_name,
            policy_type: currentPolicy.policy_type,
            policy_status: 'active',
            policy_flow: currentPolicy.policy_flow,
            activated_at: currentPolicy.activated_at,
            activated_by: currentPolicy.activated_by
        })
    }catch(error) {
      throw new InternalServerErrorException('Error creating policy history');
    }
  }

  private _isEqual(status: any, value: any) {
    return status === value;
  }

  private filterOut(object: { [key: string]: any }, key: string) {
    const { [key]: __, ...rest } = object;
    return rest;
  }

  async update(uid: string, updateData: UpdatePolicyDto) {

    const updatePolicyDto = this.filterOut(updateData, 'policy_status');

    const existing_policy = await this.findOne(uid);
    if(!existing_policy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }

    const flow_to_update = updatePolicyDto.policy_flow;



    // Either the policy was published or active (but not in draft)
    if(!this._isEqual(existing_policy.policy_status, 'draft') && flow_to_update) {

        if(!this._flowIsComplete(flow_to_update, existing_policy.policy_type)) {
          throw new BadRequestException(`An published status cannot be with incomplete flow`);
        }

    }

    if(this._isEqual(existing_policy.policy_status, 'active')) {
      await this._updateActivePolicy(updatePolicyDto, existing_policy);
    }

 
    return await this.policiesRepository.update(uid, updatePolicyDto)   
    
  }

  async updateStatus(uid: string, updatePolicyStatusDto: UpdatePolicyStatusDto, user_id: string) {
    const { policy_status } = updatePolicyStatusDto;

    const existing_policy = await this.findOne(uid);
    if(!existing_policy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }

    if(existing_policy.policy_status === policy_status) {
      throw new BadRequestException(`Policy is already ${policy_status}`);
    }
    
    if(existing_policy.policy_status === 'active' && policy_status !== 'active') {
      // this concerns product assignments
      throw new BadRequestException(`Sorry you cannot downgrade the status of an active policy`);
    }

    

    if(policy_status !== 'draft') {
      try {
        const validate_flow = this._flowIsComplete(existing_policy.policy_flow, existing_policy.policy_type);
        if(!validate_flow) {
          throw new BadRequestException(`Invalid policy flow, make sure it is complete and valid`);
        }
      }catch {
        console.log('Policy not complete')
        throw new BadRequestException(`Invalid policy flow, make sure it is complete and valid`);
      }
    }

    try {

      if(policy_status === 'active') {
        // // Authorized user_uid is required
        console.log('status', policy_status, user_id)
        return await this.policiesRepository.activate(uid, user_id);
      }else {
        return await this.policiesRepository.updateStatus(uid, updatePolicyStatusDto);
      }

    } catch (error) {
      throw new BadRequestException('Error updating policy status');
    }
    
  }

  async delete(uid: string) {
    const policy = await this.policiesRepository.get('uid', uid);
    if (!policy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }

    try {
        return await this.policiesRepository.softDelete(uid);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting policy');
    }
  }

}
