import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard'; // Giả sử bạn đã tạo guard JWT của mình
import { matchRoles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtAuthGuard: JwtAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Kiểm tra xem route handler có yêu cầu roles không
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    // Sử dụng JwtAuthGuard để đảm bảo người dùng đã đăng nhập
    const canActivate = await this.jwtAuthGuard.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Kiểm tra quyền của người dùng
    return matchRoles(roles, user.roles);
  }
}
