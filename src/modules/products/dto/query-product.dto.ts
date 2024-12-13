import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class QueryProductDto {
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @IsPositive({ message: 'Page must be greater than 0' })
  page: number;

  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @IsPositive({ message: 'Limit must be greater than 0' })
  limit: number;

  @IsOptional()
  name?: string;
}
