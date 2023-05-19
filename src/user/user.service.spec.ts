import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.create', () => {
    it('should call itself with correct params', async () => {
      const createUserInput = {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      };
      const createSpy = jest.spyOn(service, 'create');

      await service.create(createUserInput);

      expect(createSpy).toHaveBeenCalledWith(createUserInput);
    });
  });
});
