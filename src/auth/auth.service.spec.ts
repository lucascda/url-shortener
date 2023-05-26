import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { faker } from '@faker-js/faker';
import { UnauthorizedError } from './errors/unauthorizedError';
import { UserService } from 'src/user/user.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcrypt';

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
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when user is signing in', () => {
    it('should throw if user does not exists', async () => {
      const signInUserInput = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      jest.spyOn(userServiceMock, 'find').mockImplementation(() => false);

      const promise = service.auth(signInUserInput);

      await expect(promise).rejects.toThrow(new UnauthorizedError());
    });

    it('should compare passwords', async () => {
      const signInUserInput = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      jest.spyOn(userServiceMock, 'find').mockImplementation(() => ({
        ...signInUserInput,
        id: 1,
        password: 'hashed_password',
      }));
      const bcryptSpy = jest.spyOn(bcrypt, 'compare');

      await service.auth(signInUserInput);

      expect(bcryptSpy).toHaveBeenCalledWith(
        signInUserInput.password,
        'hashed_password',
      );
    });

    it('should throw if user password is wrong', async () => {
      const signInUserInput = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      jest.spyOn(userServiceMock, 'find').mockImplementation(() => ({
        ...signInUserInput,
        id: 1,
        password: 'hashed_password',
      }));
      jest.spyOn(userServiceMock, 'find').mockImplementation(() => false);

      const promise = service.auth(signInUserInput);

      await expect(promise).rejects.toThrow(new UnauthorizedError());
    });
  });
});
