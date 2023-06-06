import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { faker } from '@faker-js/faker';
import * as nanoid from 'nanoid';
import { PrismaUrlRepository } from './prismaUrl.repository';

jest.mock('nanoid', () => ({
  nanoid: () => 'random_id',
}));
describe('UrlService', () => {
  let service: UrlService;

  const base_url = process.env.BASE_URL;

  const urlRepositoryMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: PrismaUrlRepository, useValue: urlRepositoryMock },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating a new url', () => {
    it('it should create a new random id', async () => {
      const createUrlInput = {
        original_url: faker.internet.url(),
      };
      const nanoidSpy = jest.spyOn(nanoid, 'nanoid');

      await service.create(createUrlInput);

      expect(nanoidSpy).toHaveBeenCalled();
      expect(nanoidSpy).toReturnWith('random_id');
    });

    it('should create a new shorten url', async () => {
      const createUrlInput = {
        original_url: faker.internet.url(),
      };
      jest.spyOn(urlRepositoryMock, 'create').mockReturnValue({
        id: 1,
        original_url: createUrlInput.original_url,
        short_url: `${base_url}/random_id`,
      });

      const createdUrl = await service.create(createUrlInput);

      expect(createdUrl).toEqual({
        id: expect.any(Number),
        original_url: createUrlInput.original_url,
        short_url: `${base_url}/random_id`,
      });
    });
  });
});
