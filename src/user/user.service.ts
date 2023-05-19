import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaUserRepository } from './prismaUser.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: PrismaUserRepository) {}
  create(createUserDto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userAlreadyExists = this.repository.findUnique(createUserDto.email);
  }
}
