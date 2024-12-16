import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductGateway } from './product.gateway';

@Module({
  providers: [ProductService, ProductGateway],
  controllers: [ProductController],
})
export class ProductSocketModule {}
