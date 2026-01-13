import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

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

    @ApiProperty({ description: '역할', example: 'USER', default: 'USER', required: false })
    @IsEnum(Role, { message: '역할은 USER 또는 ADMIN 중 하나여야 합니다.' })
    role?: Role = Role.USER;
}
