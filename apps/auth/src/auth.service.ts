import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
} from '../../../libs/shared/src/model/user/user.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO, RegisterUserDTO } from '@app/shared/dto/auth/auth.dto';
import { handleHTTPError } from '@app/shared/common/helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDTO: RegisterUserDTO): Promise<object> {
    try {
      const checkUserByEmail = await this.getUserByEmail(createUserDTO.email);

      if (checkUserByEmail !== null) {
        throw new HttpException(
          `Email [${createUserDTO.email}] already in use.`,
          HttpStatus.CONFLICT,
        );
      }

      const checkUserByUserName = await this.getUserByUserName(
        createUserDTO.username,
      );
      if (checkUserByUserName !== null) {
        throw new HttpException(
          `Username [${createUserDTO.username}] already taken.`,
          HttpStatus.CONFLICT,
        );
      }

      const hashedPassword = await this.hashUserPassword(
        createUserDTO.password,
      );

      const user = new this.userModel({
        name: createUserDTO.name,
        surname: createUserDTO.surname,
        username: createUserDTO.username,
        email: createUserDTO.email,
        password: hashedPassword,
        birthDate: createUserDTO.birthDate,
        blocked: [],
      });

      await user.save();

      return {
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        birthDate: user.birthDate,
        blockedUsers: user.blockedUsers,
      };
    } catch (error) {
      handleHTTPError(error);
    }
  }

  async loginUser(loginUserDTO: LoginUserDTO): Promise<object> {
    try {
      const user = await this.userModel.findOne({
        $or: [
          { username: loginUserDTO.loginId },
          { email: loginUserDTO.loginId },
        ],
      });

      if (user === null) {
        throw new HttpException(
          `Invalid login id, please try again with valid username or email.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const hashedPassword = user.password;

      if (!(await bcrypt.compare(loginUserDTO.password, hashedPassword))) {
        throw new HttpException(
          `Invalid password, please try again with valid password.`,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const accessToken = await this.signJWT(user);

      return {
        userDetails: {
          name: user.name,
          surname: user.surname,
          username: user.username,
          email: user.email,
          birthDate: user.birthDate,
          blockedUsers: user.blockedUsers,
        },
        accessToken: accessToken,
      };
    } catch (error) {
      handleHTTPError(error);
    }
  }

  private async getUserByUserName(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username: username });
    return user;
  }

  private async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  private async hashUserPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  private async signJWT(user: UserDocument): Promise<string> {
    return await this.jwtService.signAsync({ userId: user._id });
  }
}
