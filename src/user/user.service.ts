import { Injectable } from '@nestjs/common';
import { CreateUserInputDto, CreateUserOutputDto } from './dto/create-user.dto';
import { PrismaUserRepository } from './prismaUser.repository';
import { UserAlreadyExistsError } from './errors/userAlreadyExists';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly repository: PrismaUserRepository) {}
  async create(
    createUserDto: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
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
    const createdUser = await this.repository.create(data);

    const responseData: CreateUserOutputDto = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    };

    return responseData;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  async find(email: string): Promise<User> {
    return new Promise((resolve) =>
      resolve({
        id: 1,
        name: 'fake_name',
        email: 'fake_email',
        password: 'fake_pass',
      }),
    );
  }
}
