import { Body, Controller, Get, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserResponseDto } from 'src/users/dto/response/user-response.dto';
import { User } from './entity/user.entity';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser, type CurrentUserType } from 'src/auth/decorators/current-user.decorator';
import { Role } from './enums/role.enum';

@ApiTags('Users (사용자)')
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Admin API - 관리자만 접근 가능
    @Auth(Role.ADMIN)
    @Get('/everything') // 고정된 경로(Static Path)는 항상 변수 경로(Dynamic Path)보다 위에 있어야 함.
    @ApiOperation({ summary: '모든 사용자 조회', description: '모든 사용자 정보를 조회합니다. (관리자 전용)' })
    async findEverything(): Promise<UserResponseDto[]> {
        const users = await this.usersService.findEverything();
        return users.map((user: User) => new UserResponseDto(user));
    }

    // User API - 인증된 사용자만 접근 가능
    @Auth()
    @Get('/me')
    @ApiOperation({ summary: '내 정보 조회', description: '내 정보를 조회합니다.' })
    async findOne(@CurrentUser() user: CurrentUserType): Promise<UserResponseDto | null> {
        const userInfo = await this.usersService.findByEmail(user.email);
        return userInfo ? new UserResponseDto(userInfo) : null;
    }

    // Admin API - 관리자만 접근 가능
    @Auth(Role.ADMIN)
    @Patch('/restore/:id')
    @ApiOperation({ summary: '유저 복구', description: '유저를 복구합니다. (관리자 전용)' })
    async restore(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto | null> {
        const userInfo = await this.usersService.restoreUser(id);
        return userInfo ? new UserResponseDto(userInfo) : null;
    }

    // User API - 인증된 사용자만 접근 가능
    @Auth()
    @Patch('/')
    @ApiOperation({ summary: '내 정보 업데이트', description: '내 정보를 업데이트합니다.' })
    async update(@CurrentUser() user: CurrentUserType, @Body() updateUserDto: UpdateUserDto): Promise<boolean> {
        const result = await this.usersService.update(user.email, updateUserDto);
        return result;
    }

    // User API - 인증된 사용자만 접근 가능
    @Auth()
    @Delete('/')
    @ApiOperation({ summary: '회원 탈퇴', description: '회원을 탈퇴합니다.' })
    async remove(@CurrentUser() user: CurrentUserType): Promise<boolean> {
        const result = await this.usersService.remove(user.email);
        return result;
    }
}
