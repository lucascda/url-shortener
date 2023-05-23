import { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInputDto } from 'src/user/dto/create-user.dto';
import { UserAlreadyExistsError } from 'src/user/errors/userAlreadyExists';
import { PrismaUserRepository } from 'src/user/prismaUser.repository';
import { UserService } from 'src/user/user.service';
import { faker } from '@faker-js/faker';

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
    await prisma.resetAutoIncrement();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('When creating a new user', () => {
    const userPassword = faker.internet.password();
    const createUserInput: CreateUserInputDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: userPassword,
      passwordConfirmation: userPassword,
    };

    it('should throw an error if user already exists', async () => {
      await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: createUserInput.email,
          password: faker.internet.password(),
        },
      });

      const promise = userService.create(createUserInput);

      await expect(promise).rejects.toThrow(new UserAlreadyExistsError());
    });

    it('should encrypt user password', async () => {
      await userService.create(createUserInput);
      const encryptedPassword = (await prisma.user.findFirst()).password;

      expect(encryptedPassword).not.toBe(createUserInput.password);
      expect(typeof encryptedPassword).toBe('string');
    });

    it('should create a user and return correct response data', async () => {
      const userResponse = await userService.create(createUserInput);

      expect(userResponse).toEqual({
        id: 1,
        name: createUserInput.name,
        email: createUserInput.email,
      });
    });
  });
});
