import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { PrismaUrlRepository } from './prismaUrl.repository';

@Module({
  controllers: [UrlController],
  providers: [UrlService, PrismaUrlRepository],
})
export class UrlModule {}
