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
    describe('name field', () => {
      it('should return 422 error if name is empty', async () => {
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
        expect(response.body.message[0].error).toContain(
          'name should not be empty',
        );
      });

      it('should return 422 error if name is greater than 70 characters', async () => {
        const userPassword = faker.internet.password();
        const userData = {
          name: faker.string.fromCharacters('abc', { min: 71, max: 80 }),
          email: faker.internet.email(),
          password: userPassword,
          passwordConfirmation: userPassword,
        } as CreateUserInputDto;

        const response = await request(app.getHttpServer())
          .post('/user')
          .send(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('name');
        expect(response.body.message[0].error).toBe(
          'name must be shorter than or equal to 70 characters',
        );
      });

      it('should return 422 error if name is not a string', async () => {
        const userPassword = faker.internet.password();
        const userData = {
          // name field is now a number
          name: faker.number.int(),
          email: faker.internet.email(),
          password: userPassword,
          passwordConfirmation: userPassword,
        };

        const response = await request(app.getHttpServer())
          .post('/user')
          .send(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('name');
        expect(response.body.message[0].error).toContain(
          'name must be a string',
        );
      });
    });

    describe('email field', () => {
      it('should return 422 error if email has invalid format', async () => {
        const userPassword = faker.internet.password();
        const userData = {
          name: faker.person.fullName(),
          email: 'invalid_email',
          password: userPassword,
          passwordConfirmation: userPassword,
        };

        const response = await request(app.getHttpServer())
          .post('/user')
          .send(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('email');
        expect(response.body.message[0].error).toContain(
          'email must be an email',
        );
      });

      it('should return 422 error if email is empty', async () => {
        const userPassword = faker.internet.password();
        const userData = {
          name: faker.person.fullName(),
          password: userPassword,
          passwordConfirmation: userPassword,
        };

        const response = await request(app.getHttpServer())
          .post('/user')
          .send(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('email');
        expect(response.body.message[0].error).toContain(
          'email should not be empty',
        );
      });
    });

    describe('password field', () => {
      it('should return 422 error if password is empty', async () => {
        const userPassword = faker.internet.password();
        const userData = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          passwordConfirmation: userPassword,
        };

        const response = await request(app.getHttpServer())
          .post('/user')
          .send(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('password');
        expect(response.body.message[0].error).toContain(
          'password should not be empty',
        );
      });
    });
  });
});
