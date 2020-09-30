import {
    Injectable,
    ExecutionContext,
    CanActivate,
    BadRequestException,
    UnauthorizedException
  } from "@nestjs/common";

  import { Reflector } from '@nestjs/core';

import { AuthService } from "../auth.service";

import { UsersService } from "../../users/users.service";



@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService
  ) { }

  canActivate(context: ExecutionContext) {

    //console.log("context",context.getArgs()[0].user)
    
    const request = context.switchToHttp().getNext();  
      
    return this.users.findOneByEmail(context.getArgs()[0].user["username"]).then(
      (user)=>{
        
        request.user = user

        //console.log("request",request.user)
        
        return true
      
      } 
    ).catch(
      (error)=>{
        throw new UnauthorizedException(error)
        return false
      }
    )      
    
    
  }
}



@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): any {

    const request = context.switchToHttp().getNext();   

    //console.log("request",request)

    //console.log("check if user exist",request.user)

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    //console.log("roles",roles)
    if (request.user && roles.includes(request.user.role)) {
      return true;
    }
    else{
      return false;
    }   


  }
}




