import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 로그아웃 요청 DTO (Request DTO)
 */
export class LogoutUserDto {
    @ApiProperty({ description: '액세스 토큰', example: 'access_token_here' })
    @IsString({ message: '액세스 토큰은 문자열이어야 합니다.' })
    access_token: string;
}
