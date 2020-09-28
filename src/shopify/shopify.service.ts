import { BadGatewayException, HttpService, Injectable } from '@nestjs/common';
import { ProductTraceService } from '../productTrace/productTrace.service'
import * as moment from "moment"

@Injectable()
export class ShopifyService {

    constructor(private readonly httpService: HttpService,
        private readonly productTraceService: ProductTraceService) {}

    async getAll(): Promise<any> {
        

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

        console.log("ready to return products")

        return mergeProducts 

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

    async updateProduct(id:string,data:any): Promise<any> {
        
        const response = await this.httpService.put(process.env.SHOPIFY_CONNECTION+"products/"+id+".json",data).toPromise();
        //console.log("response",response.status === 200)
        return response
    }

}
