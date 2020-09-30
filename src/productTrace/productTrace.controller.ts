import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { ProductTraceService } from './productTrace.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as moment from 'moment'
import { UserGuard, RolesGuard } from '../auth/guards/custom.guards';
import {Roles} from '../auth/decorators/custom.decorators'
import { AccessUser } from '../auth/decorators/custom.decorators'

@Controller('productTrace')
@UseGuards(AuthGuard('jwt'))
export class ProductTraceController {
    constructor(private readonly productTraceService: ProductTraceService,
        ) {} 

    @Get(':fromDate/:toDate')
    @UseGuards(UserGuard)
    async findBetweenDates(@Param('fromDate') fromDate,@Param('toDate') toDate,@AccessUser() user: any): Promise<any> {
        console.log(fromDate,toDate)
        const from = moment(fromDate).format('YYYY/MM/DD')
        const to = moment(toDate).add(1,'d').format('YYYY/MM/DD')
        if(user.role === "ADMIN"){            
            return await this.productTraceService.findBetweenDates(new Date(from), new Date(to));
        }
        return await this.productTraceService.findBetweenDatesByManySupplier(new Date(from), new Date(to),user.suppliers);
    }

}

