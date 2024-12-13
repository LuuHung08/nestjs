import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

export const matchRoles = (roles: string[], userRoles: string[]) => {
  return userRoles.some((role) => roles.includes(role));
};
