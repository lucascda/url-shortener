import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaUserRepository } from './prismaUser.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaUserRepository],
  exports: [UserService],
})
export class UserModule {}
