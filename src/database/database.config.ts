import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config'; // Điều chỉnh đường dẫn nếu cần
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductEntity } from 'src/modules/products/entities/product.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { CommentsEntity } from 'src/modules/comments/entities/comment.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<AppConfig['DB_HOST']>('DB_HOST'),
  port: configService.get<AppConfig['DB_PORT']>('DB_PORT'),
  username: configService.get<AppConfig['DB_USER']>('DB_USER'),
  password: configService.get<AppConfig['DB_PASSWORD']>('DB_PASSWORD'),
  database: configService.get<AppConfig['DB_NAME']>('DB_NAME'),
  entities: [ProductEntity, UserEntity, CommentsEntity],
  synchronize: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
