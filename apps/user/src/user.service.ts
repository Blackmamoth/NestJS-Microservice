import { handleHTTPError } from '@app/shared/common/helper';
import {
  DeleteUsersDTO,
  SearchUsersDTO,
  UpdateUserDTO,
} from '@app/shared/dto/user/user.dto';
import { User } from '@app/shared/model/user/user.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { GetUserQuery } from './types/user.types';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async searchUsers(searchUserDTO: SearchUsersDTO, userId: ObjectId) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        throw new HttpException(
          'Could not fetch user details',
          HttpStatus.NOT_FOUND,
        );
      }
      const query = this.generateGetUserQuery(searchUserDTO);
      const users = await this.userModel
        .find({ ...query, _id: { $nin: user.blockedUsers } })
        .lean()
        .select('-password');
      return users;
    } catch (error) {
      handleHTTPError(error);
    }
  }

  private generateGetUserQuery(searchUserDTO: SearchUsersDTO): GetUserQuery {
    const query: GetUserQuery = {};

    if (searchUserDTO.email) query.email = searchUserDTO.email;

    if (searchUserDTO.username) query.username = searchUserDTO.username;

    if (searchUserDTO.bornBefore || searchUserDTO.bornAfter) {
      query.birthDate = {};
      if (searchUserDTO.bornBefore) {
        const date = new Date(searchUserDTO.bornBefore);
        query.birthDate.$lte = date;
      }
      if (searchUserDTO.bornAfter) {
        const date = new Date(searchUserDTO.bornAfter);
        query.birthDate.$gte = date;
      }
    }
    return query;
  }

  async updateUser(updateUserDTO: UpdateUserDTO, userId: ObjectId) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        throw new HttpException(
          `User [${userId}] does not exist.`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (updateUserDTO.email) {
        const doesEmailExist = await this.userModel.findOne({
          email: updateUserDTO.email,
        });
        if (doesEmailExist) {
          throw new HttpException(
            `Email [${updateUserDTO.email}] already in use.`,
            HttpStatus.CONFLICT,
          );
        }
      }

      if (updateUserDTO.username) {
        const doesUsernameExist = await this.userModel.findOne({
          username: updateUserDTO.username,
        });
        if (doesUsernameExist) {
          throw new HttpException(
            `Username [${updateUserDTO.username}] already taken.`,
            HttpStatus.CONFLICT,
          );
        }
      }

      await user.updateOne(updateUserDTO, { new: true });

      return {
        message: 'User details updated successfully!!!',
      };
    } catch (error) {
      handleHTTPError(error);
    }
  }

  async deleteUsers(deleteUsersDTO: DeleteUsersDTO) {
    try {
      const users = await this.userModel.find({
        _id: { $in: deleteUsersDTO.userIds },
      });

      if (users.length === 0) {
        return {
          message: 'Could not find these users.',
        };
      }

      await Promise.all(
        users.map(async (user) => {
          await user.deleteOne();
        }),
      );

      return {
        message: 'Users deleted successfully.',
      };
    } catch (error) {
      handleHTTPError(error);
    }
  }
}
