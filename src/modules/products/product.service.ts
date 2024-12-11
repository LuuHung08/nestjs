import { Injectable } from '@nestjs/common';
import { Product } from 'src/models/product.model';
import { ProductDto } from './dto/productDto';

@Injectable()
export class ProductService {
  private products: Product[] = [
    { id: 1, categoryId: 1, productName: 'Product 1', price: 100 },
    { id: 2, categoryId: 2, productName: 'Product 2', price: 200 },
    { id: 3, categoryId: 3, productName: 'Product 3', price: 300 },
  ];

  getProducts(): Product[] {
    return this.products;
  }

  createProduct(productDto: ProductDto): Product {
    const product: Product = {
      id: Math.random(),
      ...productDto,
    };
    this.products.push(product);
    return product;
  }

  detailProduct(id: number): Product[] {
    const findProducts = this.products.find(
      (product) => product.id === Number(id),
    );

    return [findProducts];
  }

  updateProduct(productDto: ProductDto, id: number): string {
    console.log('productDto', productDto);
    if (!id) throw new Error('ID is required');

    const index = this.products.findIndex(
      (product) => product.id === Number(id),
    );

    this.products[index].price = productDto.price;
    this.products[index].productName = productDto.productName;
    this.products[index].categoryId = productDto.categoryId;

    return 'Update success';
  }

  deleteProduct(id: number): boolean {
    const index = this.products.findIndex(
      (product) => product.id === Number(id),
    );
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }

    return false;
  }
}
