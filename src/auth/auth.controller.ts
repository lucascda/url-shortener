import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserInputDto } from './dto/signInUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  signIn(@Body() signInDto: SignInUserInputDto) {
    return this.authService.signIn(signInDto);
  }
}
