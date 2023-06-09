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
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserInput } from 'src/test/stubs/user-stub';

const userRoute = '/users';

describe('User Controller e2e Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const makePostRequest = async (userData): Promise<request.Response> => {
    return await request(app.getHttpServer()).post(userRoute).send(userData);
  };

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
        const userData = { ...createUserInput, name: undefined };

        const response = await makePostRequest(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('name');
        expect(response.body.message[0].error).toContain(
          'name should not be empty',
        );
      });

      it('should return 422 error if name is greater than 70 characters', async () => {
        const userData = {
          ...createUserInput,
          name: faker.string.fromCharacters('abc', { min: 71, max: 80 }),
        };

        const response = await makePostRequest(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('name');
        expect(response.body.message[0].error).toBe(
          'name must be shorter than or equal to 70 characters',
        );
      });

      it('should return 422 error if name is not a string', async () => {
        const userData = {
          ...createUserInput,
          // name field is now a number
          name: faker.number.int(),
        };

        const response = await makePostRequest(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('name');
        expect(response.body.message[0].error).toContain(
          'name must be a string',
        );
      });
    });

    describe('email field', () => {
      it('should return 422 error if email has invalid format', async () => {
        const userData = {
          ...createUserInput,
          email: 'invalid_email',
        };

        const response = await makePostRequest(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('email');
        expect(response.body.message[0].error).toContain(
          'email must be an email',
        );
      });

      it('should return 422 error if email is empty', async () => {
        const userData = {
          ...createUserInput,
          email: undefined,
        };

        const response = await makePostRequest(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('email');
        expect(response.body.message[0].error).toContain(
          'email should not be empty',
        );
      });
    });

    describe('password field', () => {
      it('should return 422 error if password is empty', async () => {
        const userData = { ...createUserInput, password: undefined };

        const response = await makePostRequest(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('password');
        expect(response.body.message[0].error).toContain(
          'password should not be empty',
        );
      });

      it('should return 422 error if password is not strong enough', async () => {
        const userPassword = 'weak_pass';
        const userData = {
          ...createUserInput,
          password: userPassword,
          passwordConfirmation: userPassword,
        };

        const response = await makePostRequest(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('password');
        expect(response.body.message[0].error).toContain(
          'password is not strong enough',
        );
      });

      it('should return 422 error if password is greater than 64 characters', async () => {
        const userPassword = faker.internet.password({ length: 65 });
        const userData = {
          ...createUserInput,
          password: userPassword,
          passwordConfirmation: userPassword,
        };

        const response = await makePostRequest(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('password');
        expect(response.body.message[0].error).toContain(
          'password must be shorter than or equal to 64 characters',
        );
      });
    });

    describe('passwordConfirmation field', () => {
      it('should return 422 error if passwordConfirmation doesnt match with password', async () => {
        const userPassword = '@Strong_pass1';
        const userData = {
          ...createUserInput,
          password: userPassword,
          passwordConfirmation: faker.internet.password(),
        };

        const response = await makePostRequest(userData);

        expect(response.status).toBe(422);
        expect(response.body.message[0].field).toBe('passwordConfirmation');
        expect(response.body.message[0].error).toContain(
          'passwordConfirmation must match password',
        );
      });
    });
  });
});
