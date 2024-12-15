import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'hungtest', description: 'test' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '12341234', description: 'test' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
