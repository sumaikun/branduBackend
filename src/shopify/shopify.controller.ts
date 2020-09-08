import { Controller, Get, Post, Put, Delete, Param, Body , HttpService } from '@nestjs/common';


import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('shopify')
@UseGuards(AuthGuard('jwt'))
export class ShopifyController {
    constructor(private readonly httpService: HttpService) {}

    @Get("/countByVendor/:vendor")
    async getCountByVendor(@Param('vendor') vendor) {
        //console.log("process.env",process.env)
        
        const products = await this.httpService.get(process.env.SHOPIFY_CONNECTION+"/products/count.json?vendor="+vendor).toPromise();
        //console.log("products",products.data)
        return products.data    
    }

    @Get("/allProducts")
    async allProducts(@Param('page') page) {
        //console.log("process.env",process.env)
        
        const products = await this.httpService.get(process.env.SHOPIFY_CONNECTION+"products.json?limit=250").toPromise();
        //console.log("products",products.data)
        return products.data    
    }

    @Get("/byVendor/:vendor")
    async byVendor(@Param('vendor') vendor) {
        //console.log("process.env",process.env)
        
        const products = await this.httpService.get(process.env.SHOPIFY_CONNECTION+"products.json?limit=250&vendor="+vendor).toPromise();
        //console.log("products",products.data)
        return products.data    
    }

    @Get("/byVendorDirection/:vendor/:lastID/:direction")
    async byVendorDirection(@Param('vendor') vendor, @Param('lastID') lastID, @Param('direction') direction) {
        //console.log("process.env",process.env)
        //prev and next

        const url = process.env.SHOPIFY_CONNECTION+"products.json?limit=250&vendor="+vendor+"&last_id="+lastID+"&direction="+direction

        console.log("url",url)

        const products = await this.httpService.get(url).toPromise();
        //console.log("products",products.data)
        return products.data    
    }

   
}

