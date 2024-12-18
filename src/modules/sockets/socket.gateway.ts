import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, {
  cors: {
    origin: '*',
  },
})
export class VideoCallGateway {
  private logger = new Logger('SocketGateway');

  // Khi có người dùng kết nối
  handleConnection(client: Socket) {
    this.logger.log(`User connected: ${client.id}`);

    // Thêm sự kiện reconnection
    client.on('reconnect', (attemptNumber: number) => {
      this.logger.log(
        `User ${client.id} reconnected, attempt number: ${attemptNumber}`,
      );
    });

    // Thêm sự kiện lỗi
    client.on('error', (error: any) => {
      this.logger.error(`Error for client ${client.id}: ${error}`);
    });
  }

  // Khi người dùng ngắt kết nối
  handleDisconnect(client: Socket) {
    this.logger.log(`User disconnected: ${client.id}`);
  }

  // Khi có lỗi xảy ra trong Gateway
  handleError(client: Socket, error: any) {
    this.logger.error(`Error occurred for client ${client.id}: ${error}`);
  }

  // Khi người dùng không thể kết nối
  handleReconnect(client: Socket, attemptNumber: number) {
    this.logger.log(
      `User ${client.id} failed to reconnect after attempt ${attemptNumber}`,
    );
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('offer')
  handleOffer(
    @MessageBody() data: { offer: RTCSessionDescriptionInit },
    client: Socket,
  ) {
    this.logger.log('Received offer:', data);
    client.broadcast.emit('offer', data);
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @MessageBody() data: { answer: RTCSessionDescriptionInit },
    client: Socket,
  ) {
    console.log('answer', data);
    client.broadcast.emit('answer', data);
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @MessageBody() data: { candidate: RTCIceCandidate },
    client: Socket,
  ) {
    console.log('ice-candidate', data);
    client.broadcast.emit('ice-candidate', data);
  }
}
