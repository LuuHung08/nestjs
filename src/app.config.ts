import { IsNumber, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class AppConfig {
  @IsString()
  readonly NODE_ENV: 'production' | 'stage' | 'development';

  @IsNumber()
  readonly DB_PORT: number;

  @IsString()
  readonly DB_HOST: string;

  @IsString()
  readonly DB_USER: string;

  @IsString()
  readonly DB_PASSWORD: string;

  @IsString()
  readonly DB_NAME: string;

  @IsString()
  readonly JWT_SECRET: string;
}

export function validateAppConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(AppConfig, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
