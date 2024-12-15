import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';

export function Authenticated() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}
