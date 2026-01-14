import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/auth/dto/login.dto';
import { UserResponseDto } from 'src/users/dto/response/user-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async signup(body: CreateUserDto): Promise<UserResponseDto> {
        // 이메일 중복 체크
        const existingUser = await this.usersService.findByEmail(body.email);
        if (existingUser) {
            throw new ConflictException('중복된 이메일입니다.');
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // 사용자 생성
        const user = await this.usersService.create({ ...body, password: hashedPassword });
        return user;
    }

    async signin(body: LoginUserDto): Promise<{ access_token: string }> {
        // 사용자 존재 확인
        const user = await this.usersService.findByEmail(body.email);
        if (!user) {
            throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');
        }

        // 비밀번호 검증
        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');
        }

        // JWT 토큰 발급
        const payload = { email: user.email, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
