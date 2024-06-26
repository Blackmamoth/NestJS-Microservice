import { NestFactory } from '@nestjs/core';
import { BlockModule } from './block.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BlockModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3003,
      },
    },
  );
  await app.listen();
}
bootstrap();
