import { Module, forwardRef } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { DbModule } from 'src/common/db/db.module';
import { PassportModule } from '@nestjs/passport';
import { OrdersModule } from '../orders/orders.module';
import { StoresListener } from './stores.listener';
import { ProductsModule } from '../products/products.module';
import { CollectionsModule } from '../collections/collections.module';

@Module({
  imports: [
    DbModule,
    PassportModule,
    OrdersModule,
    forwardRef(() => ProductsModule),
    forwardRef(() => CollectionsModule),
  ],
  controllers: [StoresController],
  providers: [StoresService, StoresRepository, StoresListener],
  exports: [StoresService],
})
export class StoresModule {}
