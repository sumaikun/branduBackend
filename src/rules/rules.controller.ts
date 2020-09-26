import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { RulesService } from './rules.service';
import {  VersionService  } from '../rulesVersion/rulesVersion.service';
import { RuleDto } from './dto/rule-dto';
import { Rule } from './interface/rule.interface';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('rules')
@UseGuards(AuthGuard('jwt'))
export class RulesController {
    constructor(private readonly RulesService: RulesService,
        private readonly VersionService: VersionService) {}

    @Get()
    async getRules(): Promise<any[]> {
        return this.RulesService.findAll();
    }

    @Get(':id')
    async getRule(@Param('id') id): Promise<Rule> {
        return this.RulesService.findOne(id);
    }

    @Get('bySupplier/:id')
    async getBySupplier(@Param('id') id): Promise<Rule[]> {
        return this.RulesService.findBySupplier(id);
    }

    @Post()
    create(@Body() Rule: RuleDto): Promise<Rule> {

        return this.RulesService.create(Rule);
    }

    @Put(':id')
    async editRule(@Param('id') id, @Body() Rule: RuleDto): Promise<Rule> {

        const currentRule = await this.RulesService.findOne(id);
        
        //console.log(arraysEqual(currentRule.selectedFields,Rule.selectedFields))

        /*   */

        if( arraysEqual(currentRule.selectedFields,Rule.selectedFields) &&
            arraysEqual(currentRule.fieldsToCheck,Rule.fieldsToCheck) &&   
            currentRule.if === Rule.if &&    
            currentRule.then === Rule.then &&  
            currentRule.ruleType === Rule.ruleType &&   
            currentRule.operationType === Rule.operationType &&
            currentRule.supplier.toString() === Rule.supplier &&
            currentRule.similarity.toString() === Rule.similarity.toString()
        )
        {
            throw new BadRequestException('Can not update rule with the same data');
        }
        
        const versionsSaved = await this.VersionService.findByRule(id)

        let versionExist = false

        console.log("versionsSaved",versionsSaved)

        versionsSaved.map( data => {
            if( arraysEqual(data.selectedFields,Rule.selectedFields) &&
                arraysEqual(data.fieldsToCheck,Rule.fieldsToCheck) &&   
                data.if === Rule.if &&    
                data.then === Rule.then &&  
                data.ruleType === Rule.ruleType &&   
                data.operationType === Rule.operationType &&
                data.supplier.toString() === Rule.supplier &&
                data.similarity.toString() === Rule.similarity.toString()
            )
            {
                versionExist = true
            }
        })
       
        if(!versionExist)
        {
            const copyRule = { ...Rule , originalRule:id }
            await this.VersionService.create( copyRule )
        }

        return this.RulesService.update(id, Rule);
    }

    @Get('versions/:id')
    async versions(@Param('id') id): Promise<Rule[]> {
        return this.VersionService.findByRule(id);
    }

    @Delete(':id')
    async deleteRule(@Param('id') id): Promise<boolean> {
        return this.RulesService.delete(id);
    }

    @Post('testRules')
    async testRules(@Body() data: any) {

        console.log("start algorythm")

        //console.log(data)
        const testData = await this.RulesService.executeRulesOnData(data)
       
        console.log("return data")

        return testData
    }

  
}


function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
}