import { Module } from '@nestjs/common';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { ProductsRepository } from './products.repository';
import { DbModule } from 'src/common/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
