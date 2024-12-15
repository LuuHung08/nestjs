import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseData } from 'src/common/meta-response';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserEntity } from '../users/entities/user.entity';
import { ProductInformationEnum } from './interface/product-info';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getProducts(
    query: QueryProductDto,
  ): Promise<ResponseData<ProductEntity>> {
    const { page, limit, name, type } = query;

    const whereCondition = {
      ...(name && { name: Like(`%${name}%`) }),
      ...(type && { type }),
    };

    const [products, total] = await this.productRepository.findAndCount({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const meta = {
      total,
      page,
      limit,
    };

    return new ResponseData(products, meta);
  }

  async createProduct(body: CreateProductDto): Promise<ProductEntity> {
    const { userId, type } = body;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username'],
    });

    if (!user) {
      throw new NotFoundException(`UserId not found`);
    }

    if (!ProductInformationEnum[type]) {
      throw new BadRequestException(`Invalid product type`);
    }

    const newProduct = this.productRepository.create({
      ...body,
      user,
    });
    return this.productRepository.save(newProduct);
  }

  async updateProduct(
    id: number,
    body: UpdateProductDto,
  ): Promise<ProductEntity> {
    if (!id) {
      throw new NotFoundException(`Id is required`);
    }

    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, body);
    return this.productRepository.save(product);
  }
}
