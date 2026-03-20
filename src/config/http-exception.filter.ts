import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        console.log('exception--------------------------------', exception);
        console.log('host--------------------------------', host);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as { message: string | string[]; error: string };

        const message = Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message
            : [exceptionResponse.message ?? exception.message];

        const errorBody = {
            statusCode: status,
            error: exceptionResponse.error ?? HttpStatus[status],
            message,
            path: request.url,
            timestamp: new Date().toISOString()
        };

        this.logger.error(`${request.method} ${request.url} ${status}`, JSON.stringify(errorBody));

        response.status(status).json(errorBody);
    }
}