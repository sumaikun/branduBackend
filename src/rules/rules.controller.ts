import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';

import { RulesService } from './rules.service';

import {  VersionService  } from '../rulesVersion/rulesVersion.service';


import { RuleDto } from './dto/rule-dto';
import { Rule } from './interface/rule.interface';
import * as bcrypt from 'bcryptjs';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as stringSimilarity from '../../node_modules/string-similarity'

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

        let testData = []

        await Promise.all(

        data.rules.map( async ruleId => {

           console.log("rule iteration")
            
           const rule = await this.RulesService.findOne(ruleId)

           console.log("rule",rule)
            
           data.exampleData.map( line => {

            //console.log("line",line)

            testData = insertIntoArray(testData,line)
            
            let copyLine = JSON.parse(JSON.stringify(line))

            //let copyLine = Object.assign({}, line); 

            //copyLine.id = "T"+copyLine.id

            copyLine.id = line.id+1

            if(rule.ruleType === "GRAMMAR_CORRECTION"){

                if(rule.operationType === "ADD")
                {
                    rule.fieldsToCheck.map(
                        field =>{
                            const ifWords = rule.if.split(",")
                            ifWords.map( word => {
                                if(word){

                                    if(copyLine[field] && copyLine[field].includes(word) && !rule.similarity)
                                    {
                                        rule.selectedFields.map(
                                            field2=>{
                                                if(field2 === "handle")
                                                {
                                                    copyLine[field2] = copyLine[field2]+"-"+rule.then
                                                }
                                                else{
                                                    copyLine[field2] = copyLine[field2]+","+rule.then
                                                }
                                        })
                                    }else{

                                        const ruleSimilarity = Number(parseInt(rule.similarity)/100)

                                        if( ruleSimilarity > 0 )
                                        {
                                            if( field === "tags" || field === "product_type" )
                                            {
                                                let isTrue = false
                                                copyLine[field].split(",").map( similar => {
                                                    if( stringSimilarity.compareTwoStrings(word,similar) >=  ruleSimilarity)
                                                    {
                                                        isTrue = true
                                                    }
                                                })

                                                if(isTrue){
                                                    rule.selectedFields.map(
                                                    field2=>{                                                           
                                                        copyLine[field2] = copyLine[field2]+","+rule.then                                                            
                                                    })
                                                }

                                            }
                                            else if( field === "handle" )
                                            {
                                                let isTrue = false
                                                copyLine[field].split("-").map( similar => {
                                                    if( stringSimilarity.compareTwoStrings(word,similar) >=  ruleSimilarity)
                                                    {
                                                        isTrue = true
                                                    }
                                                })

                                                if(isTrue){
                                                    rule.selectedFields.map(
                                                    field2=>{                                                           
                                                        copyLine[field2] = copyLine[field2]+"-"+rule.then                                                           
                                                    })
                                                }
                                            }
                                            else
                                            {
                                                let isTrue = false
                                                copyLine[field].split(" ").map( similar => {
                                                    if( stringSimilarity.compareTwoStrings(word,similar) >=  ruleSimilarity)
                                                    {
                                                        isTrue = true
                                                    }
                                                })

                                                if(isTrue){
                                                    rule.selectedFields.map(
                                                        field2=>{                                                           
                                                            copyLine[field2] = copyLine[field2]+" "+rule.then                                                           
                                                    })
                                                }
                                            }
                                        }

                                        
                                    }
                                }
                            })
                        }
                    )

                    copyLine.mode = "test"

                    testData = insertIntoArray(testData,copyLine)
                }
                else
                {
                    rule.selectedFields.map(
                        field=>{
                            const ifWords = rule.if.split(",")
                            ifWords.map( word => {
                                if(word){

                                    if(copyLine[field] && copyLine[field].includes(word)
                                    && ( rule.operationType == "REPLACE" || rule.operationType == "DELETE" ) && !rule.similarity )
                                    {
                                        switch(rule.operationType){
                                            case "REPLACE":
                                                
                                                copyLine[field] = copyLine[field].replace( word, rule.then )

                                            case "DELETE":

                                                copyLine[field] = copyLine[field].replace( word+",", "" )
                                                copyLine[field] = copyLine[field].replace( word, "" )                                       
                                                

                                            default:
                                                break;
                                        }
                                        
                                        copyLine.mode = "test"

                                        testData = insertIntoArray(testData,copyLine)
                                        
                                    }else{
                                        const ruleSimilarity = Number(parseInt(rule.similarity)/100)

                                        if( ruleSimilarity > 0 )
                                        {
                                            if( field === "tags" || field === "product_type" )
                                            {
                                                
                                                copyLine[field].split(",").map( similar => {
                                                    if( stringSimilarity.compareTwoStrings(word,similar) >=  ruleSimilarity)
                                                    {
                                                        switch(rule.operationType){
                                                            case "REPLACE":
                                                                
                                                                copyLine[field] = copyLine[field].replace( word, rule.then )
                
                                                            case "DELETE":
                
                                                                copyLine[field] = copyLine[field].replace( word+",", "" )
                                                                copyLine[field] = copyLine[field].replace( word, "" )                                       
                                                                
                
                                                            default:
                                                                break;
                                                        }
                                                    }
                                                })                                           

                                            }
                                            else if( field === "handle" )
                                            {
                                               
                                                copyLine[field].split("-").map( similar => {
                                                    if( stringSimilarity.compareTwoStrings(word,similar) >=  ruleSimilarity)
                                                    {
                                                        switch(rule.operationType){
                                                            case "REPLACE":
                                                                
                                                                copyLine[field] = copyLine[field].replace( word, rule.then )
                
                                                            case "DELETE":
                
                                                                copyLine[field] = copyLine[field].replace( word+"-", "" )
                                                                copyLine[field] = copyLine[field].replace( word, "" )                                       
                                                                
                
                                                            default:
                                                                break;
                                                        }
                                                    }
                                                })

                                            }
                                            else
                                            {
                                                
                                                copyLine[field].split(" ").map( similar => {
                                                    if( stringSimilarity.compareTwoStrings(word,similar) >=  ruleSimilarity)
                                                    {
                                                        switch(rule.operationType){
                                                            case "REPLACE":
                                                                
                                                                copyLine[field] = copyLine[field].replace( word, rule.then )
                
                                                            case "DELETE":
                
                                                                copyLine[field] = copyLine[field].replace( word+",", "" )
                                                                copyLine[field] = copyLine[field].replace( word, "" )                                       
                                                                
                
                                                            default:
                                                                break;
                                                        }
                                                    }
                                                })

                                            }
                                        }

                                        copyLine.mode = "test"

                                        testData = insertIntoArray(testData,copyLine)
                                    }
                                }
                            })
                            
                        }
                    )
                }
            }

            if(rule.ruleType === "PRICES"){                

                for(let i=0; i<copyLine.variants.length;i++)
                {
                    if(rule.then.includes("price*")){

                        const dataToMultiply = rule.then.replace("price*","")

                        if(!isNaN(parseInt(dataToMultiply)))
                        {
                            copyLine.variants[i].price = Number(copyLine.variants[i].price) * Number(dataToMultiply)

                            //console.log("corrected price",copyLine.variants[i].price)
                        }                       
                        
                    }

                    if(rule.then.includes("price+(")){

                        const checkFormat = rule.then.substring(
                            rule.then.lastIndexOf("(") + 1, 
                            rule.then.lastIndexOf(")")
                        );

                        const numberToMultiply = checkFormat.replace("%", '')

                        if(!isNaN(parseInt(numberToMultiply)))
                        {
                            const newPrice = Number(copyLine.variants[i].price) +  ( Number(copyLine.variants[i].price) *  ( Number(numberToMultiply) / 100 ) )

                            copyLine.variants[i].price = newPrice
                            //console.log("corrected price",copyLine.variants[i].price)
                        }                        
                        
                    }
                }
                
                copyLine.mode = "test"

                //console.log("copyLine",copyLine.id)

                testData = insertIntoArray(testData,copyLine)
            }

            if(rule.ruleType === "COLOR"){
                //console.log("copyLine.variants",copyLine.variants)

                for(let i=0; i<copyLine.variants.length;i++)
                {
                    console.log("copyLine.variants[i].option1?.includes(rule.if)",copyLine.variants[i].option1?.includes(rule.if))
                    if(copyLine.variants[i].option1?.includes(rule.if))
                    {
                        copyLine.variants[i].option1 = rule.then
                    }
                }
                copyLine.mode = "test"

                testData = insertIntoArray(testData,copyLine)
            }

           })

           console.log("iteration finish")

        }))

        console.log("return data")

        return testData
    }

  
}


function insertIntoArray(arrayToInsert,data){
   const index =  arrayToInsert.findIndex( element => element.id === data.id )
   if(index != -1)
   {
        arrayToInsert[index] = { ...arrayToInsert[index] , ...data }
   }
   else{
        arrayToInsert.push(data)
   }

   return arrayToInsert
}

function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
}