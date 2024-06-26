import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from '@app/shared/model/user/user.model';
import { Model, ObjectId, Schema } from 'mongoose';
import { DeleteUsersDTO, SearchUsersDTO, UpdateUserDTO } from '@app/shared/dto/user/user.dto';

describe('UserService', () => {
    let userService: UserService;
    let userModel: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        updateOne: jest.fn(),
                        deleteOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userModel = module.get<Model<User>>(getModelToken(User.name));
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('searchUsers', () => {
        it('should return a list of users', async () => {
            const searchUserDTO: SearchUsersDTO = {
                email: 'test@example.com',
                username: 'testuser',
                bornBefore: "2004",
                bornAfter: null,
            };
            const userId: ObjectId = '507f191e810c19729de860ea' as unknown as ObjectId;
            const user = {
                _id: userId,
                blockedUsers: [],
            };
            const users = [{ username: 'testuser' }];

            jest.spyOn(userModel, 'findOne').mockResolvedValue(user);
            jest.spyOn(userModel, 'find').mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    select: jest.fn().mockResolvedValue(users),
                }),
            } as any);

            const result = await userService.searchUsers(searchUserDTO, userId);

            expect(result).toEqual(users);
        });

        // Add more tests for different scenarios
    });

    describe('updateUser', () => {
        it('should update user details successfully', async () => {
            const updateUserDTO: UpdateUserDTO = {
                email: 'newemail@example.com',
                username: 'newusername',
            };
            const userId: ObjectId = '507f191e810c19729de860ea' as unknown as ObjectId;
            const user = {
                _id: userId,
                updateOne: jest.fn(),
            };

            jest.spyOn(userModel, 'findOne').mockResolvedValue(user);
            jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null); // No user with new email
            jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null); // No user with new username

            const result = await userService.updateUser(updateUserDTO, userId);

            expect(result).toEqual({ message: 'User details updated successfully!!!' });
        });

        // Add more tests for different scenarios
    });

    describe('deleteUsers', () => {
        it('should delete users successfully', async () => {
            const deleteUsersDTO: DeleteUsersDTO = { userIds: [new Schema.Types.ObjectId('507f191e810c19729de860ea')] };
            const users = [{ _id: '507f191e810c19729de860ea', deleteOne: jest.fn() }];

            jest.spyOn(userModel, 'find').mockResolvedValue(users);

            const result = await userService.deleteUsers(deleteUsersDTO);

            expect(result).toEqual({ message: 'Users deleted successfully.' });
        });

        // Add more tests for different scenarios
    });
});
