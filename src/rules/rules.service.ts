import { Injectable } from '@nestjs/common';
import { Rule } from './interface/rule.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RuleDto } from './dto/rule-dto';

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

}
