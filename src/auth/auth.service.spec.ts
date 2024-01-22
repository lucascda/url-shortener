import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UnauthorizedError } from './errors/unauthorizedError';
import { UserService } from 'src/user/user.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcrypt';
import { signInUserInput } from 'src/test/stubs/user-stub';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

jest.mock('bcrypt', () => ({
  async compare(): Promise<boolean> {
    return await new Promise((resolve) => {
      resolve(true);
    });
  },
}));

describe('AuthService', () => {
  let service: AuthService;

  const userServiceMock = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
      ],
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '3600s' },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when user is signing in', () => {
    it('should throw if user does not exists', async () => {
      jest.spyOn(userServiceMock, 'find').mockImplementation(() => false);

      const promise = service.signIn(signInUserInput);

      await expect(promise).rejects.toThrow(new UnauthorizedError());
    });

    it('should compare passwords', async () => {
      jest.spyOn(userServiceMock, 'find').mockImplementation(() => ({
        ...signInUserInput,
        id: 1,
        password: 'hashed_password',
      }));
      const bcryptSpy = jest.spyOn(bcrypt, 'compare');

      await service.signIn(signInUserInput);

      expect(bcryptSpy).toHaveBeenCalledWith(
        signInUserInput.password,
        'hashed_password',
      );
    });

    it('should throw if user password is wrong', async () => {
      jest.spyOn(userServiceMock, 'find').mockImplementation(() => ({
        ...signInUserInput,
        id: 1,
        password: 'hashed_password',
      }));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      const promise = service.signIn(signInUserInput);

      await expect(promise).rejects.toThrow(new UnauthorizedError());
    });
  });
});
