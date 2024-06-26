import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BlockService } from './block.service';
import { User } from '@app/shared/model/user/user.model';
import { Model, ObjectId } from 'mongoose';

describe('BlockService', () => {
    let blockService: BlockService;
    let userModel: Model<User>;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                BlockService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        updateOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        blockService = app.get<BlockService>(BlockService);
        userModel = app.get<Model<User>>(getModelToken(User.name));
    });

    it('should be defined', () => {
        expect(blockService).toBeDefined();
    });

    describe('getBlockedUsers', () => {
        it('should return a list of blocked users', async () => {
            const userId: ObjectId = '507f191e810c19729de860ea' as unknown as ObjectId;
            const user = {
                _id: userId,
                blockedUsers: ['507f191e810c19729de860eb'],
            };
            const blockedUsers = [{ username: 'blockeduser' }];

            jest.spyOn(userModel, 'findOne').mockResolvedValue(user);
            jest.spyOn(userModel, 'find').mockResolvedValue(blockedUsers);

            const result = await blockService.getBlockedUsers(userId);

            expect(result).toEqual(blockedUsers);
        });

    });

    describe('blockUser', () => {
        it('should block a user successfully', async () => {
            const userId: ObjectId = '507f191e810c19729de860ea' as unknown as ObjectId;
            const toBlockUserId: ObjectId = '507f191e810c19729de860eb' as unknown as ObjectId;
            const user = {
                _id: userId,
                blockedUsers: [],
                updateOne: jest.fn(),
                toObject: jest.fn().mockReturnValue({ blockedUsers: [] }),
            };

            jest.spyOn(userModel, 'findOne').mockResolvedValue(user);

            const result = await blockService.blockUser(userId, toBlockUserId);

            expect(result).toEqual({
                userDetails: {
                    name: undefined,
                    surname: undefined,
                    username: undefined,
                    email: undefined,
                    blockedUsers: [toBlockUserId],
                },
                message: 'User successfully blocked from your list.',
            });
            expect(user.updateOne).toHaveBeenCalledWith({ blockedUsers: [toBlockUserId] }, { new: true });
        });

        // Add more tests for different scenarios
    });

    describe('unBlockUser', () => {
        it('should unblock a user successfully', async () => {
            const userId: ObjectId = '507f191e810c19729de860ea' as unknown as ObjectId;
            const toUnBlockUserId: ObjectId = '507f191e810c19729de860eb' as unknown as ObjectId;
            const user = {
                _id: userId,
                blockedUsers: [toUnBlockUserId],
                updateOne: jest.fn(),
                toObject: jest.fn().mockReturnValue({ blockedUsers: [toUnBlockUserId] }),
            };

            jest.spyOn(userModel, 'findOne').mockResolvedValue(user);

            const result = await blockService.unBlockUser(userId, toUnBlockUserId);

            expect(result).toEqual({
                userDetails: {
                    name: undefined,
                    surname: undefined,
                    username: undefined,
                    email: undefined,
                    blockedUsers: [],
                },
                message: 'User successfully blocked from your list.',
            });
            expect(user.updateOne).toHaveBeenCalledWith({ blockedUsers: [] }, { new: true });
        });

    });
});
