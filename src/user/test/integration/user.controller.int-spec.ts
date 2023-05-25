import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaUserRepository } from 'src/user/prismaUser.repository';
import { UserController } from 'src/user/user.controller';
import { ConflictException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { createUserInput } from '../../../test/stubs/user-stub';

describe('UserController Integration Tests', () => {
  let prisma: PrismaService;
  let userController: UserController;

  const repositoryMock = {
    findUnique: jest.fn(),
    create: jest.fn(() => ({ ...createUserInput, id: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserController,
        UserService,
        { provide: PrismaUserRepository, useValue: repositoryMock },
      ],
      imports: [PrismaModule],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    userController = module.get<UserController>(UserController);

    await prisma.cleanDatabase();
    await prisma.resetAutoIncrement();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Should throw if UserService throws UserAlreadyExistsException', async () => {
    // If repository returns it means service it will throw as well
    jest.spyOn(repositoryMock, 'findUnique').mockResolvedValue(true);

    const promise = userController.create(createUserInput);

    await expect(promise).rejects.toThrow(
      new ConflictException('User already exists'),
    );
  });

  it('Should create a new user', async () => {
    // User does not exist already
    jest.spyOn(repositoryMock, 'findUnique').mockResolvedValue(false);
    const response = await userController.create(createUserInput);

    expect(response).toEqual({
      id: 1,
      name: createUserInput.name,
      email: createUserInput.email,
    });
  });
});
