import {
  INestApplication,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { CreateUserInputDto } from 'src/user/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

describe('User Controller e2e Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new UnprocessableEntityException(
            validationErrors.map((error) => ({
              field: error.property,
              error: Object.values(error.constraints).join(', '),
            })),
          );
        },
      }),
    );
    await app.init();

    await prisma.cleanDatabase();
    await prisma.resetAutoIncrement();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('User Validation', () => {
    it('should return error if name is empty', async () => {
      const userPassword = faker.internet.password();
      const userData = {
        email: faker.internet.email(),
        password: userPassword,
        passwordConfirmation: userPassword,
      } as CreateUserInputDto;

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(userData);

      expect(response.status).toBe(422);
      expect(response.body.message[0].field).toBe('name');
      expect(response.body.message[0].error).toBe('name should not be empty');
    });
  });
});
