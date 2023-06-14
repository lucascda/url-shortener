import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { PrismaUrlRepository } from './prismaUrl.repository';
import { CreateUrlInputDto } from './dto/create-url.dto';
import { faker } from '@faker-js/faker';

describe('UrlController', () => {
  let controller: UrlController;

  const baseURL = process.env.BASE_URL;
  const urlRepositoryMock = {};
  const urlServiceMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        { provide: UrlService, useValue: urlServiceMock },
        { provide: PrismaUrlRepository, useValue: urlRepositoryMock },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new url with correct data', async () => {
    const createUrlInput: CreateUrlInputDto = {
      original_url: faker.internet.url(),
    };
    const serviceSpy = jest.spyOn(urlServiceMock, 'create').mockResolvedValue({
      id: 1,
      original_url: createUrlInput.original_url,
      short_url: `${baseURL}/random_id`,
    });

    const createdUrl = await controller.create(createUrlInput);

    expect(serviceSpy).toBeCalledWith(createUrlInput);
    expect(createdUrl).toEqual({
      id: 1,
      original_url: createUrlInput.original_url,
      short_url: `${baseURL}/random_id`,
    });
  });
});
