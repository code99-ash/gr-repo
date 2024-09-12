import { Routes } from '@nestjs/core';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from 'src/core/modules/users/users.module';
import { OrdersModule } from 'src/core/modules/orders/orders.module';

export const routes = [
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'users',
    module: UsersModule,
  },
  {
    path: 'orders',
    module: OrdersModule,
  },
] satisfies Routes;
