import { Module } from '@nestjs/common';
import { VideoCallGateway } from './socket.gateway';

@Module({
  providers: [VideoCallGateway],
})
export class VideoCallModule {}
