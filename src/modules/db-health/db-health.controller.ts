import { Controller, Get, Logger } from '@nestjs/common';
import { DbHealthService } from './db-health.service';

@Controller('db-health')
export class DbHealthController {
  private readonly logger = new Logger(DbHealthController.name);

  constructor(private readonly dbHealthService: DbHealthService) {}

  @Get('/check')
  async checkDbHealth() {
    this.logger.log('Kiểm tra dung lượng cơ sở dữ liệu...');
    try {
      const dbSize = await this.dbHealthService.checkDatabaseSize();
      this.logger.log(`Dung lượng DB: ${dbSize} MB`);
      return { databaseSize: dbSize };
    } catch (error) {
      this.logger.error('Kiểm tra cơ sở dữ liệu thất bại:', error.stack);
      throw error;
    }
  }
}
