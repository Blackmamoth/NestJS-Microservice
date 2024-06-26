import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../libs/shared/src/model/user/user.model';
import { Model } from 'mongoose';
import { RegisterUserDTO, LoginUserDTO } from '@app/shared/dto/auth/auth.dto';

describe('AuthService', () => {
    let userService: AuthService;
    let userModel: Model<User>;
    let jwtService: JwtService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
            ],
        }).compile();

        userService = app.get<AuthService>(AuthService);
        userModel = app.get<Model<User>>(getModelToken(User.name));
        jwtService = app.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('registerUser', () => {
        it('should successfully register a user', async () => {
            const dto: RegisterUserDTO = {
                name: 'John',
                surname: 'Doe',
                username: 'johndoe',
                email: 'john.doe@example.com',
                password: 'password',
                birthDate: new Date(),
            };

            jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(userModel, 'create').mockReturnValue({
                ...dto,
                password: 'hashedPassword',
                save: jest.fn(),
            } as any);

            const result = await userService.registerUser(dto);

            expect(result).toEqual({
                name: dto.name,
                surname: dto.surname,
                username: dto.username,
                email: dto.email,
                birthDate: dto.birthDate,
                blockedUsers: [],
            });
        });

    });

    describe('loginUser', () => {
        it('should successfully login a user', async () => {
            const dto: LoginUserDTO = {
                loginId: 'testuser9',
                password: 'Admin123',
            };
            const user = {
                username: 'johndoe',
                email: 'john.doe@example.com',
                password: 'hashedPassword',
                name: 'John',
                surname: 'Doe',
                birthDate: new Date(),
                blockedUsers: [],
                _id: 'userId',
            };

            jest.spyOn(userModel, 'findOne').mockResolvedValue(user as any);
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('accessToken');

            const result = await userService.loginUser(dto);

            expect(result).toEqual({
                userDetails: {
                    name: user.name,
                    surname: user.surname,
                    username: user.username,
                    email: user.email,
                    birthDate: user.birthDate,
                    blockedUsers: user.blockedUsers,
                },
                accessToken: 'accessToken',
            });
        });

    });
});
