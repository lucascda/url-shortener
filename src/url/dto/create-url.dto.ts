export class CreateUrlInputDto {
  original_url: string;
}

export class CreateUrlOutputDto {
  id: number;
  original_url: string;
  short_url: string;
}
export class CreateUrlData {
  original_url: string;
  short_url: string;
}
