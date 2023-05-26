import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { faker } from '@faker-js/faker';
import { UnauthorizedError } from './errors/unauthorizedError';
import { UserService } from 'src/user/user.service';

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
  });
});
