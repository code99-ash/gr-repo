import { Body, Controller, Get, InternalServerErrorException, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { BroadcastStoreCreated } from '../stores/store.interface';
import { Permissions } from 'src/common/decorators/permissions';
import { Actions, Resources } from 'src/common/modules/auth/permissions.interface';
import { ORM } from 'src/common/repository';
import { Request as IRequest } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/modules/auth/jwt-auth.guard';
import { SafeBaseAccount } from '../accounts/db/accounts.db';
import { StoresService } from '../stores/stores.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storesService: StoresService,
  ) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
  async fetch(@Req() req: IRequest) {
    if(!req.user) {
      throw new UnauthorizedException();
    }

    const user = req.user as ORM<typeof SafeBaseAccount>;

    const store = await this.storesService.find(user.organization_uid);
    if(!store) {
      throw new UnauthorizedException('Store not found');
    }

    return this.productsService.fetch(store.uid);

  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
  async find(@Req() req: IRequest, @Param('id') product_id: string) {
    if(!req.user) {
      throw new UnauthorizedException();
    }

    const user = req.user as ORM<typeof SafeBaseAccount>;

    const store = await this.storesService.find(user.organization_uid);
    if(!store) {
      throw new UnauthorizedException('Store not found');
    }

    return this.productsService.find(store.uid, product_id);

  }

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
