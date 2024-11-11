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
    async findAll() {
        return await this.policiesService.findAll()
    }

    @Post('/not-in-array')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    async filterFetch(@Body() filters: string[], @Req() req: IRequest) {
        if(!req.user) {
            throw new UnauthorizedException();
        }

        return await this.policiesService.filterFetch(filters)
    }

    @Post('/in-array')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @Permissions([`*:*:${Resources.USER}:${Actions.READ}`])
    async filterFetchInArray(@Body() filters: string[], @Req() req: IRequest) {
        if(!req.user) {
            throw new UnauthorizedException();
        }

        return await this.policiesService.filterFetchInArray(filters)
    }

    @Get(':uid')
    async findOne(@Param('uid') uid: string) {
        return await this.policiesService.findOne(uid)
    }

    @Post()
    async create(@Body() createPolicyDto: CreatePolicyDto) {
        return this.policiesService.create(createPolicyDto)
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
        if(!req.user) {
            throw new UnauthorizedException();
        }

        const user = req.user as ORM<typeof SafeBaseAccount>;
        return this.policiesService.updateStatus(uid, updatePolicyStatusDto, user.user_uid)
    }

    @Patch(':uid')
    async update(
        @Param('uid') uid: string, 
        @Body() updatePolicyDto: UpdatePolicyDto
    ) {
        return this.policiesService.update(uid, updatePolicyDto)
    }

    @Delete(':uid')
    async remove(@Param('uid') uid: string) {
        return await this.policiesService.delete(uid)
    }
}
