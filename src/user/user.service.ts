import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaUserRepository } from './prismaUser.repository';
import { UserAlreadyExistsError } from './errors/userAlreadyExists';

@Injectable()
export class UserService {
  constructor(private readonly repository: PrismaUserRepository) {}
  async create(createUserDto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userAlreadyExists = await this.repository.findUnique(
      createUserDto.email,
    );

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError();
    }
  }
}
