import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserInputDto } from './dto/signInUser.dto';
import { UnauthorizedError } from './errors/unauthorizedError';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async signIn(@Body() signInDto: SignInUserInputDto) {
    try {
      return await this.authService.signIn(signInDto);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        throw new UnauthorizedException();
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
