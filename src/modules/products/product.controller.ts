import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Authenticated } from 'src/common/decorators/authenticated.decorator';
import { ResponseData } from 'src/common/meta-response';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Authenticated()
  @Get()
  async getProducts(
    @Query() query: QueryProductDto,
  ): Promise<ResponseData<ProductEntity>> {
    const { page, limit } = query;

    if (!page || !limit) {
      throw new BadRequestException('Page and limit are required');
    }

    return await this.productService.getProducts(query);
  }

  @Authenticated()
  @Post()
  async createProduct(@Body() body: CreateProductDto): Promise<ProductEntity> {
    return this.productService.createProduct(body);
  }

  @Authenticated()
  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(id, body);
  }
}
