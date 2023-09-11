import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUrlData } from './dto/create-url.dto';
import { Injectable } from '@nestjs/common';
import { UrlNotFoundError } from './url.errors';

@Injectable()
export class PrismaUrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUrlData) {
    return this.prisma.url.create({ data });
  }

  async getByHash(hash: string) {
    const url = await this.prisma.url.findFirst({ where: { hash } });
    if (!url) throw new UrlNotFoundError();
    return url;
  }
}
