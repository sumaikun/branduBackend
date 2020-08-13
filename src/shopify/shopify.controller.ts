import { Controller, Get, Post, Put, Delete, Param, Body , HttpService } from '@nestjs/common';


import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('shopify')
@UseGuards(AuthGuard('jwt'))
export class ShopifyController {
    constructor(private readonly httpService: HttpService) {}

    @Get("/allProducts/:page")
    async allProducts(@Param('page') page) {
        //console.log("process.env",process.env)
        
        const products = await this.httpService.get(process.env.SHOPIFY_CONNECTION+"products.json?limit=250").toPromise();
        //console.log("products",products.data)
        return products.data    
    }

    @Get("/byVendor/:vendor/:page")
    async byVendor(@Param('vendor') vendor, @Param('page') page) {
        //console.log("process.env",process.env)
        
        const products = await this.httpService.get(process.env.SHOPIFY_CONNECTION+"products.json?limit=250&vendor="+vendor).toPromise();
        //console.log("products",products.data)
        return products.data    
    }

   
}

