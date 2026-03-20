import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdminUserResponseDto, UserResponseDto } from 'src/users/dto/response/user-response.dto';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto } from 'src/users/dto/request/update-user.dto';
import { User } from 'src/users/entity/user.entity';
import { UserMapper } from 'src/users/mapper/user.mapper';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async signup(body: CreateUserDto): Promise<UserResponseDto> {
        if (await this.checkUserExists(body.email)) {
            throw new ConflictException('중복된 이메일입니다.');
        }
        if (await this.checkNicknameExists(body.name)) {
            throw new ConflictException('중복된 닉네임입니다.');
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await this.create({ ...body, password: hashedPassword });
        return user;
    }

    async signin({ email, password }: LoginUserDto): Promise<{ access_token: string; refresh_token: string }> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new UnauthorizedException('이메일이 존재하지 않습니다.');

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

        const access_token = await this.generateAccessToken(user);
        const refresh_token = await this.generateRefreshToken(user);

        await this.updateRefreshToken(email, refresh_token);

        return { access_token, refresh_token };
    }

    async refresh({ refresh_token }: RefreshTokenDto): Promise<{ access_token: string }> {
        const secret = this.getRefreshTokenSecret();
        try {
            const { email } = await this.jwtService.verifyAsync<{ email: string }>(refresh_token, { secret });
            const user = await this.findByRefreshToken(refresh_token);
            if (!user || user.email !== email) throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
            const access_token = await this.generateAccessToken(user);
            return { access_token };
        } catch {
            throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
        }
    }

    async logout(email: string): Promise<{ message: string }> {
        await this.updateRefreshToken(email, '');
        return { message: '로그아웃 성공' };
    }

    async findByEmail(email: string): Promise<User> {
        const user: User | null = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new NotFoundException(`${email}에 해당하는 유저가 없습니다.`);
        }
        return user;
    }

    async checkUserExists(email: string): Promise<boolean> {
        const user: User | null = await this.userRepository.findOneBy({ email });
        return user !== null;
    }

    async checkNicknameExists(name: string): Promise<boolean> {
        const user: User | null = await this.userRepository.findOneBy({ name });
        return user !== null;
    }

    async findEverything(): Promise<AdminUserResponseDto[]> {
        const users: User[] = await this.userRepository.find({
            withDeleted: true
        });
        if (!users.length) {
            throw new NotFoundException('유저가 없습니다.');
        }
        return UserMapper.toAdminResponseDtoList(users);
    }

    async findMyInfo(email: string): Promise<UserResponseDto> {
        return UserMapper.toResponseDto(await this.findByEmail(email));
    }

    async restoreUser(id: number): Promise<AdminUserResponseDto> {
        const user: User | null = await this.userRepository.findOne({
            where: { id },
            withDeleted: true
        });
        if (!user) {
            throw new NotFoundException(`${id}에 해당하는 유저가 없습니다.`);
        }
        if (user.deletedAt === null) {
            throw new BadRequestException('유저가 이미 복구되었습니다.');
        }
        await this.userRepository.restore(id);
        user.deletedAt = null;
        return UserMapper.toAdminResponseDto(user);
    }

    async create(userDto: CreateUserDto & { password: string }): Promise<UserResponseDto> {
        return UserMapper.toResponseDto(await this.userRepository.save(userDto));
    }

    async updateUser(email: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const updatedUser = await this.userRepository.update({ email }, updateUserDto);
        if (updatedUser.affected === 0) {
            throw new BadRequestException('유저 업데이트에 실패했습니다.');
        }
        const user = await this.findByEmail(email);
        return UserMapper.toResponseDto(user);
    }

    async removeUser(email: string): Promise<UserResponseDto> {
        const originalUser = await this.findByEmail(email);

        const result = await this.userRepository.softDelete({ email });
        if (result.affected === 0) {
            throw new BadRequestException('유저 삭제에 실패했습니다.');
        }

        return UserMapper.toResponseDto(originalUser);
    }

    private createJwtPayload(user: User): { email: string; role: Role } {
        return { email: user.email, role: user.role };
    }

    private getRefreshTokenSecret(): string {
        return (
            this.configService.get<string>('JWT_REFRESH_SECRET') ?? this.configService.get<string>('JWT_SECRET') ?? ''
        );
    }

    private getRefreshTokenExpiration(): string {
        return this.configService.get<string>('JWT_REFRESH_EXPIRATION') ?? '7d';
    }

    private async findByRefreshToken(refreshToken: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ refreshToken });
    }

    private async generateAccessToken(user: User): Promise<string> {
        const payload = this.createJwtPayload(user);
        return await this.jwtService.signAsync(payload);
    }

    private async generateRefreshToken(user: User): Promise<string> {
        const payload = this.createJwtPayload(user);
        const secret = this.getRefreshTokenSecret();
        const expiresIn = this.getRefreshTokenExpiration();
        return await this.jwtService.signAsync(payload, { secret, expiresIn } as any);
    }

    private async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
        await this.userRepository.update({ email }, { refreshToken });
    }
}
