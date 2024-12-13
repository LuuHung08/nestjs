import {
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
