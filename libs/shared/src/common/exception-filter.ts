import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GatewayRpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const exceptionData = exception as unknown as {
      response: string;
      status: number;
      message: string;
      name: string;
    };

    response.status(exceptionData.status).json({
      message: exceptionData.message,
      status: exceptionData.status,
    });
  }
}
