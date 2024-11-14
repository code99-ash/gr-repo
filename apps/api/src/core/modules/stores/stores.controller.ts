import { Controller, Get, Param, Query, Req, UseGuards, UnauthorizedException, Post, InternalServerErrorException, Body } from '@nestjs/common';
import { StoresService } from './stores.service';
import { Request as IRequest } from 'express';
import { JWTAuthGuard } from 'src/common/modules/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators/permissions';
import { Actions, Resources } from 'src/common/modules/auth/permissions.interface';
import { SafeBaseAccount, store_types } from 'src/common/db/schemas';
import { ORM } from 'src/common/repository';
import { BroadcastStoreCreated } from './store.interface';
import { StoresListener } from './stores.listener';
import axios from 'axios';

@Controller('stores')
export class StoresController {
    constructor(
        private readonly storesService: StoresService,
        private readonly storesListener: StoresListener,
    ) {}

    // Test Endpoints
    @Post('webhook')
    async registerWebhooks(@Body() payload: BroadcastStoreCreated) {
        try {
            return await this.storesListener.registerShopifyWebhooks(payload)
        }catch(error: any) {
            throw new InternalServerErrorException('Failed to complete webhook register')
        }
    }

    // Test Endpoints
    @Post('webhook/fetch')
    async getWebhooks(
        @Body('store_domain') store_domain: string,
        @Body('access_key') access_key: string,
    ) {
        try {
            return await this.storesListener.getWebhooks(store_domain, access_key)
        }catch(error: any) {
            throw new InternalServerErrorException('Failed to complete webhook register')
        }
    }

    // Test Endpoints
    @Post('webhook/update/:store_uid')
    async updateWebhooks(
        @Body('store_domain') store_domain: string,
        @Body('access_key') access_key: string,
        @Body('id') webhook_id: number,
        @Body('address') address: string,
        @Param('store_uid') store_uid: string
    ) {
        try {
        const response = await axios.put(
            `https://${store_domain}/admin/api/2024-01/webhooks/${webhook_id}.json`, 
            {
            webhook: {
                address: `${address}/${store_uid}`,
            },
            },
            {
            headers: {
                'X-Shopify-Access-Token': access_key,
                'Content-Type': 'application/json',
            },
            }
        );

        return response.data;
        
        } catch (error: any) {
        console.error('Error updating webhook:', error.response?.data || error.message);
        throw new InternalServerErrorException('Failed to complete webhook update');
        }
    }

    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    @Get('authorize/:store_type')
    authorizeStore(@Param('store_type') type: store_types, @Query('store_domain') domain: string, @Req() req: IRequest) {
        if(!req.user) {
            throw new UnauthorizedException();
        }

        return this.storesService.authorizeStore(type, domain);
    }

    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    @Get('authorize/callback/:store_type')
    async authorizeCallback(

        @Param('store_type') store_type: store_types, 
        @Query('shop') shop: string, 
        @Query('code') code: string, 
        @Req() req: IRequest

    ) {

        if(!req.user) {
            throw new UnauthorizedException();
        }

        const user = req.user as ORM<typeof SafeBaseAccount>;

        const data = await this.storesService.authorizeCallback(shop, code);

        const response = await this.storesService.createStore({
            store_name: shop,
            api_key: {
                access_token: data.access_token,
            },
            store_type: store_type,
            organization_uid: user.organization_uid,
        })

        return response;
    }
  
}
