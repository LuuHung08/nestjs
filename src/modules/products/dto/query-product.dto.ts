import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { ProductInformationEnum } from '../interface/product-info';

export class QueryProductDto {
  @ApiProperty({ example: 1, description: 'Page number, starts from 1' })
  @Min(1)
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @IsPositive({ message: 'Page must be greater than 0' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  @Min(1)
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @IsPositive({ message: 'Limit must be greater than 0' })
  limit: number;

  @ApiPropertyOptional({
    example: '',
    description: 'Product name to search for',
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    name: 'type',
    description: 'Filter type',
    enum: ProductInformationEnum,
  })
  @IsOptional()
  type?: string;
}
