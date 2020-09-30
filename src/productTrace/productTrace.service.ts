import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model , Types } from 'mongoose';


@Injectable()
export class ProductTraceService {

    constructor(@InjectModel('ProductTrace') private readonly productTraceModel: Model<any>) {}

    async create(input: any): Promise<any> {
        const createproductTraceModel = new this.productTraceModel(input);
        return await createproductTraceModel.save();
    }

    async findOne(id:string){
        return await this.productTraceModel.findOne( {_id : id }).populate('created_by').populate('modified_by')       
    }

    async update(id:string,input: any){
        return await this.productTraceModel.updateOne({_id : id},input);        
    }

    async findBetweenDates(fromDate: Date, toDate: Date): Promise<any> {
        //Date(2012, 7, 14)
        return await this.productTraceModel.find({updatedAt:{
            $gte: fromDate,
            $lt: toDate
        }}).populate('supplier').populate('chronos');
    }

    async findBetweenDatesByManySupplier(fromDate: Date, toDate: Date,suppliers:Array<string>){
        return await this.productTraceModel.find({updatedAt:{
            $gte: fromDate,
            $lt: toDate
        }}).where('supplier').in(suppliers)
        .populate('supplier').populate('chronos')
        .populate('created_by')
        .populate('modified_by').exec();       
    }

    async findBetweenDatesWithID(fromDate: Date, toDate: Date, id: string): Promise<any> {
        //Date(2012, 7, 14)
        return await this.productTraceModel.find({updatedAt:{
            $gte: fromDate,
            $lt: toDate
        },shopifyId:id});
        //},_id: Types.ObjectId(id)});
    }



}
