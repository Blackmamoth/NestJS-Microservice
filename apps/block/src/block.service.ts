import { handleHTTPError } from '@app/shared/common/helper';
import { User, UserDocument } from '@app/shared/model/user/user.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class BlockService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getBlockedUsers(userId: ObjectId): Promise<UserDocument[]> {
    try {
      const user = await this.userModel
        .findOne({ _id: userId })
        .select('blockedUsers');
      if (!user) {
        throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
      }
      const users = await this.userModel.find({
        _id: { $in: user.blockedUsers },
      });
      return users;
    } catch (error) {
      handleHTTPError(error);
    }
  }

  async blockUser(userId: ObjectId, toBlockUserId: ObjectId): Promise<object> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    const blockedUsersList = user.toObject().blockedUsers;
    blockedUsersList.push(toBlockUserId);

    await user.updateOne({ blockedUsers: blockedUsersList }, { new: true });

    return {
      userDetails: {
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        blockedUsers: [...user.blockedUsers, toBlockUserId],
      },
      message: 'User successfully blocked from your list.',
    };
  }

  async unBlockUser(
    userId: ObjectId,
    toUnBlockUserId: ObjectId,
  ): Promise<object> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    const blockedUsersList = user
      .toObject()
      .blockedUsers.filter((id) => id != toUnBlockUserId);

    await user.updateOne({ blockedUsers: blockedUsersList }, { new: true });

    return {
      userDetails: {
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        blockedUsers: blockedUsersList,
      },
      message: 'User successfully blocked from your list.',
    };
  }
}
