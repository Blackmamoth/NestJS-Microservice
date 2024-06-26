import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { User, UserSchema } from '@app/shared/model/user/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import GlobalConstants from '@app/shared/common/constants';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${GlobalConstants.MONGO_USER}:${GlobalConstants.MONGO_PASS}@localhost:27017`),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [BlockController],
  providers: [BlockService],
})
export class BlockModule { }
