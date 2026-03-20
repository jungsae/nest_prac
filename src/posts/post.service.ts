import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { CreatePostDto } from './dto/request/create-post.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private readonly postRepository: Repository<Post>,
        private readonly usersService: UsersService
    ) {}

    async findAll(): Promise<Post[]> {
        return await this.postRepository.find();
    }

    async findAllByUser(email: string): Promise<Post[]> {
        const user = await this.usersService.findByEmail(email);
        return await this.postRepository.find({ where: { userId: user.id }, relations: ['user'] });
    }

    async findOne(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException(`게시물 ${id}를 찾을 수 없습니다.`);
        }
        return post;
    }

    async createPost(email: string, createPostDto: CreatePostDto): Promise<boolean> {
        const user = await this.usersService.findByEmail(email);
        await this.postRepository.save({ ...createPostDto, userId: user.id });
        return true;
    }
}
