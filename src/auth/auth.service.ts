import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/users/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async signup(body: CreateUserDto) {
        const checkUser = await this.usersService.findByEmail(body.email);
        if (checkUser) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        return await this.usersService.create({ ...body, password: hashedPassword });
    }

    async signin(body: LoginDto) {
        const userInfo = await this.usersService.findByEmail(body.email);

        const isMatch = await bcrypt.compare(body.password, userInfo.password);
        if (!isMatch) {
            throw new UnauthorizedException('이메일 또는 비밀번호를 확인해주세요.');
        }

        const payload = { email: userInfo.email, role: userInfo.role };
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
