import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserSchema,
} from '../../../libs/shared/src/model/user/user.model';
import { JwtModule } from '@nestjs/jwt';
import GlobalConstants from '@app/shared/common/constants';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:pass@localhost:27017'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: GlobalConstants.JWT_SECRET,
      signOptions: { expiresIn: GlobalConstants.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
