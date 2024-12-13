import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  isAvailable: boolean;
}
