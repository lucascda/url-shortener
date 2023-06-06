import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { faker } from '@faker-js/faker';
import * as nanoid from 'nanoid';

jest.mock('nanoid', () => ({
  nanoid: () => 'random_id',
}));
describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService],
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
  });
});
