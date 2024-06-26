import { Controller } from '@nestjs/common';
import { BlockService } from './block.service';
import { MessagePattern } from '@nestjs/microservices';
import { BlockUserDTO, UnBlockUserDTO } from '@app/shared/dto/block/block.dto';
import { ObjectId } from 'mongoose';

@Controller()
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @MessagePattern({ cmd: 'get_blocked_users' })
  getBlockedUsers(payload: { userId: ObjectId }) {
    return this.blockService.getBlockedUsers(payload.userId);
  }

  @MessagePattern({ cmd: 'block_user' })
  blockUser(payload: { blockUserDTO: BlockUserDTO; userId: ObjectId }) {
    return this.blockService.blockUser(
      payload.userId,
      payload.blockUserDTO.userId,
    );
  }

  @MessagePattern({ cmd: 'unblock_user' })
  unBlockUser(payload: { unblockUserDTO: UnBlockUserDTO; userId: ObjectId }) {
    return this.blockService.unBlockUser(
      payload.userId,
      payload.unblockUserDTO.userId,
    );
  }
}
