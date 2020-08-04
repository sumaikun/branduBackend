import { Injectable } from '@nestjs/common';
import { User } from './interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async create(createUserDto: UserDto): Promise<User> {
        const createUser = new this.userModel(createUserDto);
        return await createUser.save();
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find()
        .populate({path:'suppliers', model:'Supplier'})
        .populate('created_by')
        .populate('modified_by').exec();        
    }

    async findOne(id:string){
        return await this.userModel.findOne( {_id : id }).populate('created_by').populate('modified_by')       
    }

    async update(id:string,updateUserDto: UserDto){
        return await this.userModel.updateOne({_id : id},updateUserDto);        
    }

    async delete(id:string){
        const response  = await this.userModel.deleteOne({_id :id});
        return response["ok"] > 0
    }

    async findOneByEmail(email:string){
        return await this.userModel.findOne({ "email" : email });
    }

}
