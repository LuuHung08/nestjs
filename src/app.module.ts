import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/products/product.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { validateAppConfig } from './app.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from './common/interceptor';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './database/database.module';
import { CommentsModule } from './modules/comments/comment.module';
import { VideoCallModule } from './modules/sockets/socket.module';
import { DbHealthModule } from './modules/db-health/db-health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateAppConfig,
    }),
    DatabaseModule,
    ProductModule,
    UserModule,
    AuthModule,
    HealthModule,
    CommentsModule,
    VideoCallModule,
    DbHealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
