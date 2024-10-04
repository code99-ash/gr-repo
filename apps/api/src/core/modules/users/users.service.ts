import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ISchema } from 'src/common/repository';
import { CreateUser, UpdateUser, users } from './db/users.db';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createUserDto: ISchema<typeof CreateUser>) {
    return this.usersRepository.create(createUserDto);
  }

  findAll() {
    return this.usersRepository.list({
      where: eq(users.is_deleted, false),
    });
  }

  findOne(id: string) {
    return this.usersRepository.get('uid', id);
  }

  update(id: string, updateUserDto: ISchema<typeof UpdateUser>) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
