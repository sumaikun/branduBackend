import { Document } from 'mongoose';

export interface Rule extends Document{
    id: string;
    ruleType: string;
    operationType: string;
    if: string;  
    then: string;    
    supplier: string;   
    selectedFields: string[];    
    similarity: string;
}
