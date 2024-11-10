import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './product.service';
import { BroadcastStoreCreated } from '../stores/store.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async getMyProducts(@Body() payload: BroadcastStoreCreated) {
    return this.productsService.asyncFetch(payload);
  }
}
