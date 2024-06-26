import {
  IsNotEmpty,
  IsAlpha,
  IsOptional,
  IsEmail,
  IsNumberString,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsHexadecimal,
  Length,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class SearchUsersDTO {
  @IsNotEmpty()
  @IsAlpha()
  @IsOptional()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsNumberString()
  @IsOptional()
  bornBefore: string;

  @IsNumberString()
  @IsOptional()
  bornAfter: string;
}

export class UpdateUserDTO {
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;
}

export class DeleteUsersDTO {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsNotEmpty({ each: true })
  @IsHexadecimal({ each: true })
  @Length(24, 24, { each: true })
  userIds: ObjectId[];
}
