import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/roles.guard';
import { Role } from 'src/users/enums/role.enum';
import { ROLES_KEY } from '../constants/auth-metadata.constants';
/**
 * 인증 데코레이터
 * 구성요소
 * - SetMetadata: 메타데이터를 설정합니다.
 * - UseGuards: 보호된 엔드포인트에 적용할 가드를 설정합니다.
 * - ApiBearerAuth: Swagger에서 Bearer 인증을 표시합니다.
 * @param {Role[]} roles - 인증할 역할
 * @returns {MethodDecorator} 메서드 데코레이터
 */
export const Auth = (...roles: Role[]): MethodDecorator =>
    applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiBearerAuth('JWT-auth') // Swagger 자동 통합
    );
