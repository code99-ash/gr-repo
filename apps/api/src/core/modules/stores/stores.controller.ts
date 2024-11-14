import { Controller, Get, Param, Query, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { StoresService } from './stores.service';
import { Request as IRequest } from 'express';
import { JWTAuthGuard } from 'src/common/modules/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators/permissions';
import { Actions, Resources } from 'src/common/modules/auth/permissions.interface';
import { SafeBaseAccount, store_types } from 'src/common/db/schemas';
import { ORM } from 'src/common/repository';

@Controller('stores')
export class StoresController {
    constructor(
        private readonly storesService: StoresService
    ) {}

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

        const response = await this.storesService.createStore(req, {
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
