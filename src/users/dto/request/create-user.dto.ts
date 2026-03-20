import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: '이름', example: '홍길동' })
    @IsString({ message: '이름은 문자열이어야 합니다.' })
    @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
    name: string;

    @ApiProperty({ description: '이메일', example: 'test@example.com' })
    @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
    email: string;

    @ApiProperty({ description: '비밀번호', example: 'password' })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    password: string;
}
