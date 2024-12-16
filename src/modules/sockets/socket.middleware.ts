import { Injectable, NestMiddleware } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketMiddleware implements NestMiddleware {
  use(socket: Socket, next: (err?: any) => void) {
    const token = socket.handshake.query.token;

    if (token !== 'valid_token') {
      return next(new Error('Authentication error'));
    }

    next();
  }
}
