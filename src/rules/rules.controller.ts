import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RuleDto } from './dto/rule-dto';
import { Rule } from './interface/rule.interface';
import * as bcrypt from 'bcryptjs';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('rules')
@UseGuards(AuthGuard('jwt'))
export class RulesController {
    constructor(private readonly RulesService: RulesService) {}

    @Get()
    async getRules(): Promise<any[]> {
        return this.RulesService.findAll();
    }

    @Get(':id')
    async getRule(@Param('id') id): Promise<Rule> {
        return this.RulesService.findOne(id);
    }

    @Post()
    create(@Body() Rule: RuleDto): Promise<Rule> {

        return this.RulesService.create(Rule);
    }

    @Put(':id')
    async editRule(@Param('id') id, @Body() Rule: RuleDto): Promise<Rule> {

        return this.RulesService.update(id, Rule);
    }

    @Delete(':id')
    async deleteRule(@Param('id') id): Promise<boolean> {
        return this.RulesService.delete(id);
    }
}
