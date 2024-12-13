// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity'; // Entity của module User
import { UsersService } from './user.service';
import { UsersController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // Đảm bảo rằng UserEntity được import
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule.forFeature([UserEntity])], // Export UserEntity để các module khác có thể sử dụng
})
export class UserModule {}
