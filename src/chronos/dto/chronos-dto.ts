import {  IsIn, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class ChronosDto {
    @IsOptional()
    id: string;    
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    supplier: string;
    @IsNotEmpty()
    description: string;
    @IsBoolean()
    automatical: boolean;
    rules: string[];
    @IsNotEmpty()
    executeHour: string;
}
