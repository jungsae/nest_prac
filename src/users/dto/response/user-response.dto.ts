import { Role } from 'src/users/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entity/user.entity';

export class UserResponseDto {
    @ApiProperty({ description: '사용자 ID', example: 1 })
    id: number;

    @ApiProperty({ description: '사용자 이름', example: '홍길동' })
    name: string;

    @ApiProperty({ description: '사용자 이름', example: '홍길동' })
    email: string;

    @ApiProperty({ description: '사용자 역할', example: 'USER' })
    role: Role;

    @ApiProperty({ description: '생성일', example: '2026-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ description: '수정일', example: '2026-01-01T00:00:00.000Z' })
    updatedAt: Date;

    @ApiProperty({ description: '삭제일', example: '2026-01-01T00:00:00.000Z' })
    deletedAt?: Date | null;

    // 대규모 개발환경에서는 BaseResponseDto(기본 응답 DTO) + mapped type(PickType, OmitType, PartialType 등)
    // 구조가 훨씬 유지보수에 유리함. (공통 속성 확장/변경/재사용이 빈번하기 때문!)
    //
    // 1. 생성자 직접 선언 방식(아래 코드):
    //    - 장점: 각 필드별로 원하는대로 가공, 값 변환 등 커스텀이 자유로움.
    //    - 단점: 유저, 게시글, 댓글 등 DTO마다 생성자, 필드 선언 중복이 누적되고
    //            필드 추가/삭제 때마다 모든 DTO/생성자 일일이 수정해야 해요.
    //
    //    예시)
    //    return users.map(user => new UserResponseDto(user));
    //
    // 2. BaseResponseDto + mapped type(대규모 환경의 베스트프랙티스):
    //    - 공통 필드를 하나의 base dto로 빼고, PickType/OmitType 등으로 조합해서
    //      새로운 DTO를 선언하면, 확장/유지보수에 훨씬 효율적.
    //    - 예)
    //      // src/common/dto/base-response.dto.ts
    //      export class BaseResponseDto {
    //        id: number;
    //        createdAt: Date;
    //        updatedAt: Date;
    //        deletedAt?: Date | null;
    //      }
    //
    //      // src/users/dto/response/user-response.dto.ts
    //      import { PickType } from '@nestjs/swagger';
    //      export class UserResponseDto extends PickType(BaseResponseDto, [
    //        'id', 'createdAt', 'updatedAt', 'deletedAt'
    //      ] as const) {
    //        name: string;
    //        email: string;
    //        role: Role;
    //      }
    //
    //      // 실제 변환: class-transformer의 plainToInstance(UserResponseDto, users) 권장
    //      // => 공통 필드/문서화 누락 최소화, 코드 중복 최소화
    //
    //    - 장점: 여러 타입이 BaseResponseDto를 상속하거나(확장),
    //            필수/선택 속성 조합할 때 DRY 원칙 유지, 프로젝트 성장에도 견고함.
    //    - 단점: 필드 가공 등 커스텀 로직 필요시엔 생성자 또는 @Transform 등의 별도 코드 필요.
    //
    // 결론:
    // - 대규모 개발환경에서는 base dto + mapped type 패턴이 추천.
    // - 하지만, 즉석 커스텀 변환·로직이 많은 단일 DTO엔 생성자 방식도 여전히 유용.
    // - 상황 맞춰 적절한 패턴을 선택하는 게 좋음!

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.deletedAt = user.deletedAt;
    }
}
