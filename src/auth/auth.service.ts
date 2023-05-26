import { Injectable } from '@nestjs/common';
import { SignInUserInputDto } from './dto/signInUser.dto';
import { UserService } from 'src/user/user.service';
import { UnauthorizedError } from './errors/unauthorizedError';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async auth(signInUserDto: SignInUserInputDto) {
    const userAlreadyExists = this.userService.find(signInUserDto.email);
    if (!userAlreadyExists) {
      throw new UnauthorizedError();
    }
  }
}
