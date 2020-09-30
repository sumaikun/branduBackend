import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ChronosService } from './chronos.service';
import { ChronosDto } from './dto/chronos-dto';
import { Chronos } from './interface/chronos.interface';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard, RolesGuard } from '../auth/guards/custom.guards';
import { AccessUser } from '../auth/decorators/custom.decorators'
import {Roles} from '../auth/decorators/custom.decorators'

@Controller('chronos')
@UseGuards(AuthGuard('jwt'))
export class ChronosController {
    constructor(private readonly ChronosService: ChronosService) {}

    @Get()
    @UseGuards(UserGuard)
    async getChronos(@AccessUser() user: any): Promise<any[]> {
        
        if(user.role === "ADMIN")
        {
            return this.ChronosService.findAll();
        }
       
        return this.ChronosService.findByManySupplier(user.suppliers)
        
    }

    @Get(':id')
    async getChronosById(@Param('id') id): Promise<Chronos> {
        return this.ChronosService.findOne(id);
    }

    @Roles('ADMIN','OPERATOR')
    @UseGuards(UserGuard,RolesGuard)
    @Post()
    create(@Body() Chronos: ChronosDto): Promise<Chronos> {
        return this.ChronosService.create(Chronos);
    }

    @Roles('ADMIN','OPERATOR')
    @UseGuards(UserGuard,RolesGuard)
    @Put(':id')
    async editChronos(@Param('id') id, @Body() Chronos: ChronosDto): Promise<Chronos> {
        return this.ChronosService.update(id, Chronos);
    }

    @Roles('ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    @Delete(':id')
    async deleteChronos(@Param('id') id): Promise<boolean> {
        return this.ChronosService.delete(id);
    }
}

