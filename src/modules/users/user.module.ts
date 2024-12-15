// user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity'; // Entity của module User
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => ProductModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
