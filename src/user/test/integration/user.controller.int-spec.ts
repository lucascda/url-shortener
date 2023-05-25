import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaUserRepository } from 'src/user/prismaUser.repository';
import { UserController } from 'src/user/user.controller';
import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

describe('UserController Integration Tests', () => {
  let prisma: PrismaService;
  let userController: UserController;

  const repositoryMock = {
    findUnique: jest.fn(),
    create: jest.fn(),
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

  it('Should throw if UserService throws UserAlreadyExistsExcetion', async () => {
    const userPassword = faker.internet.password();
    const userInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: userPassword,
      passwordConfirmation: userPassword,
    };
    // If repository returns it means service it will throw as well
    jest.spyOn(repositoryMock, 'findUnique').mockResolvedValue(true);

    const promise = userController.create(userInput);

    await expect(promise).rejects.toThrow(
      new ConflictException('User already exists'),
    );
  });
});
