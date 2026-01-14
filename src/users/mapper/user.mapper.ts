import { User } from '../entity/user.entity';
import { UserResponseDto } from '../dto/response/user-response.dto';

// UserMapper 클래스는 User 엔티티를 UserResponseDto로 변환하는 메서드를 제공합니다.
export class UserMapper {
    static toResponseDto(user: User): UserResponseDto {
        return new UserResponseDto(user);
    }
}