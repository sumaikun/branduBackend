import { Injectable } from '@nestjs/common';
import { Rule } from './interface/rule.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RuleDto } from './dto/rule-dto';
import * as stringSimilarity from '../../node_modules/string-similarity'

@Injectable()
export class RulesService {

    constructor(@InjectModel('Rule') private readonly ruleModel: Model<Rule>) {}

    async create(createRuleDto: RuleDto): Promise<Rule> {
        const createRule = new this.ruleModel(createRuleDto);
        return await createRule.save();
    }

    async findAll(): Promise<Rule[]> {
        return await this.ruleModel.find()
        .populate({path:'suppliers', model:'Supplier'})
        .populate('created_by')
        .populate('modified_by').exec();        
    }

    async findOne(id:string){
        return await this.ruleModel.findOne( {_id : id }).populate('created_by').populate('modified_by')       
    }

    async update(id:string,updateRuleDto: RuleDto){
        return await this.ruleModel.updateOne({_id : id},updateRuleDto);        
    }

    async delete(id:string){
        const response  = await this.ruleModel.deleteOne({_id :id});
        return response["ok"] > 0
    }

    async findBySupplier(supplier:string){
        return await this.ruleModel.find({ "supplier" : supplier });
    }

    async executeRulesOnData(data:any){
        let testData = []

        await Promise.all(

        data.rules.map( async ruleId => {

           console.log("rule iteration")
            
           const rule = await this.findOne(ruleId)

           console.log("rule",rule)
            
           data.exampleData.map( line => {

            //console.log("line",line)

            testData = insertIntoArray(testData,line)
            
            let copyLine = JSON.parse(JSON.stringify(line))

            //let copyLine = Object.assign({}, line); 

            //copyLine.id = "T"+copyLine.id

            copyLine.id = line.id+1

            copyLine.originalId = line.id

            if(rule.ruleType === "GRAMMAR_CORRECTION"){

                if(rule.operationType === "ADD")
                {
                    rule.fieldsToCheck.map(
                        field =>{
                            const ifWords = rule.if.split(",")
                            ifWords.map( word => {
                                if(word){

                                    if(copyLine[field] && copyLine[field].includes(word) && !copyLine[field].includes(rule.then) 
                                     && !rule.similarity)
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

                                        if( ruleSimilarity > 0 && !copyLine[field].includes(rule.then) )
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

                                        //console.log("ruleSimilarity",ruleSimilarity)
                                        
                                        if( ruleSimilarity > 0 )
                                        {
                                            if( field === "tags" || field === "product_type" )
                                            {
                                                let didUpdate = false
                                                
                                                copyLine[field].split(",").map( similar => {                                                   

                                                    if( stringSimilarity.compareTwoStrings(word,similar) >=  ruleSimilarity)
                                                    {
                                                        didUpdate = true

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
                                                
                                                if(didUpdate){
                                                    copyLine.mode = "test"
                                                    testData = insertIntoArray(testData,copyLine)
                                                }

                                            }
                                            else if( field === "handle" )
                                            {
                                                let didUpdate = false

                                                copyLine[field].split("-").map( similar => {                                                    

                                                    if( stringSimilarity.compareTwoStrings(word,similar) >=  ruleSimilarity)
                                                    {
                                                        didUpdate = true

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

                                                if(didUpdate){
                                                    copyLine.mode = "test"
                                                    testData = insertIntoArray(testData,copyLine)
                                                }

                                            }
                                            else
                                            {
                                                let didUpdate = false
                                                
                                                copyLine[field].split(" ").map( similar => {
                                                    if( stringSimilarity.compareTwoStrings(word,similar) >=  ruleSimilarity)
                                                    {
                                                        didUpdate = true

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

                                                if(didUpdate){
                                                    copyLine.mode = "test"
                                                    testData = insertIntoArray(testData,copyLine)
                                                }

                                            }

                                            
                                        }
                                        
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