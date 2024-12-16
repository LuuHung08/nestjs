import { Controller, Post, Get, Body } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('events')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  addProduct(@Body() body: { name: string; price: number }) {
    const { name, price } = body;
    return this.productService.addProduct(name, price);
  }

  @Get()
  getProducts() {
    return this.productService.getProducts();
  }
}
