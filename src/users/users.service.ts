import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async findEverything(): Promise<User[]> {
        const users = await this.userRepository.find({
            withDeleted: true
        });
        if (!users || users.length === 0) {
            throw new NotFoundException('유저가 없습니다.');
        }
        return users;
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`${id}에 해당하는 유저가 없습니다.`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new NotFoundException(`${email}에 해당하는 유저가 없습니다.`);
        }
        return user;
    }

    async restoreUser(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
            withDeleted: true
        });
        if (!user) {
            throw new NotFoundException(`${id}에 해당하는 유저가 없습니다.`);
        }
        if (user.deletedAt === null) {
            throw new BadRequestException('유저가 이미 복구되었습니다.');
        }
        const result = await this.userRepository.restore(id);
        if (result.affected === 0) {
            throw new BadRequestException('유저 복구에 실패했습니다.');
        }
        return user;
    }

    async create(userDto: CreateUserDto): Promise<User> {
        return await this.userRepository.save(userDto);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
        const result = await this.userRepository.update(id, updateUserDto);
        if (!result.affected) {
            throw new BadRequestException('유저 업데이트에 실패했습니다.');
        }
        return true;
    }

    async remove(email: string): Promise<boolean> {
        const result = await this.userRepository.softDelete({ email });
        if (result.affected === 0) {
            throw new BadRequestException('유저 삭제에 실패했습니다. 이미 삭제된 유저일 수 있습니다.');
        }
        return true;
    }
}
