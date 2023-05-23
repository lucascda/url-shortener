import { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaUserRepository } from 'src/user/prismaUser.repository';

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
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
    };
    const anotherUserData = {
      name: 'another_name',
      email: 'another_email@mail.com',
      password: 'another_hashed_password',
    };
    await prisma.user.create({ data: userData });
    await prisma.user.create({ data: anotherUserData });

    const user = await repository.findUnique(userData.email);

    expect(user).toEqual({
      ...userData,
      id: 1,
    });
  });
});
