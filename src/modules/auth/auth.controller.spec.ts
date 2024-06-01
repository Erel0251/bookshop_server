import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mockResponse } from '../../shared/dto/mock-response.dto';
import { Role } from '../user/constants/role.enum';
import { HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';

const mockUser = {
  email: 'helloworld@gmail.com',
  password: 'helloworld',
  roles: [Role.USER],
};

const mockAuthService = {
  signUp: jest.fn().mockResolvedValue(mockUser),
  login: jest.fn().mockResolvedValue(mockUser),
  logout: jest.fn().mockResolvedValue(true),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Sign up
  describe('signUp', () => {
    it('should return a user', async () => {
      const res = mockResponse();
      await controller.signUp(mockUser as CreateUserDto, res);

      expect(mockAuthService.signUp).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.cookie).toHaveBeenCalled();
    });
  });

  // Login
  describe('login', () => {
    it('should return a user', async () => {
      const res = mockResponse();
      await controller.login(mockUser as CreateUserDto, res);

      expect(mockAuthService.login).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.cookie).toHaveBeenCalled();
    });
  });

  // Logout
  describe('logout', () => {
    it('should return true', async () => {
      const res = mockResponse();
      await controller.logout(mockUser.email, res);

      //expect(mockAuthService.logout).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });
});
