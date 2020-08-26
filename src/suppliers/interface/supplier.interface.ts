import { Document } from 'mongoose';

export interface Supplier extends Document{
    id:string;
    city:string;
    address:string;
    vendorId:string;
    phone:string;
    photoUrl:string;
    type:string;
    nit:string;
    contact1Name:string;
    contact1Phone:string;
    contact1Email:string;
    contact2Name:string;
    contact2Phone:string;
    contact2Email:string;
}
