import { Controller, Get, Post, Put, Delete, Param,
     Body, UnauthorizedException, HttpService } from '@nestjs/common';

import { AuthService } from './auth.service'

import { UsersService } from '../users'

import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService,private readonly httpService: HttpService,
         private readonly UsersService: UsersService) {}

    @Post()
    async auth(@Body() req): Promise<any> {

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

    @Post("/createInitialUser")
    async create(@Body() User: any): Promise<any> {

        if(User.password && User.password.length > 0)
        {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(User.password, salt);
            User.password = hash;    
        }

        return this.UsersService.create(User);
    }


}


