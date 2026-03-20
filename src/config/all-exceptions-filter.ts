import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        console.log('exception--------------------------------', exception);
        console.log('host--------------------------------', host);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // HttpException이면 HttpExceptionFilter에서 처리했어야 하지만 혹시 모를 경우 대비
        if (exception instanceof HttpException) {
            return response.status(exception.getStatus()).json({
                statusCode: exception.getStatus(),
                message: [exception.message],
                path: request.url,
                timestamp: new Date().toISOString()
            });
        }

        // DB 오류, JS 런타임 에러 등 예상치 못한 에러
        this.logger.error(
            `[UNHANDLED] ${request.method} ${request.url}`,
            exception instanceof Error ? exception.stack : String(exception)
        );

        response.status(500).json({
            statusCode: 500,
            error: 'Internal Server Error',
            message: ['서버 내부 오류가 발생했습니다.'],
            path: request.url,
            timestamp: new Date().toISOString()
        });
    }
}