import { Body, Controller, Post, Get, Param } from '@nestjs/common';
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

  @Get(':hash')
  async getByHash(@Param('hash') hash: string) {
    return await this.urlService.getByHash(hash);
  }
}
