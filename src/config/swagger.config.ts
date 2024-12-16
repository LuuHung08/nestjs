import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Example')
  .setDescription('The API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
