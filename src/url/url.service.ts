import { Injectable } from '@nestjs/common';
import { CreateUrlInputDto, CreateUrlOutputDto } from './dto/create-url.dto';
import { nanoid } from 'nanoid';
import { PrismaUrlRepository } from './prismaUrl.repository';

@Injectable()
export class UrlService {
  constructor(private readonly repository: PrismaUrlRepository) {}

  async create(createUrlDto: CreateUrlInputDto): Promise<CreateUrlOutputDto> {
    const { original_url } = createUrlDto;
    const hash = nanoid();

    const data = {
      original_url,
      hash,
    };
    return await this.repository.create(data);
  }

  async getByHash(hash: string) {
    const url = await this.repository.getByHash(hash);

    return { original_url: url.original_url };
  }
}
