import { Controller, Get, Param, Patch, Post, Delete, Body } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Controller('policies')
export class PoliciesController {
    constructor(private readonly policiesService: PoliciesService) {}

    @Get()
    async findAll() {
        return await this.policiesService.findAll()
    }

    @Get(':uid')
    async findOne(@Param('uid') uid: string) {
        return await this.policiesService.findOne(uid)
    }

    @Post()
    async create(@Body() createPolicyDto: CreatePolicyDto) {
        return this.policiesService.create(createPolicyDto)
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
