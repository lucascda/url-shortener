import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUrlData } from 'src/url/dto/create-url.dto';
import { PrismaUrlRepository } from 'src/url/prismaUrl.repository';

describe('PrismaUrlRepository Integration Tests', () => {
  let repository: PrismaUrlRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaUrlRepository],
      imports: [PrismaModule],
    }).compile();

    repository = module.get<PrismaUrlRepository>(PrismaUrlRepository);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.cleanDatabase();
    await prisma.resetAutoIncrement();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('#create', () => {
    it('creates new shorten url and save it to database', async () => {
      const createUrlInput: CreateUrlData = {
        original_url: faker.internet.url(),
        short_url: `${process.env.BASE_URL}/random_id`,
      };

      await repository.create(createUrlInput);
      const createdUrl = await prisma.url.findUnique({ where: { id: 1 } });

      expect(createdUrl).toEqual({
        id: 1,
        original_url: createUrlInput.original_url,
        short_url: createUrlInput.short_url,
      });
    });
  });
});
