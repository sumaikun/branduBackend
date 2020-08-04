import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

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
    @IsOptional()
    photoUrl:string;
    @IsIn(["SMALL", "MEDIAN", "BIG", "PERSONAL"])
    type: string;
}
