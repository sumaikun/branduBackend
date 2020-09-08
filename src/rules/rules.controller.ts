import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RuleDto } from './dto/rule-dto';
import { Rule } from './interface/rule.interface';
import * as bcrypt from 'bcryptjs';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as stringSimilarity from '../../node_modules/string-similarity'

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

    @Get('bySupplier/:id')
    async getBySupplier(@Param('id') id): Promise<Rule[]> {
        return this.RulesService.findBySupplier(id);
    }

    @Post()
    create(@Body() Rule: RuleDto): Promise<Rule> {

        return this.RulesService.create(Rule);
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
                         
                        copyLine.variants[i].price = Number(copyLine.variants[i].price) * Number(dataToMultiply)

                        //console.log("corrected price",copyLine.variants[i].price)
                    }
                }
                
                copyLine.mode = "test"

                //console.log("copyLine",copyLine.id)

                testData = insertIntoArray(testData,copyLine)
            }
           })

           console.log("iteration finish")

        }))

        console.log("return data")

        return testData
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