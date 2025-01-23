import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { databaseConfig } from 'src/database/database.config';
import { AppConfig } from 'src/app.config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DbHealthService {
  private readonly logger = new Logger(DbHealthService.name);
  private readonly dbPool: Pool;

  private readonly thresholdBytes = 10 * 1024 * 1024; // 10MB

  constructor(private readonly configService: ConfigService) {
    // Sử dụng cấu hình DB từ db.config.ts
    const dbConfig: any = databaseConfig(this.configService);

    // Tạo Pool kết nối từ cấu hình databaseConfig
    this.dbPool = new Pool({
      user: dbConfig.username,
      host: dbConfig.host,
      database: dbConfig.database,
      password: dbConfig.password,
      port: dbConfig.port,
      ssl: dbConfig.extra.ssl,
    });
  }

  private readonly telegramConfig = {
    botToken:
      this.configService.get<AppConfig['TELEGRAM_BOT_TOKEN']>(
        'TELEGRAM_BOT_TOKEN',
      ),
    apiUrl:
      this.configService.get<AppConfig['TELEGRAM_API_URL']>('TELEGRAM_API_URL'),
    groupChatId: this.configService.get<AppConfig['TELEGRAM_GROUP_CHAT_ID']>(
      'TELEGRAM_GROUP_CHAT_ID',
    ),
  };

  @Cron('*/10 * * * *')
  async checkDatabaseSize(): Promise<string> {
    try {
      const result = await this.dbPool.query(`
        SELECT 'verceldb' AS database_name,
               pg_database_size('verceldb') AS size_in_bytes;
      `);

      const databases = result.rows;

      for (const db of databases) {
        const { database_name, size_in_bytes } = db;

        if (size_in_bytes > this.thresholdBytes) {
          const sizeMb = (size_in_bytes / 1024 / 1024).toFixed(2);
          const message = `
        <b>⚠️ Cảnh báo:</b>
        <b>Dung lượng DB</b> <code>${database_name}</code> <b>đã vượt ngưỡng ${(
          this.thresholdBytes /
          1024 /
          1024
        ).toFixed(2)} MB.</b>
        <b>📊 Hiện tại:</b> <i>${sizeMb} MB</i>
        <b>📝 Vui lòng kiểm tra cơ sở dữ liệu của bạn ngay!</b>
      `;
          await this.sendTelegramMessage(message);
          return sizeMb;
        }
      }
    } catch (error) {
      this.logger.error(
        'Lỗi khi kiểm tra dung lượng cơ sở dữ liệu PostgreSQL:',
        error,
      );
    }
  }

  // Gửi tin nhắn cảnh báo đến Telegram
  private async sendTelegramMessage(message: string): Promise<void> {
    try {
      const { botToken, apiUrl, groupChatId } = this.telegramConfig;

      const url = `${apiUrl}/bot${botToken}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: groupChatId,
        text: message,
        parse_mode: 'HTML',
      });

      if (response.status === 200) {
        this.logger.log(`Đã gửi cảnh báo đến chat_id: ${groupChatId}`);
      } else {
        this.logger.error(
          `Không thể gửi cảnh báo đến chat_id: ${groupChatId}`,
          response.data,
        );
      }
    } catch (error) {
      if (error.response) {
        // In lỗi chi tiết từ response của Telegram
        this.logger.error(
          'Lỗi khi gửi tin nhắn Telegram. Response error:',
          error.response.data,
        );
      } else if (error.request) {
        // Lỗi khi không nhận được phản hồi
        this.logger.error(
          'Lỗi khi gửi tin nhắn Telegram. Không nhận được phản hồi:',
          error.request,
        );
      } else {
        // Lỗi khác
        this.logger.error('Lỗi khi gửi tin nhắn Telegram. Lỗi:', error.message);
      }
    }
  }
}
