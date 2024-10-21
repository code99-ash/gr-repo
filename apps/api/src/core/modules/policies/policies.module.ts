import { Module } from '@nestjs/common';
import { DbModule } from 'src/common/db/db.module';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { PoliciesRepository } from './policies.repository';
import { PolicyHistoriesModule } from '../policy_histories/policy_histories.module';

@Module({
  imports: [DbModule, PolicyHistoriesModule],
  controllers: [PoliciesController],
  providers: [PoliciesService, PoliciesRepository]
})
export class PoliciesModule {}
