import { Injectable } from '@nestjs/common';
import { CreateUrlInputDto, CreateUrlOutputDto } from './dto/create-url.dto';
import { nanoid } from 'nanoid';
import { PrismaUrlRepository } from './prismaUrl.repository';

@Injectable()
export class UrlService {
  constructor(private readonly repository: PrismaUrlRepository) {}

  async create(createUrlDto: CreateUrlInputDto): Promise<CreateUrlOutputDto> {
    const { original_url } = createUrlDto;
    const random_id = nanoid();
    const short_url = `${process.env.BASE_URL}/${random_id}`;
    const data = {
      original_url,
      short_url,
    };
    return await this.repository.create(data);
  }
}
