import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { Public } from './decorators/public.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/auth/dto/login.dto';

@ApiTags('Authentication (인증)')
@Public()
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup')
    @ApiOperation({ summary: '회원가입', description: '회원가입을 합니다.' })
    @ApiBody({ type: CreateUserDto, description: '회원가입 정보' })
    async signup(@Body() body: CreateUserDto) {
        return await this.authService.signup(body);
    }

    @Post('/signin')
    @ApiOperation({ summary: '로그인', description: '로그인을 합니다.' })
    @ApiBody({ type: LoginUserDto, description: '로그인 정보' })
    async signin(@Body() body: LoginUserDto) {
        return await this.authService.signin(body);
    }
}
