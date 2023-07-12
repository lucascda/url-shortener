import {
  INestApplication,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';

describe('UrlController e2e tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const urlRoute = '/urls';

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

  describe('Url Validation', () => {
    describe('original_url field', () => {
      it.skip("it should return 422 error if it's empty", async () => {
        const createUrlInput = {
          original_url: '',
        };

        const response = await request(app.getHttpServer())
          .post(urlRoute)
          .send(createUrlInput);

        expect(response.status).toBe(422);
        expect(response.body.message).toBe(
          '[{"error": "original_url should not be empty", "field": "original_url"}]',
        );
      });
    });
  });
});
