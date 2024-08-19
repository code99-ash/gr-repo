import { Routes } from '@nestjs/core';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from 'src/core/modules/users/users.module';

export const routes = [
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'user',
    module: UsersModule,
  },
] satisfies Routes;
