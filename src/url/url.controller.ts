import { Controller } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlInputDto, CreateUrlOutputDto } from './dto/create-url.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  async create(
    createUrlInputDto: CreateUrlInputDto,
  ): Promise<CreateUrlOutputDto> {
    return await this.urlService.create(createUrlInputDto);
  }
}
