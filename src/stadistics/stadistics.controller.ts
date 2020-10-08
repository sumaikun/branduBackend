import { Controller, Get, Post, Put, Delete, Param, Body , HttpService } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuppliersService } from '../suppliers/suppliers.service'
import { ProductTraceService } from '../productTrace/productTrace.service'
import { RulesService } from '../rules/rules.service'
import { ProductBackupService } from '../backups/backups.service'
import * as moment from 'moment'

@Controller('stadistics')
@UseGuards(AuthGuard('jwt'))
export class StadisticsController {

    constructor(private readonly suppliersService: SuppliersService,
        private readonly productTraceService: ProductTraceService,
        private readonly rulesService: RulesService,
        private readonly productBackupService: ProductBackupService) {}

    @Get()
    async getStadistics(): Promise<any> {
        //suppliers length
        //backups length
        //rules length
        //fixes length

        const supplierCount = await this.suppliersService.findAll()
        
        var a = moment([2020, 9, 6]);
        var b = moment();
        const days = a.diff(b, 'days') + 1

        const rulesCount = await this.rulesService.findAll()

        const productTraceCount = await this.productTraceService.findAll()

        const cardLabels = []
        cardLabels[0] = { label:"Catalogos", count:supplierCount.length }
        cardLabels[1] = { label:"Backups", count: days}
        cardLabels[2] = { label:"reglas", count: rulesCount.length}
        cardLabels[3] = { label:"fixes", count: productTraceCount.length}        

        const shortMonths = moment.monthsShort()

        const currentMonth = moment().month()

        //console.log(shortMonths,currentMonth)

        const productTraceMonthCount = await this.productTraceService.findByMonth(9)

        const fromIndexMonth = currentMonth - 5

        let monthLabels = []

        let monthCounts = []

        for(let i = fromIndexMonth; i <= currentMonth; i++ )
        {
            console.log(i, shortMonths[i])
            monthLabels.push(shortMonths[i])
            const productTraceMonthCount = await this.productTraceService.findByMonth(i+1)
            monthCounts.push(productTraceMonthCount.length)
        }

        //console.log("productTraceMonthCount",productTraceMonthCount.length)

        return { cardLabels , monthLabels,  monthCounts}

    }

}
