import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async cleanDatabase() {
    await this.user.deleteMany();
    await this.url.deleteMany();
  }

  async resetAutoIncrement() {
    await this.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART`;
    await this.$executeRaw`ALTER SEQUENCE "Url_id_seq" RESTART`;
  }
}
