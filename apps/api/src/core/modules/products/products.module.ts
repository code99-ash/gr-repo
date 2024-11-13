import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { DbModule } from 'src/common/db/db.module';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [DbModule, StoresModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
