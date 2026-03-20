import { Role } from 'src/users/enums/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/users/entity/user.entity';

// 일반 사용자에게 반환할 DTO (deletedAt 제외)
export class UserResponseDto {
    @ApiProperty({ description: '사용자 ID', example: 1 })
    id: number;

    @ApiProperty({ description: '사용자 이름', example: '홍길동' })
    name: string;

    @ApiProperty({ description: '사용자 이메일', example: 'hong@example.com' })
    email: string;

    @ApiProperty({ description: '사용자 역할', example: 'USER' })
    role: Role;

    @ApiProperty({ description: '생성일', example: '2026-01-01T00:00:00.000Z' })
    createdAt: Date;

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.createdAt = user.createdAt;
    }
}

// 관리자에게 반환할 DTO (deletedAt 포함)
export class AdminUserResponseDto extends UserResponseDto {
    @ApiPropertyOptional({ description: '삭제일', example: '2026-01-01T00:00:00.000Z', nullable: true })
    deletedAt: Date | null;

    @ApiProperty({ description: '수정일', example: '2026-01-01T00:00:00.000Z' })
    updatedAt: Date;

    constructor(user: User) {
        super(user);
        this.deletedAt = user.deletedAt || null;
        this.updatedAt = user.updatedAt;
    }
}
