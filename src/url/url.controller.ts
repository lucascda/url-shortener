import { Body, Controller, Post } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlInputDto, CreateUrlOutputDto } from './dto/create-url.dto';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async create(
    @Body() createUrlInputDto: CreateUrlInputDto,
  ): Promise<CreateUrlOutputDto> {
    return await this.urlService.create(createUrlInputDto);
  }
}
