import { Injectable } from '@nestjs/common';
import { SignInUserInputDto } from './dto/signInUser.dto';
import { UserService } from 'src/user/user.service';
import { UnauthorizedError } from './errors/unauthorizedError';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInUserDto: SignInUserInputDto) {
    const userAlreadyExists = await this.userService.find(signInUserDto.email);
    if (!userAlreadyExists) {
      throw new UnauthorizedError();
    }

    const matchPassword = await bcrypt.compare(
      signInUserDto.password,
      userAlreadyExists.password,
    );
    if (!matchPassword) {
      throw new UnauthorizedError();
    }

    const payload = {
      sub: userAlreadyExists.id,
      email: userAlreadyExists.email,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
