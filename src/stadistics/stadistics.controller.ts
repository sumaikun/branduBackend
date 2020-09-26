import { Controller, Get, Post, Put, Delete, Param, Body , HttpService } from '@nestjs/common';


import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('stadistics')
@UseGuards(AuthGuard('jwt'))
export class StadisticsController {




}
