import { Controller } from '@nestjs/common';
import { PolicyHistoryService } from './policy_histories.service';

@Controller('policy_histories')
export class PolicyHistoriesController {
    constructor(private readonly policyHistoryService: PolicyHistoryService) {}

   
}
