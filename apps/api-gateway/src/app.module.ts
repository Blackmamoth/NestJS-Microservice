import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import GlobalConstants from '@app/shared/common/constants';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3001,
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3002,
        },
      },
      {
        name: 'BLOCK_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3003,
        },
      },
    ]),
    JwtModule.register({
      secret: GlobalConstants.JWT_SECRET,
      signOptions: {
        expiresIn: GlobalConstants.JWT_EXPIRES_IN,
      },
    }),
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
