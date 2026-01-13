import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // 글로벌 파이프 설정 (데이터 검증 및 변환)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // DTO에 없는 속성은 무조건 거름 (보안상 매우 중요!)
            forbidNonWhitelisted: true, // DTO에 없는 속성이 오면 에러 발생시킴
            transform: true // 입력받은 데이터를 DTO 클래스로 자동 변환
        })
    );

    // 글로벌 인터셉터 설정 (직렬화)
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // Swagger 설정 (개발 환경에서만 활성화)
    setupSwagger(app);

    await app.listen(app.get(ConfigService).get<number>('PORT') || 8000);
}

bootstrap().catch((error) => console.error(error));
