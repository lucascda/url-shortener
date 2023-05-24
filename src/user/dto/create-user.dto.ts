import {
  IsNotEmpty,
  MaxLength,
  IsString,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';
export class CreateUserInputDto {
  @MaxLength(70)
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @MaxLength(64)
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
