import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/users/enums/role.enum';

export interface CurrentUserType {
    email: string;
    role: Role;
}

export const CurrentUser = createParamDecorator(
    // data: 데코레이터에 넘겨주는 데이터(여기선 사용하지 않음)
    // ctx: 실행 컨텍스트(여기서 HTTP 요청 객체를 얻을 수 있음)
    (data: unknown, ctx: ExecutionContext): CurrentUserType => {
        // HTTP 요청 객체를 가져옵니다.
        const request = ctx.switchToHttp().getRequest<{ user: CurrentUserType }>();
        // 요청 객체에서 user 속성을 반환합니다.
        // user는 JwtStrategy의 validate 메서드에서 반환된 값입니다.
        return request.user;
    }
);
