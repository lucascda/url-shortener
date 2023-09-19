import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlInputDto, CreateUrlOutputDto } from './dto/create-url.dto';
import { UrlNotFoundError } from './url.errors';

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
    try {
      return await this.urlService.getByHash(hash);
    } catch (e) {
      if (e instanceof UrlNotFoundError) throw new NotFoundException();
    }
  }

  @Get(':hash/visit')
  async visitByHash(@Param('hash') hash: string) {
    try {
      return await this.urlService.incrementClick(hash);
    } catch (e) {
      if (e instanceof UrlNotFoundError) throw new NotFoundException();
    }
  }
}
