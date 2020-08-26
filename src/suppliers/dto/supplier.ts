import { IsNotEmpty, IsOptional, IsIn, IsEmail } from 'class-validator';

export class Supplier {
    @IsOptional()
    id:string;
    @IsNotEmpty()
    city:string;
    @IsNotEmpty()
    address:string;
    @IsNotEmpty()
    vendorId:string;
    @IsNotEmpty()
    phone:string;
    @IsNotEmpty()
    nit:string;
    @IsOptional()
    photoUrl:string;
    @IsIn(["SMALL", "MEDIAN", "BIG", "PERSONAL"])
    type: string;
    @IsOptional()
    notes:string;
    @IsOptional()
    contact1Name:string;
    @IsOptional()
    contact1Phone:string;
    @IsOptional()
    @IsEmail()
    contact1Email:string;
    @IsOptional()
    contact2Name:string;
    @IsOptional()
    contact2Phone:string;
    @IsOptional()
    @IsEmail()
    contact2Email:string;
}
