import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { DbModule } from 'src/common/db/db.module';
import { PassportModule } from '@nestjs/passport';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    DbModule,
    PassportModule,
    OrdersModule
  ],
  controllers: [StoresController],
  providers: [StoresService, StoresRepository],
  exports: [StoresService],
})
export class StoresModule {}
