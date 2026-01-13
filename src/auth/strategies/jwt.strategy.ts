import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CurrentUserType } from '../decorators/current-user.decorator';

// 유효한 JWT 토큰인지만 검증(유저 정보는 검증하지 않음)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            // jwt verify 과정을 수행하고 토큰 만료 체크
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더 bearer 토큰 추출
            ignoreExpiration: false, // 만료된 토큰 401 에러
            secretOrKey: configService.get<string>('JWT_SECRET', { infer: true }) ?? ''
        });
    }

    async validate(payload: any): Promise<CurrentUserType> {
        return {
            email: payload.email,
            role: payload.role
        };
    }
}
