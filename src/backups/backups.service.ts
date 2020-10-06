import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model , Types } from 'mongoose';


@Injectable()
export class ProductBackupService {

    constructor(@InjectModel('ProductBackup') private readonly productBackupModel: Model<any>) {}

    async create(input: any): Promise<any> {
        const createproductBackupModel = new this.productBackupModel(input);
        return await createproductBackupModel.save();
    }

    async update(id:string,input: any){
        return await this.productBackupModel.updateOne({_id : id},input);        
    }

    async findBetweenDates(fromDate: Date, toDate: Date): Promise<any> {
        //Date(2012, 7, 14)
        return await this.productBackupModel.find({updatedAt:{
            $gte: fromDate,
            $lt: toDate
        }}).populate('supplier').populate('chronos');
    }



}
