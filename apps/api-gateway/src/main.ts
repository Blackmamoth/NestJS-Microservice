import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GatewayRpcExceptionFilter } from '@app/shared/common/exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GatewayRpcExceptionFilter());
  await app.listen(3000);
}
bootstrap();
