import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaUserRepository } from './prismaUser.repository';
import { UserAlreadyExistsError } from './errors/userAlreadyExists';
import * as bcrypt from 'bcrypt';

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

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const data = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    };
    await this.repository.create(data);
  }
}
