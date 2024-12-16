import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export function Authenticated() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}
