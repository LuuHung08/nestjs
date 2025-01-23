import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, {
  cors: {
    origin: '*',
  },
})
export class VideoCallGateway {
  private logger = new Logger('VideoCallGateway');

  @WebSocketServer() server: Server;

  // Khi người dùng kết nối
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // Khi người dùng ngắt kết nối
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const rooms = client.rooms;
    rooms.forEach((roomId) => {
      // Phát đi sự kiện 'userLeft' cho các client khác trong cùng room
      client.to(roomId).emit('userLeft', { userId: client.id });
    });
  }

  // Người dùng tham gia room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    this.logger.log(`Client ${client.id} joined room ${roomId}`);
    // Thông báo cho các thành viên khác trong room
    client.to(roomId).emit('userJoined', { userId: client.id });
  }

  // Người dùng rời room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
    this.logger.log(`Client ${client.id} left room ${roomId}`);
    // Thông báo cho các thành viên khác trong room
    client.to(roomId).emit('userLeft', { userId: client.id });
  }

  // Xử lý sự kiện offer
  @SubscribeMessage('offer')
  handleOffer(
    @MessageBody() data: { offer: RTCSessionDescriptionInit; targetId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Offer from ${client.id} to ${data.targetId}`);
    // Gửi offer tới client mục tiêu
    this.server.to(data.targetId).emit('offer', {
      offer: data.offer,
      senderId: client.id,
    });
  }

  // Xử lý sự kiện answer
  @SubscribeMessage('answer')
  handleAnswer(
    @MessageBody()
    data: { answer: RTCSessionDescriptionInit; targetId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Answer from ${client.id} to ${data.targetId}`);
    // Gửi answer tới client mục tiêu
    this.server.to(data.targetId).emit('answer', {
      answer: data.answer,
      senderId: client.id,
    });
  }

  // Xử lý sự kiện candidate
  @SubscribeMessage('candidate')
  handleIceCandidate(
    @MessageBody() data: { candidate: RTCIceCandidate; targetId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Candidate from ${client.id} to ${data.targetId}`);
    // Gửi ICE candidate tới client mục tiêu
    this.server.to(data.targetId).emit('candidate', {
      candidate: data.candidate,
      senderId: client.id,
    });
  }
}
