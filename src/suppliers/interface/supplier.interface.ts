import { Document } from 'mongoose';

export interface Supplier extends Document{
    id:string;
    city:string;
    address:string;
    vendorId:string;
    phone:string;
    photoUrl:string;
    type:string;
}
