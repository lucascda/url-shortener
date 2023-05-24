import { IsNotEmpty, MaxLength, IsString, IsEmail } from 'class-validator';
export class CreateUserInputDto {
  @MaxLength(70)
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
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
