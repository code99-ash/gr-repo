import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException, NotFoundException, Patch } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { BroadcastStoreCreated } from '../stores/store.interface';
import { JWTAuthGuard } from 'src/common/modules/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators/permissions';
import { Actions, Resources } from 'src/common/modules/auth/permissions.interface';
import { Request as IRequest } from 'express';
import { SafeBaseAccount } from '../accounts/db/accounts.db';
import { ORM } from 'src/common/repository';
import { StoresService } from '../stores/stores.service';
import { CollectionPolicyDto } from './dto/collection-policy.dto';

@Controller('collections')
export class CollectionsController {
    constructor(
        private readonly collectionsService: CollectionsService,
        private readonly storesService: StoresService
    ) {}

    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    @Get()
    async fetch(@Req() req: IRequest) {
        if(!req.user) {
            throw new UnauthorizedException();
        }

        const user = req.user as ORM<typeof SafeBaseAccount>;

        const findStore = await this.storesService.find(user.organization_uid);
        if(!findStore) {
            throw new NotFoundException('Store not found')
        }

        const data = await this.collectionsService.fetch(findStore.uid)

        return data;
    }

    @Post()
    create(@Body() payload: BroadcastStoreCreated) {
        this.collectionsService.asyncFetchCollect(payload)
    }

    @Post('/policies')
    async assignPolicy(@Body() payload: CollectionPolicyDto) {
        return await this.collectionsService.assignPolicy(payload)
    }

    @Patch('/policies')
    async unassignPolicy(@Body() payload: CollectionPolicyDto) {
        return await this.collectionsService.unassignPolicy(payload)
    }
  
}
