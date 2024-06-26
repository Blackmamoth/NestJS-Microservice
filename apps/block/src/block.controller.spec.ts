import { Test, TestingModule } from '@nestjs/testing';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { BlockUserDTO, UnBlockUserDTO } from '@app/shared/dto/block/block.dto';
import { ObjectId } from 'mongoose';

describe('BlockController', () => {
  let blockController: BlockController;
  let blockService: BlockService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockController],
      providers: [{
        provide: BlockService,
        useValue: {
          getBlockedUsers: jest.fn(),
          blockUser: jest.fn(),
          unBlockUser: jest.fn(),
        }
      }],
    }).compile();

    blockController = app.get<BlockController>(BlockController);
    blockService = app.get<BlockService>(BlockService);
  });

  it('should be defined', () => {
    expect(blockController).toBeDefined();
  });

  describe('getBlockedUsers', () => {
    it('should call BlockService.getBlockedUsers with the correct parameters', async () => {
      const userId: ObjectId = '507f191e810c19729de860ea' as unknown as ObjectId;
      const result = [];

      jest.spyOn(blockService, 'getBlockedUsers').mockResolvedValue(result);

      expect(await blockController.getBlockedUsers({ userId })).toBe(result);
      expect(blockService.getBlockedUsers).toHaveBeenCalledWith(userId);
    });
  });

  describe('blockUser', () => {
    it('should call BlockService.blockUser with the correct parameters', async () => {
      const blockUserDTO: BlockUserDTO = { userId: '507f191e810c19729de860eb' as unknown as ObjectId };
      const userId: ObjectId = '507f191e810c19729de860ea' as unknown as ObjectId;
      const result = { message: 'User successfully blocked from your list.' };

      jest.spyOn(blockService, 'blockUser').mockResolvedValue(result);

      expect(await blockController.blockUser({ blockUserDTO, userId })).toBe(result);
      expect(blockService.blockUser).toHaveBeenCalledWith(userId, blockUserDTO.userId);
    });
  });

  describe('unBlockUser', () => {
    it('should call BlockService.unBlockUser with the correct parameters', async () => {
      const unblockUserDTO: UnBlockUserDTO = { userId: '507f191e810c19729de860eb' as unknown as ObjectId };
      const userId: ObjectId = '507f191e810c19729de860ea' as unknown as ObjectId;
      const result = { message: 'User successfully blocked from your list.' };

      jest.spyOn(blockService, 'unBlockUser').mockResolvedValue(result);

      expect(await blockController.unBlockUser({ unblockUserDTO, userId })).toBe(result);
      expect(blockService.unBlockUser).toHaveBeenCalledWith(userId, unblockUserDTO.userId);
    });
  });
});
