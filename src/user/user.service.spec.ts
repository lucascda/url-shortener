import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaUserRepository } from './prismaUser.repository';
import { UserAlreadyExistsError } from './errors/userAlreadyExists';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise((resolve) => {
      resolve('hashed_password');
    });
  },
}));

describe('UserService', () => {
  let service: UserService;

  const userRepositoryMock = {
    create: jest.fn(() => ({
      id: 1,
      name: 'any_name',
      email: 'any_mail@mail.com',
    })),
    findUnique: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaUserRepository, useValue: userRepositoryMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When creating a new user', () => {
    const createUserInput = {
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    };

    it('should call itself with correct params', async () => {
      const createSpy = jest.spyOn(service, 'create');

      await service.create(createUserInput);

      expect(createSpy).toHaveBeenCalledWith(createUserInput);
    });

    it('should check if user already exists', async () => {
      // resets mock info so .toHaveBeenCalled won't be 2, wich is wrong.
      userRepositoryMock.findUnique.mockClear();
      const userRepositorySpy = jest.spyOn(userRepositoryMock, 'findUnique');

      await service.create(createUserInput);

      expect(userRepositorySpy).toHaveBeenCalledWith(createUserInput.email);
      expect(userRepositorySpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user already exists', async () => {
      // don't need to return user object, true it's enough.
      jest.spyOn(userRepositoryMock, 'findUnique').mockReturnValue(true);

      const promise = service.create(createUserInput);

      await expect(promise).rejects.toThrow(new UserAlreadyExistsError());
    });

    it('should ensure user password is encrypted', async () => {
      const bcryptSpy = jest.spyOn(bcrypt, 'hash');
      jest.spyOn(userRepositoryMock, 'findUnique').mockResolvedValue(null);

      await service.create(createUserInput);

      expect(bcryptSpy).toHaveBeenCalledWith(createUserInput.password, 10);
    });

    it('should ensure correct user data is used when saving it', async () => {
      const userRepositorySpy = jest.spyOn(userRepositoryMock, 'create');

      userRepositoryMock.create.mockClear();
      await service.create(createUserInput);

      expect(userRepositorySpy).toHaveBeenCalledTimes(1);
      expect(userRepositorySpy).toHaveBeenCalledWith({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'hashed_password',
      });
    });

    it('should return correct response after user is created', async () => {
      const response = await service.create(createUserInput);

      expect(response).toEqual({
        id: 1,
        name: createUserInput.name,
        email: createUserInput.email,
      });
    });
  });
});
