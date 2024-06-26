import {
  IsAlpha,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
  ValidatorConstraintInterface,
} from 'class-validator';

class PasswordValidator implements ValidatorConstraintInterface {
  validate(password: string): boolean | Promise<boolean> {
    return (
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      !/\s/.test(password)
    );
  }

  defaultMessage(): string {
    return 'Password must contain at least one number, one uppercase letter, one lowercase letter, one digit, and no spaces.';
  }
}

export class RegisterUserDTO {
  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 20)
  name: string;

  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 40)
  surname: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 16)
  @Validate(PasswordValidator)
  password: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;
}

export class LoginUserDTO {
  @IsNotEmpty()
  @IsString()
  loginId: string;

  @IsNotEmpty()
  @Length(8, 16)
  @Validate(PasswordValidator)
  password: string;
}
