import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  MaxLength,
  Min,
} from 'class-validator';
import { ProductInformationEnum } from '../interface/product-info';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ name: 'type', enum: ProductInformationEnum })
  @IsString()
  @IsNotEmpty()
  type: string;
}
