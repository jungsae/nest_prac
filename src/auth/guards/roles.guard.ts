import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/enums/role.enum';
import { ROLES_KEY } from '../constants/auth-metadata.constants';
import type { CurrentUserType } from '../decorators/current-user.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        // 역할이 지정되지 않았으면 통과 (인증만 체크)
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest<{ user: CurrentUserType }>();

        // 사용자의 역할이 필요한 역할 중 하나와 일치하는지 확인
        const hasRole = requiredRoles.some((role) => user.role === role);
        if (!hasRole) {
            throw new ForbiddenException('접근 권한이 없습니다.');
        }
        return true;
    }
}
