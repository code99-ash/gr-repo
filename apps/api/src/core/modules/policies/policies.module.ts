import { Module } from '@nestjs/common';
import { DbModule } from 'src/common/db/db.module';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { PoliciesRepository } from './policies.repository';

@Module({
  imports: [DbModule],
  controllers: [PoliciesController],
  providers: [PoliciesService, PoliciesRepository],
})
export class PoliciesModule {}
