import { Controller, Get, Param, Patch, Post, Delete, Body, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyStatusDto } from './dto/update-policy-status.dto';
import { JWTAuthGuard } from 'src/common/modules/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators/permissions';
import { Actions, Resources } from 'src/common/modules/auth/permissions.interface';
import { ORM } from 'src/common/repository';
import { Request as IRequest } from 'express';
import { SafeBaseAccount } from '../accounts/db/accounts.db';


@Controller('policies')
export class PoliciesController {
    constructor(private readonly policiesService: PoliciesService) {}

    @Get()
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    async findAll(@Req() req: IRequest) {
  
        if(!req.user) throw new UnauthorizedException();
        const user = req.user as ORM<typeof SafeBaseAccount>;
        return await this.policiesService.findAll(user.organization_uid)
        
    }

    @Post('/not-in-array')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    async filterFetch(@Body() filters: string[], @Req() req: IRequest) {

        if(!req.user) throw new UnauthorizedException();
        const user = req.user as ORM<typeof SafeBaseAccount>;
        return await this.policiesService.filterFetch(filters, user.organization_uid)

    }

    @Post('/in-array')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    async filterFetchInArray(@Body() filters: string[], @Req() req: IRequest) {
        
        if(!req.user) throw new UnauthorizedException();
        const user = req.user as ORM<typeof SafeBaseAccount>;

        return await this.policiesService.filterFetchInArray(filters, user.organization_uid)
    }

    @Get(':uid')
    async findOne(@Param('uid') uid: string) {
        return await this.policiesService.findOne(uid)
    }

    @Post()
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    async create(@Body() createPolicyDto: CreatePolicyDto, @Req() req: IRequest) {

        if(!req.user) throw new UnauthorizedException();
        const user = req.user as ORM<typeof SafeBaseAccount>;
        
        return this.policiesService.create(createPolicyDto, user.organization_uid)
    }

    @Put(':uid/status')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    async updateStatus(
        @Param('uid') uid: string, 
        @Body() updatePolicyStatusDto: UpdatePolicyStatusDto,
        @Req() req: IRequest
    ) {
        if(!req.user) throw new UnauthorizedException();
        const user = req.user as ORM<typeof SafeBaseAccount>;

        return this.policiesService.updateStatus(
            uid, 
            updatePolicyStatusDto, 
            user.user_uid, 
            user.organization_uid
        )
    }

    @Patch(':uid')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    async update(
        @Param('uid') uid: string, 
        @Body() updatePolicyDto: UpdatePolicyDto,
        @Req() req: IRequest
    ) {

        if(!req.user) throw new UnauthorizedException();
        const user = req.user as ORM<typeof SafeBaseAccount>;

        return this.policiesService.update(
            uid, 
            updatePolicyDto, 
            user.organization_uid
        )
    }

    @Delete(':uid')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    async remove(@Param('uid') uid: string, @Req() req: IRequest) {

        if(!req.user) throw new UnauthorizedException();
        const user = req.user as ORM<typeof SafeBaseAccount>;

        return await this.policiesService.delete(
            uid, 
            user.organization_uid
        )
    }
}
