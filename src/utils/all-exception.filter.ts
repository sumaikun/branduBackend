import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MongoError } from 'mongodb';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    
    //super.catch(exception, host);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;


    console.error("exception",exception)

    const responseError =
        exception instanceof MongoError
        ? exception.message
        : "Server error";

    if(status == 400)
    {
       
      const validationResponse = exception instanceof HttpException
      ? exception.getResponse()
      : HttpStatus.INTERNAL_SERVER_ERROR;

      //console.log("validationResponse",validationResponse["message"])

      //return validationResponse

      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message:validationResponse["message"]
      });
      
    }
    else{
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message:responseError
      });
    }

    
    
  }
}