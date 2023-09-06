import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUrlData } from './dto/create-url.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUrlData) {
    return this.prisma.url.create({ data });
  }

  async getByHash(hash: string) {
    return this.prisma.url.findFirst({ where: { hash } });
  }
}
