import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInputDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserInputDto) {
    return this.userService.create(createUserDto);
  }
}
