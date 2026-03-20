import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 리프레시 토큰 요청 DTO
 */
export class RefreshTokenDto {
    @ApiProperty({ description: '리프레시 토큰', example: 'refresh_token_here' })
    @IsString({ message: '리프레시 토큰은 문자열이어야 합니다.' })
    refresh_token: string;
}
