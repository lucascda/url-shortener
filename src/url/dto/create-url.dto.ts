import { IsNotEmpty } from 'class-validator';

export class CreateUrlInputDto {
  @IsNotEmpty()
  original_url: string;
}

export class CreateUrlOutputDto {
  id: number;
  original_url: string;
  hash: string;
}
export class CreateUrlData {
  original_url: string;
  hash: string;
}
