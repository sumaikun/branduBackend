import { Controller, Get, Post, Put, Delete, Param, Body , HttpService , BadGatewayException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShopifyService } from './shopify.service'
import { ProductTraceService } from '../productTrace/productTrace.service'
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('shopify')
@UseGuards(AuthGuard('jwt'))
export class ShopifyController {
    constructor(private readonly httpService: HttpService,
        private readonly shopifyService: ShopifyService,
        private readonly productTraceService: ProductTraceService,
        @InjectQueue('chronos') private readonly chronosQueue: Queue) {}

    @Get("/countByVendor/:vendor")
    async getCountByVendor(@Param('vendor') vendor) {
        //console.log("process.env",process.env)
        
        const products = await this.httpService.get(process.env.SHOPIFY_CONNECTION+"/products/count.json?vendor="+vendor).toPromise();
        //console.log("products",products.data)
        return products.data    
    }

    @Get("/allProducts")
    async allProducts() {
        //console.log("process.env",process.env)
        return await this.shopifyService.getAll()
    }

    @Get("/byVendor/:vendor")
    async byVendor(@Param('vendor') vendor) {
        //console.log("process.env",process.env)
        
        let products = await this.httpService.get(process.env.SHOPIFY_CONNECTION+"products.json?limit=250&vendor="+vendor).toPromise();
       
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
    
    @Put("/shopifyProduct/:id")
    async updateShopifyProduct(@Param('id') id,@Body() data: any) {
        //console.log(id,data)
        const result =  await this.shopifyService.updateProduct(id,data)
        //console.log("result",result)
        return result.data
    }

    @Put("/shopifyProductWithBatch")
    async shopifyProductWithBatch(@Body() data: any) {
        console.log(data)
        if(data.length <= 250)
        {
            let errorCount = 0
            let successCount = 0
            for (let index = 0; index < data.length; index++) {
                const trace = await this.productTraceService.findOne(data[index])
                //console.log("trace",trace)
                //console.log("process")   
                //await this.sleep(10)            
                if( (index + 1) % 20 == 0 ){
                    console.log("wait")
                    await this.sleep(2800)
                }
    
                if( (index + 1) % 125 == 0 ){
                    
                    console.log("wait")
                    await this.sleep(5000)
                
                }
                
                if(trace){
                    this.shopifyService.updateProduct(trace.shopifyId,trace.shopifyProduct).then( ok => { 
                        successCount++
                        console.log("successCount",successCount) 
                    })
                    .catch( error =>  {
                        errorCount++
                        console.log("errorCount",errorCount)
                    })
                    //console.log("done")
                    await this.sleep(250)
                }        
            }
                 
        }

        this.chronosQueue.add('massiveUpdate',data);
                    
       
        return null
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

   
}

