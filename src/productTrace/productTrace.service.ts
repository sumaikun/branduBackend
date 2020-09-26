import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model , Types } from 'mongoose';


@Injectable()
export class ProductTraceService {

    constructor(@InjectModel('ProductTrace') private readonly productTraceModel: Model<any>) {}

    async create(input: any): Promise<any> {
        const createRule = new this.productTraceModel(input);
        return await createRule.save();
    }

    async update(id:string,input: any){
        return await this.productTraceModel.updateOne({_id : id},input);        
    }

    async findBetweenDates(fromDate: Date, toDate: Date): Promise<any> {
        //Date(2012, 7, 14)
        return await this.productTraceModel.find({updatedAt:{
            $gte: fromDate,
            $lt: toDate
        }});
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
