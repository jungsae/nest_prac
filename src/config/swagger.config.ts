import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication): void {
    const configService = app.get(ConfigService);
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');

    // 프로덕션에서는 Swagger 비활성화
    if (nodeEnv === 'production') {
        console.log('Swagger is disabled in production');
        return;
    }

    const config = new DocumentBuilder()
        .setTitle('Jamazon API')
        .setDescription('Jamazon 쇼핑몰 개발을 위한 API 문서입니다')
        .setVersion(configService.get<string>('API_VERSION', '0.0.1'))
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT 토큰을 입력하세요',
            in: 'header'
        })
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Jamazon API Documentation'
    });
}
