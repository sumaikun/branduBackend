import { Document } from 'mongoose';

export interface Chronos extends Document{
    id: string;
    title: string;
    supplier: string;
    description: string;  
    automatical: boolean;    
    rules: string[];
    executeHour: string;    
}
