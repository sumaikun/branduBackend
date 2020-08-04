import { Document } from 'mongoose';

export interface User extends Document{
    id: string;
    nickname: string;
    name: string;
    lastName: string;
    phone: string;
    cellPhone: string;
    city: string;
    address: string;
    email:string;
    password:string;
    role: string;
    documentType: string;
    documentNumber: string;
    photoUrl: string;
}
