import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, length: 20 })
  name: string;

  @Prop({ required: true, length: 40 })
  surname: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ default: [] })
  blockedUsers: Array<ObjectId>;
}

export const UserSchema = SchemaFactory.createForClass(User);
