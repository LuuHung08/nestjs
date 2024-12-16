import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/health-socket' })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeConnections = 0;

  handleConnection() {
    this.activeConnections += 1;
  }

  handleDisconnect() {
    this.activeConnections -= 1;
  }

  healthCheck() {
    return {
      status: 'ok',
      activeConnections: this.activeConnections,
    };
  }
}
