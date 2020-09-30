import { Injectable } from '@nestjs/common';
import { Supplier } from './interface/supplier.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier as SupplierDto } from './dto/supplier';

@Injectable()
export class SuppliersService {

    constructor(@InjectModel('Supplier') private readonly supplierModel: Model<Supplier>) {}

    async create(createSupplierDto: SupplierDto): Promise<Supplier> {
        const createSupplier = new this.supplierModel(createSupplierDto);
        return await createSupplier.save();
    }

    async findAll(): Promise<Supplier[]> {
        return await this.supplierModel.find()       
        .populate('created_by')
        .populate('modified_by')
        .exec();        
    }

    async findOne(id:string){
        return await this.supplierModel.findOne( {_id : id }).populate('created_by').populate('modified_by')       
    }

    async update(id:string,updateSupplierDto: SupplierDto){
        return await this.supplierModel.updateOne({_id : id},updateSupplierDto);        
    }

    async delete(id:string){
        const response  = await this.supplierModel.deleteOne({_id :id});
        return response["ok"] > 0
    }

    async findOneByEmail(email:string){
        return await this.supplierModel.findOne({ "email" : email });
    }

    async findByManySupplier(suppliers:Array<string>){
        return await this.supplierModel.find().where('_id').in(suppliers).populate('created_by')
        .populate('modified_by').exec();       
    }

}
