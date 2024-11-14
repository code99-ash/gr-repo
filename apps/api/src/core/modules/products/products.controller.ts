import { 
  Body, 
  Controller, 
  Get, 
  InternalServerErrorException, 
  NotFoundException, 
  Param, Post, Put, Req, 
  UnauthorizedException,
  UseGuards 
} from '@nestjs/common';
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

  @Post('/created')
  async postCreated(payload: any) { }

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
      throw new NotFoundException('Store not found.');
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

  @Post('/:product_id/policies')
  async assignPolicy(
    @Body() body: any,
    @Param('product_id') product_id: string
  )
  {
    try {
      
      const {to_assign, to_unassign} = body

      if(to_assign.length) {
        await this.productsService.assignPolicy(product_id, to_assign)
      }
  
      if(to_unassign.length) {
        await this.productsService.unassignPolicy(product_id, to_unassign)
      }
  
      return 'ok'
    
    }catch(error) {
      throw new InternalServerErrorException("Unable to manage product policy assignments")
    }
  }

  @Put('/assign-policies')
  async assignManytoMany(
    @Body('product_ids') product_ids: string[],
    @Body('policy_uids') policy_uids: string[],
  ) {
    try {

      return this.productsService.assignManytoMany(product_ids, policy_uids)
    
    }catch(error) {
      throw new InternalServerErrorException("Unable to manage product policy assignments")
    }
  }

}
