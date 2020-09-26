import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { ProductTraceService } from './productTrace.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as moment from 'moment'

@Controller('productTrace')
@UseGuards(AuthGuard('jwt'))
export class ProductTraceController {
    constructor(private readonly productTraceService: ProductTraceService,
        ) {} 

    @Get(':fromDate/:toDate')
    async findBetweenDates(@Param('fromDate') fromDate,@Param('toDate') toDate): Promise<any> {
        console.log(fromDate,toDate)
        const from = moment(fromDate).format('YYYY/MM/DD')
        const to = moment(toDate).add(1,'d').format('YYYY/MM/DD')
        return await this.productTraceService.findBetweenDates(new Date(from), new Date(to));
    }

}

