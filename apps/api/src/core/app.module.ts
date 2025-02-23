import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DbModule } from 'src/common/db/db.module';
import { getAllRouteModules } from 'src/common/routes/routes.util';
import { routes } from 'src/common/routes/routes';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ...getAllRouteModules(routes, []),
    ConfigModule.forRoot(),
    RouterModule.register(routes),
    EventEmitterModule.forRoot(),
    // BullModule.forRoot({
    //   redis: {
    //     host: env.REDIS_HOST,
    //     port: env.REDIS_PORT,
    //     password: env.REDIS_PASSWORD,
    //   },
    // }),
    // BullModule.registerQueue(...QueuesRegister),
    // MailerModule.forRootAsync({
    //   useClass: MailService,
    //   inject: [MailService],
    // }),
    DbModule,
    OrdersModule,
  ],
})
export class AppModule {}
