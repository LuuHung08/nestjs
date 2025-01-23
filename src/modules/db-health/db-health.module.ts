import { Module } from '@nestjs/common';
import { DbHealthService } from './db-health.service';
import { DbHealthController } from './db-health.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [DbHealthService],
  controllers: [DbHealthController],
})
export class DbHealthModule {}
