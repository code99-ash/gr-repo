import { Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsRepository } from './collections.repository';
import { DbModule } from 'src/common/db/db.module';
import { PassportModule } from '@nestjs/passport';
import { OrdersModule } from '../orders/orders.module';
import { CollectionsService } from './collections.service';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [
    DbModule,
    PassportModule,
    StoresModule
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService, CollectionsRepository],
  exports: [CollectionsService],
})
export class CollectionsModule {}
