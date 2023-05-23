import { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaUserRepository } from 'src/user/prismaUser.repository';
import { faker } from '@faker-js/faker';

describe('PrismaUserRepository Integration Tests', () => {
  let repository: PrismaUserRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaUserRepository],
      imports: [PrismaModule],
    }).compile();

    repository = module.get<PrismaUserRepository>(PrismaUserRepository);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.cleanDatabase();
    await prisma.resetAutoIncrement();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should find unique user by email', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const anotherUserData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await prisma.user.create({ data: userData });
    await prisma.user.create({ data: anotherUserData });

    const user = await repository.findUnique(userData.email);

    expect(user).toEqual({
      ...userData,
      id: 1,
    });
  });

  it('should create a new user', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = await repository.create(userData);

    expect(user).toEqual({
      ...userData,
      id: 1,
    });
  });
});
