import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { Post as PostEntity } from './entity/post.entity';
import { CurrentUser, type CurrentUserType } from 'src/users/decorators/current-user.decorator';
import { CreatePostDto } from './dto/request/create-post.dto';
import { JwtGuard } from 'src/users/guards/jwt.guard';
import { Public } from 'src/users/decorators/public.decorator';

@ApiTags('Posts (게시물)')
@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostService) {}

    @Get()
    @Public()
    @ApiOperation({ summary: 'ADMIN 권한으로 게시물 목록 조회', description: '게시물 목록을 조회합니다.' })
    async findAll(): Promise<PostEntity[]> {
        return await this.postService.findAll();
    }

    @Get('/my')
    @ApiOperation({ summary: 'USER 권한으로 게시물 목록 조회', description: '게시물 목록을 조회합니다.' })
    async findAllByUser(@CurrentUser() user: CurrentUserType): Promise<PostEntity[]> {
        return await this.postService.findAllByUser(user.email);
    }

    @Get(':id')
    @ApiOperation({ summary: '게시물 상세 조회', description: '게시물 상세를 조회합니다.' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
        return await this.postService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: '게시물 생성', description: '게시물을 생성합니다.' })
    async create(@CurrentUser() user: CurrentUserType, @Body() createPostDto: CreatePostDto): Promise<boolean> {
        return await this.postService.createPost(user.email, createPostDto);
    }
}
