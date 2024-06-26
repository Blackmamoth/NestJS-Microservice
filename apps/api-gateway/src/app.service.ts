import { RegisterUserDTO, LoginUserDTO } from '@app/shared/dto/auth/auth.dto';
import { BlockUserDTO, UnBlockUserDTO } from '@app/shared/dto/block/block.dto';
import {
  DeleteUsersDTO,
  SearchUsersDTO,
  UpdateUserDTO,
} from '@app/shared/dto/user/user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('BLOCK_SERVICE') private blockClient: ClientProxy,
  ) {}

  registerUser(registerUserDTO: RegisterUserDTO) {
    return this.authClient.send({ cmd: 'register_user' }, registerUserDTO);
  }

  loginUser(loginUserDTO: LoginUserDTO) {
    return this.authClient.send({ cmd: 'login_user' }, loginUserDTO);
  }

  searchUsers(searchUsersDTO: SearchUsersDTO, user: ObjectId) {
    return this.userClient.send(
      { cmd: 'search_users' },
      { query: searchUsersDTO, user },
    );
  }

  updateUser(updateUserDTO: UpdateUserDTO, user: ObjectId) {
    return this.userClient.send(
      { cmd: 'update_user' },
      { userDetails: updateUserDTO, user },
    );
  }

  deleteUsers(deleteUsersDTO: DeleteUsersDTO) {
    return this.userClient.send(
      { cmd: 'delete_users' },
      { deleteUsersDetail: deleteUsersDTO },
    );
  }

  getBlockedUsers(userId: ObjectId) {
    return this.blockClient.send({ cmd: 'get_blocked_users' }, { userId });
  }

  blockUser(blockUserDTO: BlockUserDTO, userId: ObjectId) {
    return this.blockClient.send(
      { cmd: 'block_user' },
      { blockUserDTO, userId },
    );
  }

  unBlockUser(unblockUserDTO: UnBlockUserDTO, userId: ObjectId) {
    return this.blockClient.send(
      { cmd: 'unblock_user' },
      { unblockUserDTO, userId },
    );
  }
}
