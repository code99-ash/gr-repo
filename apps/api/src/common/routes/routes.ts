import { Routes } from '@nestjs/core';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from 'src/core/modules/users/users.module';
import { OrdersModule } from 'src/core/modules/orders/orders.module';
import { PoliciesModule } from 'src/core/modules/policies/policies.module';
import { StoresModule } from 'src/core/modules/stores/stores.module';

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
  {
    path: '',
    module: PoliciesModule,
  },
  {
    path: '',
    module: StoresModule,
  },
] satisfies Routes;
