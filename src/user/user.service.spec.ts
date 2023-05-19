import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaUserRepository } from './prismaUser.repository';

describe('UserService', () => {
  let service: UserService;

  const userRepositoryMock = {
    create: jest.fn(),
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

  describe('.create', () => {
    it('should call itself with correct params', async () => {
      const createUserInput = {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      };
      const createSpy = jest.spyOn(service, 'create');

      await service.create(createUserInput);

      expect(createSpy).toHaveBeenCalledWith(createUserInput);
    });
  });

  it('should call UserRepository .findUnique with correct values', async () => {
    const createUserInput = {
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    };
    // resets mock info so .toHaveBeenCalled won't be 2, wich is wrong.
    userRepositoryMock.findUnique.mockClear();
    const userRepositorySpy = jest.spyOn(userRepositoryMock, 'findUnique');

    await service.create(createUserInput);

    expect(userRepositorySpy).toHaveBeenCalledWith(createUserInput.email);
    expect(userRepositorySpy).toHaveBeenCalledTimes(1);
  });
});
