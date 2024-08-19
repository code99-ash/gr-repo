import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { QueuesRegister } from 'src/common/db/queues';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        // host: env.REDIS_HOST,
        // port: env.REDIS_PORT,
        // password: env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue(...QueuesRegister),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature(
      ...QueuesRegister.map((queue) => ({
        name: queue.name!,
        adapter: BullAdapter,
      })),
    ),
  ],
})
export class AppModule {}
