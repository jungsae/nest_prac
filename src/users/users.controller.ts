import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { Public } from './decorators/public.decorator';
import { LoginUserDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RoleDecorator } from './decorators/role.decorator';
import { CurrentUser, type CurrentUserType } from './decorators/current-user.decorator';
import { Role } from './enums/role.enum';
import { JwtGuard } from './guards/jwt.guard';
import { AdminUserResponseDto, UserResponseDto } from './dto/response/user-response.dto';

@ApiTags('Users (사용자 및 인증)')
@UseGuards(JwtGuard)
@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Post('/auth/signup')
    @ApiOperation({ summary: '회원가입', description: '회원가입을 합니다.' })
    @ApiBody({ type: CreateUserDto, description: '회원가입 정보' })
    async signup(@Body() body: CreateUserDto) {
        return this.usersService.signup(body);
    }

    @Public()
    @Post('/auth/signin')
    @ApiOperation({ summary: '로그인', description: '로그인을 합니다.' })
    @ApiBody({ type: LoginUserDto, description: '로그인 정보' })
    async signin(@Body() body: LoginUserDto) {
        return this.usersService.signin(body);
    }

    @Public()
    @Post('/auth/refresh')
    @ApiOperation({ summary: '토큰 갱신', description: '리프레시 토큰으로 새로운 액세스 토큰을 발급받습니다.' })
    @ApiBody({ type: RefreshTokenDto, description: '리프레시 토큰' })
    async refresh(@Body() body: RefreshTokenDto) {
        return this.usersService.refresh(body);
    }

    @Post('/auth/logout')
    @ApiOperation({ summary: '로그아웃', description: '로그아웃을 합니다.' })
    async logout(@CurrentUser() user: CurrentUserType): Promise<{ message: string }> {
        return await this.usersService.logout(user.email);
    }

    @Public()
    @Get('/users/check-email')
    @ApiOperation({ summary: '이메일 중복 체크', description: '이메일 중복 여부를 확인합니다. (Public)' })
    async checkEmail(@Query('email') email: string): Promise<boolean> {
        const exists = await this.usersService.checkUserExists(email);
        return exists;
    }

    @Public()
    @Get('/users/check-nickname')
    @ApiOperation({ summary: '닉네임 중복 체크', description: '닉네임 중복 여부를 확인합니다. (Public)' })
    async checkNickname(@Query('nickname') nickname: string): Promise<boolean> {
        const exists = await this.usersService.checkNicknameExists(nickname);
        return exists;
    }

    @RoleDecorator(Role.ADMIN)
    @Get('/users/everything')
    @ApiOperation({ summary: '모든 사용자 조회', description: '모든 사용자 정보를 조회합니다. (관리자 전용)' })
    async findEverything(): Promise<AdminUserResponseDto[]> {
        return this.usersService.findEverything();
    }

    @Get('/users/me')
    @ApiOperation({ summary: '내 정보 조회', description: '내 정보를 조회합니다.' })
    async findOne(@CurrentUser() user: CurrentUserType): Promise<UserResponseDto> {
        return this.usersService.findMyInfo(user.email);
    }

    @RoleDecorator(Role.ADMIN)
    @Patch('/users/restore/:id')
    @ApiOperation({ summary: '유저 복구', description: '유저를 복구합니다. (관리자 전용)' })
    async restore(@Param('id', ParseIntPipe) id: number): Promise<AdminUserResponseDto> {
        return this.usersService.restoreUser(id);
    }

    @Patch('/users')
    @ApiOperation({ summary: '내 정보 업데이트', description: '내 정보를 업데이트합니다.' })
    async updateUser(
        @CurrentUser() user: CurrentUserType,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UserResponseDto> {
        return this.usersService.updateUser(user.email, updateUserDto);
    }

    @Delete('/users')
    @ApiOperation({ summary: '회원 탈퇴', description: '회원을 탈퇴합니다.' })
    async removeUser(@CurrentUser() user: CurrentUserType): Promise<UserResponseDto> {
        return this.usersService.removeUser(user.email);
    }
}
