import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  DeleteUsersDTO,
  SearchUsersDTO,
  UpdateUserDTO,
} from '@app/shared/dto/user/user.dto';
import { ObjectId } from 'mongoose';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'search_users' })
  searchUsers(payload: { query: SearchUsersDTO; user: ObjectId }) {
    return this.userService.searchUsers(payload.query, payload.user);
  }

  @MessagePattern({ cmd: 'update_user' })
  updateUser(payload: { userDetails: UpdateUserDTO; user: ObjectId }) {
    return this.userService.updateUser(payload.userDetails, payload.user);
  }

  @MessagePattern({ cmd: 'delete_users' })
  deleteUsers(payload: { deleteUsersDetail: DeleteUsersDTO }) {
    return this.userService.deleteUsers(payload.deleteUsersDetail);
  }
}
