import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 로그인 요청 DTO (Request DTO)
 * - 이메일과 비밀번호를 입력받아 로그인을 요청합니다.
 * @example
 * {
 *     "email": "test@example.com",
 *     "password": "password"
 * }
 */
export class LoginUserDto {
    @ApiProperty({ description: '이메일', example: 'test@example.com' })
    @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
    email: string;

    @ApiProperty({ description: '비밀번호', example: 'password' })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    password: string;
}
