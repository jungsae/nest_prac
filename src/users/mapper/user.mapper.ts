import { User } from '../entity/user.entity';
import { AdminUserResponseDto, UserResponseDto } from '../dto/response/user-response.dto';

/**
 * UserMapper 클래스는 User 엔티티를 UserResponseDto로 변환하는 메서드를 제공합니다.
 * @example
 * const user = new User();
 * user.id = 1;
 * user.name = 'John Doe';
 * user.email = 'john.doe@example.com';
 * user.role = Role.USER;
 * const userResponseDto = UserMapper.toResponseDto(user);
 * console.log(userResponseDto);
 */
export class UserMapper {
    static toResponseDto(user: User): UserResponseDto {
        return new UserResponseDto(user);
    }

    static toAdminResponseDto(user: User): AdminUserResponseDto {
        return new AdminUserResponseDto(user);
    }

    static toAdminResponseDtoList(users: User[]): AdminUserResponseDto[] {
        return users.map((user: User) => this.toAdminResponseDto(user));
    }
}
