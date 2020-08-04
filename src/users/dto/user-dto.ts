import { IsEmail, IsIn, IsOptional, IsNotEmpty } from 'class-validator';

export class UserDto {
    @IsOptional()
    id: string;
    @IsNotEmpty()
    nickname: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    lastName: string;
    @IsOptional()
    phone: string;
    @IsOptional()
    cellPhone: string;
    @IsNotEmpty()
    city: string;
    @IsOptional()
    address: string;
    @IsEmail()
    email:string;
    @IsOptional()
    password:string;
    @IsIn(["ADMIN", "OPERATOR","AUDITOR"])
    role: string;
    @IsIn(["CC", "PS", "CE"])
    documentType: string;
    documentNumber: string;  
    @IsOptional()
    photoUrl: string;
    @IsIn(["ACTIVE", "INACTIVE"])
    state: string;
}
