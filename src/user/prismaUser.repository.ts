import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
