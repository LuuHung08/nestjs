import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ProductGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ProductGateway');

  // Khi một client kết nối
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    console.log(`Client connected: ${client.id}`);
  }

  // Khi một client ngắt kết nối
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Phát sự kiện thông báo sản phẩm mới
  broadcastNewProduct(product: any) {
    this.server.emit('newProduct', product); // Gửi đến tất cả client
  }
}
