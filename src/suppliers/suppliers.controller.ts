import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Supplier as SupplierDto } from './dto/supplier';
import { Supplier } from './interface/supplier.interface';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard, RolesGuard } from '../auth/guards/custom.guards';
import {Roles} from '../auth/decorators/custom.decorators'
import { AccessUser } from '../auth/decorators/custom.decorators'

@Controller('suppliers')
@UseGuards(AuthGuard('jwt'))
export class SuppliersController {
    constructor(private readonly SuppliersService: SuppliersService) {}

    @Get()
    @UseGuards(UserGuard)
    async getSuppliers(@AccessUser() user: any): Promise<any[]> {
        if(user.role === "ADMIN")
        {
            return this.SuppliersService.findAll();
        }

        return this.SuppliersService.findByManySupplier(user.suppliers)
        
    }

    @Get(':id')
    @Roles('ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    async getSupplier(@Param('id') id): Promise<Supplier> {
        return this.SuppliersService.findOne(id);
    }

    @Post()
    @Roles('ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    create(@Body() Supplier: SupplierDto): Promise<Supplier> {
        return this.SuppliersService.create(Supplier);
    }

    @Put(':id')
    @Roles('ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    async editSupplier(@Param('id') id, @Body() Supplier: SupplierDto): Promise<Supplier> {
        return this.SuppliersService.update(id, Supplier);
    }

    @Delete(':id')
    @Roles('ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    async deleteSupplier(@Param('id') id): Promise<boolean> {
        return this.SuppliersService.delete(id);
    }
}

