import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { Authenticated } from 'src/common/decorators/authenticated.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authenticated()
  @Get()
  async getList(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }

  @Authenticated()
  @Get(':id')
  async getUserByIdProduct(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.getUserWithProducts(id);
  }

  @Authenticated()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @Authenticated()
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(Number(id));
  }
}
