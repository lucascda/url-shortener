import { IsNotEmpty, MaxLength } from 'class-validator';
export class CreateUserInputDto {
  @MaxLength(70)
  @IsNotEmpty()
  name: string;

  email: string;
  password: string;
  passwordConfirmation: string;
}

export class CreateUserOutputDto {
  id: number;
  name: string;
  email: string;
}
export class CreateUserDataDto {
  name: string;
  email: string;
  password: string;
}
