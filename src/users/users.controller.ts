import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user-dto';
import { User } from './interface/user.interface';
import * as bcrypt from 'bcryptjs';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly UsersService: UsersService) {}

    @Get()
    async getUsers(): Promise<any[]> {
        return this.UsersService.findAll();
    }

    @Get(':id')
    async getUser(@Param('id') id): Promise<User> {
        return this.UsersService.findOne(id);
    }

    @Post()
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
    async deleteUser(@Param('id') id): Promise<boolean> {
        return this.UsersService.delete(id);
    }
}
