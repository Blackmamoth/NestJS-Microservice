import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDTO, RegisterUserDTO } from '@app/shared/dto/auth/auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: {
          registerUser: jest.fn(),
          loginUser: jest.fn(),
        }
      }],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })


  describe('registerUser', () => {
    it('should call AuthService.registerUser with the correct parameters', async () => {
      const dto: RegisterUserDTO = {
        name: 'John',
        surname: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'password',
        birthDate: new Date(),
      };
      const result = { message: 'User registered successfully' };

      jest.spyOn(authService, 'registerUser').mockResolvedValue(result);

      expect(await authController.registerUser(dto)).toBe(result);
      expect(authService.registerUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('loginUser', () => {
    it('should call AuthService.loginUser with the correct parameters', async () => {
      const dto: LoginUserDTO = {
        loginId: 'johndoe',
        password: 'password',
      };
      const result = { accessToken: 'some_token' };

      jest.spyOn(authService, 'loginUser').mockResolvedValue(result);

      expect(await authController.loginUser(dto)).toBe(result);
      expect(authService.loginUser).toHaveBeenCalledWith(dto);
    });
  });

});
