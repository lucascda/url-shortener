import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaUrlRepository } from 'src/url/prismaUrl.repository';
import { UrlService } from 'src/url/url.service';

describe('UrlService Integration Tests', () => {
  let service: UrlService;
  let prisma: PrismaService;

  const baseUrl = process.env.BASE_URL;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService, PrismaUrlRepository],
      imports: [PrismaModule],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<UrlService>(UrlService);

    await prisma.cleanDatabase();
    await prisma.resetAutoIncrement();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('#create', () => {
    const createUrlInput = {
      original_url: faker.internet.url(),
    };

    it('creates new url and return correct response', async () => {
      const createdUrl = await service.create(createUrlInput);

      expect(createdUrl).toEqual({
        id: 1,
        original_url: createUrlInput.original_url,
        short_url: expect.any(String),
      });
      expect(createdUrl.short_url).toContain(baseUrl);
    });
  });
});
