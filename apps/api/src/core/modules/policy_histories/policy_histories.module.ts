import { Module } from '@nestjs/common';
import { DbModule } from 'src/common/db/db.module';
import { PolicyHistoriesController } from './policies.controller';
import { PolicyHistoryService } from './policy_histories.service';
import { PolicyHistoryRepository } from './policy_histories.repository';

@Module({
  imports: [DbModule],
  controllers: [PolicyHistoriesController],
  providers: [PolicyHistoryService, PolicyHistoryRepository],
  exports: [PolicyHistoryService]
})
export class PolicyHistoriesModule {}
