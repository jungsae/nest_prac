import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Swagger 설정 (개발 환경에서만 활성화)
    setupSwagger(app);

    await app.listen(app.get(ConfigService).get<number>('PORT') || 8000);
}

bootstrap().catch((error) => console.error(error));
