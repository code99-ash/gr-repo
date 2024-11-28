import { forwardRef, Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsRepository } from './collections.repository';
import { DbModule } from 'src/common/db/db.module';
import { PassportModule } from '@nestjs/passport';
import { CollectionsService } from './collections.service';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [
    DbModule,
    PassportModule,
    forwardRef(() => StoresModule),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService, CollectionsRepository],
  exports: [CollectionsService],
})
export class CollectionsModule {}
