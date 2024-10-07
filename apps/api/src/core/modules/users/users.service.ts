import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ISchema, Model, ORM } from 'src/common/repository';
import { CreateUser, SafeBaseUser, UpdateUser, users } from './db/users.db';
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

  async findOne(id: string) {
    const user = await this.usersRepository.get('uid', id);
    return Model(SafeBaseUser, user as ORM<typeof SafeBaseUser>);
  }

  update(id: string, updateUserDto: ISchema<typeof UpdateUser>) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
