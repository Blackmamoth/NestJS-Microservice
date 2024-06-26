import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SearchUsersDTO, UpdateUserDTO, DeleteUsersDTO } from '@app/shared/dto/user/user.dto';
import { Schema, ObjectId } from 'mongoose';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UserService,
        useValue: {
          searchUsers: jest.fn(),
          updateUser: jest.fn(),
          deleteUsers: jest.fn(),
        }
      }],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);


  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('searchUsers', () => {
    it('should call UserService.searchUsers with the correct parameters', async () => {
      const query: SearchUsersDTO = {
        email: 'test@example.com',
        username: 'testuser',
        bornBefore: "2008",
        bornAfter: null,
      };
      const user: ObjectId = '507f191e810c19729de860ea' as unknown as ObjectId;
      const result = [];

      jest.spyOn(userService, 'searchUsers').mockResolvedValue(result);

      expect(await userController.searchUsers({ query, user })).toBe(result);
      expect(userService.searchUsers).toHaveBeenCalledWith(query, user);
    });
  });

  describe('updateUser', () => {
    it('should call UserService.updateUser with the correct parameters', async () => {
      const userDetails: UpdateUserDTO = {
        email: 'newemail@example.com',
        username: 'newusername',
      };
      const user: ObjectId = '507f191e810c19729de860ea' as unknown as ObjectId;
      const result = { message: 'User details updated successfully!!!' };

      jest.spyOn(userService, 'updateUser').mockResolvedValue(result);

      expect(await userController.updateUser({ userDetails, user })).toBe(result);
      expect(userService.updateUser).toHaveBeenCalledWith(userDetails, user);
    });
  });

  describe('deleteUsers', () => {
    it('should call UserService.deleteUsers with the correct parameters', async () => {
      const deleteUsersDetail: DeleteUsersDTO = { userIds: [new Schema.Types.ObjectId('507f191e810c19729de860ea')] };
      const result = { message: 'Users deleted successfully.' };

      jest.spyOn(userService, 'deleteUsers').mockResolvedValue(result);

      expect(await userController.deleteUsers({ deleteUsersDetail })).toBe(result);
      expect(userService.deleteUsers).toHaveBeenCalledWith(deleteUsersDetail);
    });
  });


});
