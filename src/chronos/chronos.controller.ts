import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

import { ChronosService } from './chronos.service';
import { ChronosDto } from './dto/chronos-dto';
import { Chronos } from './interface/chronos.interface';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('chronos')
@UseGuards(AuthGuard('jwt'))
export class ChronosController {
    constructor(private readonly ChronosService: ChronosService) {}

    @Get()
    async getChronos(): Promise<any[]> {
        return this.ChronosService.findAll();
    }

    @Get(':id')
    async getChronosById(@Param('id') id): Promise<Chronos> {
        return this.ChronosService.findOne(id);
    }

    @Post()
    create(@Body() Chronos: ChronosDto): Promise<Chronos> {
        return this.ChronosService.create(Chronos);
    }

    @Put(':id')
    async editChronos(@Param('id') id, @Body() Chronos: ChronosDto): Promise<Chronos> {
        return this.ChronosService.update(id, Chronos);
    }

    @Delete(':id')
    async deleteChronos(@Param('id') id): Promise<boolean> {
        return this.ChronosService.delete(id);
    }
}

