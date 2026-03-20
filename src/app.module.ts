import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';
import { PostModule } from './posts/post.module';
import { Post } from './posts/entity/post.entity';
import { LoggingInterceptor } from './config/logging-intercepter';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './config/http-exception.filter';
import { AllExceptionsFilter } from './config/all-exceptions-filter';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                entities: [User, Post],
                synchronize: true,
                logging: true
            })
        }),
        UsersModule,
        PostModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useFactory: () =>
                new ValidationPipe({
                    whitelist: true, // DTO에 없는 속성은 무조건 거름
                    forbidNonWhitelisted: true, // DTO에 없는 속성이 오면 에러 발생시킴
                    transform: true, // @Param, @Query, @Body 등에 입력받은 데이터를 DTO 클래스로 자동 변환
                })
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor // (1) 요청 및 응답을 가장 먼저 로깅
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor // (2) 응답 직렬화는 마지막에 실행
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter // 모든 에러 필터
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter // HTTP 에러 필터
        }
    ]
})
export class AppModule {}
