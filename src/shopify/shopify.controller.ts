import { Controller, Get, Post, Put, Delete, Param, Body , HttpService , BadGatewayException } from '@nestjs/common';


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

        let keepFetching = true

        let mergeProducts = { products : [] }
        
        let products = await this.httpService.get(process.env.SHOPIFY_CONNECTION+"products.json?limit=250").toPromise();

        mergeProducts.products = products.data.products

        //console.log("products.data.products",products.data.products)

        const firstDirection = products.headers.link.split(",")[0]

        const urlDirection = firstDirection.substring(
            firstDirection.lastIndexOf("<") + 1, 
            firstDirection.lastIndexOf(">")
        );

        const directionParams = this.parseQueryString(urlDirection)

        let page_info = directionParams.page_info

        let errorAcummulation = 0

        while( keepFetching )
        {
            let httpErrorS = true

            while(httpErrorS)
            {
                try{
                    products = await this.httpService.get(process.env.SHOPIFY_CONNECTION+"products.json?limit=250&page_info="+page_info).toPromise();
                    httpErrorS = false
                    
                }catch(error){
                    console.log("error",error)
                    errorAcummulation++
                    if(errorAcummulation > 30)
                    {
                        throw new BadGatewayException();
                    }
                }
            }
           
           
            //console.log( products.data )    

            mergeProducts.products = mergeProducts.products.concat(products.data.products)

            //keepFetching = false           

            const direction = products.headers.link.split(",")[1]

            if(!direction)
            {
                keepFetching = false
            }
            else{
                console.log("direction",direction)

                const urlDirection = direction.substring(
                    direction.lastIndexOf("<") + 1, 
                    direction.lastIndexOf(">")
                );
    
                const directionParams = this.parseQueryString(urlDirection)
    
                page_info = directionParams.page_info
            }           

            console.log("iter")

            
        }        

        return mergeProducts 
    }

    @Get("/byVendor/:vendor")
    async byVendor(@Param('vendor') vendor) {
        //console.log("process.env",process.env)

        let keepFetching = true

        let mergeProducts = { products : [] }
        
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

    parseQueryString(queryString?: string): any {
        // if the query string is NULL or undefined
        if (!queryString) {
            queryString = window.location.search.substring(1);
        }

        const params = {};

        const queries = queryString.split("&");

        queries.forEach((indexQuery: string) => {
            const indexPair = indexQuery.split("=");

            const queryKey = decodeURIComponent(indexPair[0]);
            const queryValue = decodeURIComponent(indexPair.length > 1 ? indexPair[1] : "");

            params[queryKey] = queryValue;
        });

        return params;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

   
}

