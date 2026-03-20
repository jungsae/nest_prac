import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({ description: '게시물 제목', example: '게시물 제목' })
    @IsString({ message: '게시물 제목은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '게시물 제목은 필수 입력 항목입니다.' })
    title: string;

    @ApiProperty({ description: '게시물 내용', example: '게시물 내용' })
    @IsString({ message: '게시물 내용은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '게시물 내용은 필수 입력 항목입니다.' })
    content: string;
}
