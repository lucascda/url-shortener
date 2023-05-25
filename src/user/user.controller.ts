import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { CreateUserInputDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserAlreadyExistsError } from './errors/userAlreadyExists';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserInputDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (e) {
      if (e instanceof UserAlreadyExistsError) {
        throw new ConflictException(e.message);
      }
    }
  }
}
