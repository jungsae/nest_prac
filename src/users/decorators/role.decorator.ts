import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../constants/metadata.constants';
/**
 * 역할 기반 인증 데코레이터
 * 컨트롤러 레벨에서 JwtGuard가 적용되어 있으므로 역할 체크만 수행합니다.
 * 구성요소
 * - SetMetadata: 메타데이터를 설정합니다.
 * - UseGuards: 역할 체크를 위한 RoleGuard를 적용합니다.
 * - ApiBearerAuth: Swagger에서 Bearer 인증을 표시합니다.
 * @param {Role[]} roles - 인증할 역할 (없으면 인증된 사용자만 허용)
 * @returns {MethodDecorator} 메서드 데코레이터
 */

export const RoleDecorator = (...roles: Role[]): MethodDecorator =>
    applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(RoleGuard),
        ApiBearerAuth('JWT-auth') // Swagger 자동 통합
    );
