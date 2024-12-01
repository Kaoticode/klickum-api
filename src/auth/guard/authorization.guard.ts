import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../auth/auth.service';
import { PERMISSIONS_KEY } from '../../common/decorator/permissions.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user.sub) {
      throw new UnauthorizedException('User Id not found');
    }
    const routePermissions: string = this.reflector.getAllAndOverride(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!routePermissions) {
      return true;
    }
    const userPermissions = await this.authService.getUserPermissions(
      request.user.sub,
    );

    try {
      const userPermission = userPermissions.find(
        (perm) => perm.action === routePermissions,
      );
      if (!userPermission) throw new ForbiddenException();
    } catch (e) {
      throw new ForbiddenException();
    }
    return true;
  }
}
