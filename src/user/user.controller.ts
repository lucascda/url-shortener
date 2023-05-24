import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserInputDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserInputDto) {
    try {
      return this.userService.create(createUserDto);
    } catch (e) {
      throw e;
    }
  }
}
