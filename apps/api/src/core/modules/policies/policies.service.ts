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
import { DurationPolicyValidator } from './validators/duration-policy-validator';
import { CustomerPolicyValidator } from './validators/customer-policy-validator';
import { OrderPolicyValidator } from './validators/order-policy-validator';

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

    const existingPolicy = await this.findOne(uid);
    if(!existingPolicy) {
      throw new NotFoundException(`Policy with UID ${uid} not found.`);
    }

    if(existingPolicy.status === status) {
      throw new BadRequestException(`Policy is already ${status}`);
    }
    
    if(existingPolicy.status === 'active' && status !== 'active') {
      // this concerns product assignments
      throw new BadRequestException(`Sorry you cannot downgrade the status of an active policy`);
    }

    const flowIsValid = this._flowIsComplete(existingPolicy.policy_flow, existingPolicy.policy_type);

    if(status !== 'draft' && !flowIsValid) {
      throw new BadRequestException(`Invalid policy flow, make sure it is complete and valid`);
    }

    return await this.policiesRepository.updateStatus(uid, updatePolicyStatusDto);
    
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
      await this.policiesRepository.hardDelete(uid);
      return true;
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
