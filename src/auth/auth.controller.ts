import { Controller, Get, Post, Put, Delete, Param,
     Body, UnauthorizedException, HttpService } from '@nestjs/common';

import { AuthService } from './auth.service'



@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService,private readonly httpService: HttpService) {}

    @Post()
    async create(@Body() req): Promise<any> {

        const user = await this.authService.validateUser(req.email,req.password)
            
        if(!user){
            throw new UnauthorizedException();
        }
        else{
            return this.authService.login(user);
        }   
    }

    @Get("/test")
    async test() {
        //console.log("process.env",process.env)
        const products = await this.httpService.get(process.env.SHOPIFY_PRODUCTS).toPromise();
        //console.log("products",products.data)
        return products.data    
    }




}
