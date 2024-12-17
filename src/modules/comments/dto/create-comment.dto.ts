import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateCommentsDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  vid: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key_content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsOptional()
  parent_id?: number;
}
