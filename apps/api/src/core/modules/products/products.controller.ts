import { Body, Controller, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { BroadcastStoreCreated } from '../stores/store.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async getMyProducts(@Body() payload: BroadcastStoreCreated) {
    return this.productsService.asyncFetch(payload);
  }

  @Post('/:product_id/policies')
  async assignPolicy(
    @Body() body: any,
    @Param('product_id') product_id: string
  )
  {
    try {
      
      console.log('body', body)
      const {to_assign, to_unassign} = body
      console.log('to_assign', to_assign)
      console.log('to_unassign', to_unassign)

      if(to_assign.length) {
        console.log('Assigning policies')
        await this.productsService.assignPolicy(product_id, to_assign)
      }
  
      if(to_unassign.length) {
        console.log('Unassigning policies')

        await this.productsService.unassignPolicy(product_id, to_unassign)
      }
  
      return 'ok'
    
    }catch(error) {
      throw new InternalServerErrorException("Unable to manage product policy assignments")
    }
  }

}
