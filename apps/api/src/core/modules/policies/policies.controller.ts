import { Controller, Get, Param, Patch, Post, Delete, Body } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { UnprocessedPolicyCreateDto } from './dto/create-policy.dto';
import { NodeRecordDto } from './dto/policy-flow.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';

@Controller('policies')
export class PoliciesController {
    constructor(private readonly policiesService: PoliciesService) {}

    @Get()
    async findAll() {
        return await this.policiesService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.policiesService.findOne(Number(id))
    }

    @Post()
    async create(
        @Body('policy_flow') policy_flow: NodeRecordDto,
        @Body('data') data: UnprocessedPolicyCreateDto
    ) {
        return this.policiesService.create(policy_flow, data)
    }

    @Patch(':id')
    async update(
        @Param('id') id: number, 
        @Body('data') data: UpdatePolicyDto,
        @Body('new_flow') new_flow: NodeRecordDto
    ) {
        return this.policiesService.update(Number(id), data, new_flow)
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return await this.policiesService.delete(Number(id))
    }
}
