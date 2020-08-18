import {  IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class RuleDto {
    @IsOptional()
    id: string;
    @IsIn(["GRAMMAR_CORRECTION","PRICES"])
    ruleType: string;
    @IsOptional()
    @IsIn(["REPLACE","DELETE"])
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
    similarity: string;
}
