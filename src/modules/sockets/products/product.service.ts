import { Injectable } from '@nestjs/common';
import { ProductGateway } from './product.gateway';

@Injectable()
export class ProductService {
  private products: any[] = []; // Danh sách sản phẩm (giả định lưu trong bộ nhớ)

  constructor(private readonly productGateway: ProductGateway) {}

  // Thêm sản phẩm mới
  addProduct(name: string, price: number): any {
    const newProduct = {
      id: this.products.length + 1,
      name,
      price,
      createdAt: new Date(),
    };

    this.products.push(newProduct);

    // Gửi sự kiện thông báo sản phẩm mới qua WebSocket
    this.productGateway.broadcastNewProduct(newProduct);

    return newProduct;
  }

  // Lấy danh sách sản phẩm
  getProducts(): any[] {
    return this.products;
  }
}
