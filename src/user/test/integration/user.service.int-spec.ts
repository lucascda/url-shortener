import { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInputDto } from 'src/user/dto/create-user.dto';
import { PrismaUserRepository } from 'src/user/prismaUser.repository';
import { UserService } from 'src/user/user.service';

describe('UserService Integration Tests', () => {
  let prisma: PrismaService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaUserRepository],
      imports: [PrismaModule],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);

    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('When creating a new user', () => {
    const createUserInput: CreateUserInputDto = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    };

    it('should create a user and return correct response data', async () => {
      const userResponse = await userService.create(createUserInput);

      expect(userResponse).toEqual({
        id: 1,
        name: 'any_name',
        email: 'any_email@mail.com',
      });
    });
  });
});
