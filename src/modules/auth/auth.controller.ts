import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async register(@Body() body: AuthDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'User login successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async login(@Body() body: AuthDto) {
    const result = await this.authService.login(body);
    return {
      message: 'Login successful',
      accessToken: result.accessToken,
    };
  }
}
