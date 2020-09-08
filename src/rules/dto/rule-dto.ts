import {  IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class RuleDto {
    @IsOptional()
    id: string;
    @IsIn(["GRAMMAR_CORRECTION","PRICES","COLOR"])
    ruleType: string;
    @IsOptional()
    @IsIn(["REPLACE","DELETE","ADD"])
    operationType: string;
    @IsOptional()
    if: string;
    @IsOptional()
    then: string;
    @IsNotEmpty()
    supplier: string;
    @IsOptional()
    selectedFields: string[];
    @IsOptional()
    fieldsToCheck: string[]
    @IsOptional()
    similarity: string;
}
