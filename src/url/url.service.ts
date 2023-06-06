import { Injectable } from '@nestjs/common';
import { CreateUrlInputDto } from './dto/create-url.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  async create(createUrlDto: CreateUrlInputDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { original_url } = createUrlDto;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const random_id = nanoid();
  }
}
