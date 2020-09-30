import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user-dto';
import { User } from './interface/user.interface';
import * as bcrypt from 'bcryptjs';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard, RolesGuard } from '../auth/guards/custom.guards';
import {Roles} from '../auth/decorators/custom.decorators'

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly UsersService: UsersService) {}

    @Get()
    @Roles('ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    async getUsers(): Promise<any[]> {
        return this.UsersService.findAll();
    }

    @Get(':id')
    @Roles('ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    async getUser(@Param('id') id): Promise<User> {
        return this.UsersService.findOne(id);
    }

    @Post()
    @Roles('ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    create(@Body() User: UserDto): Promise<User> {

        if(User.password && User.password.length > 0)
        {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(User.password, salt);
            User.password = hash;    
        }

        return this.UsersService.create(User);
    }

    @Put(':id')
    @Roles('ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    async editUser(@Param('id') id, @Body() User: UserDto): Promise<User> {

        if(User.password && User.password.length > 0)
        {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(User.password, salt);
            User.password = hash;    
        }

        return this.UsersService.update(id, User);
    }

    @Delete(':id')
    @Roles('ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    async deleteUser(@Param('id') id): Promise<boolean> {
        return this.UsersService.delete(id);
    }
}
