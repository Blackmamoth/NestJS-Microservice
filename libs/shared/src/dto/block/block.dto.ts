import { IsHexadecimal, Length } from 'class-validator';
import { ObjectId } from 'mongoose';

export class GetBlockedUsersDTO {
  @IsHexadecimal()
  @Length(24, 24)
  userId: ObjectId;
}

export class BlockUserDTO {
  @IsHexadecimal()
  @Length(24, 24)
  userId: ObjectId;
}

export class UnBlockUserDTO {
  @IsHexadecimal()
  @Length(24, 24)
  userId: ObjectId;
}
