import { Injectable } from '@nestjs/common';
import { Chronos } from './interface/chronos.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChronosDto } from './dto/chronos-dto';

@Injectable()
export class ChronosService {

    constructor(@InjectModel('Chronos') private readonly chronosModel: Model<Chronos>) {}

    async create(createChronosDto: ChronosDto): Promise<Chronos> {
        const createChronos = new this.chronosModel(createChronosDto);
        return await createChronos.save();
    }

    async findAll(): Promise<Chronos[]> {
        return await this.chronosModel.find()
        .populate({path:'supplier', model:'Supplier'})
        .populate('created_by')
        .populate('modified_by').exec();        
    }

    async findOne(id:string){
        return await this.chronosModel.findOne( {_id : id }).populate('created_by').populate('modified_by')       
    }

    async update(id:string,updateChronosDto: ChronosDto){
        return await this.chronosModel.updateOne({_id : id},updateChronosDto);        
    }

    async delete(id:string){
        const response  = await this.chronosModel.deleteOne({_id :id});
        return response["ok"] > 0
    }

    async findBySupplier(supplier:string){
        return await this.chronosModel.find({ "supplier" : supplier });
    }

    async findByManySupplier(suppliers:Array<string>){
        return await this.chronosModel.find().where('supplier').in(suppliers).populate({path:'supplier', model:'Supplier'})
        .populate('created_by')
        .populate('modified_by').exec();       
    }

    async findByExecuteHour(executeHour:string){
        return await this.chronosModel.find({ "executeHour" : executeHour });
    }

    async findIfRuleOnChronos(ruleId:string){
        return await this.chronosModel.find({rules:ruleId})
    }

}
