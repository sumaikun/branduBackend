import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

import { SuppliersService } from './suppliers.service';
import { Supplier as SupplierDto } from './dto/supplier';
import { Supplier } from './interface/Supplier.interface';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('suppliers')
@UseGuards(AuthGuard('jwt'))
export class SuppliersController {
    constructor(private readonly SuppliersService: SuppliersService) {}

    @Get()
    async getSuppliers(): Promise<any[]> {
        return this.SuppliersService.findAll();
    }

    @Get(':id')
    async getSupplier(@Param('id') id): Promise<Supplier> {
        return this.SuppliersService.findOne(id);
    }

    @Post()
    create(@Body() Supplier: SupplierDto): Promise<Supplier> {
        return this.SuppliersService.create(Supplier);
    }

    @Put(':id')
    async editSupplier(@Param('id') id, @Body() Supplier: SupplierDto): Promise<Supplier> {
        return this.SuppliersService.update(id, Supplier);
    }

    @Delete(':id')
    async deleteSupplier(@Param('id') id): Promise<boolean> {
        return this.SuppliersService.delete(id);
    }
}

