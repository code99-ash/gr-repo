import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PolicyHistoryRepository } from './policy_histories.repository';
import { CreatePolicyHistoryDto } from './dto/create-policy-history.dto';

@Injectable()
export class PolicyHistoryService {
  constructor(private readonly historyRepository: PolicyHistoryRepository) {}

    async create(createHistoryDto: CreatePolicyHistoryDto) {
      try {
        return await this.historyRepository.create(createHistoryDto);
      } catch (error) {
        throw new InternalServerErrorException('Error saving policy history');
      }
    }

  async findAll(organization_uid?: string) {
    try {
      return await this.historyRepository.list({
        // eq(policies.organization_uid, organization_uid)
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching policies');
    }
  }
  
  async findOne(id: number) {
    const policy = await this.historyRepository.get('id', id);
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found.`);
    }
    return policy;
  }

}
