import { type BullModuleOptions } from '@nestjs/bull';

export enum Queues {
  PAYMENT_WEBHOOKS = 'payment_webhooks',
}

export const QueuesRegister = [
  {
    name: Queues.PAYMENT_WEBHOOKS,
  },
] as Array<BullModuleOptions>;

export const QueueProcesses = {
  payment_webhooks: {
    verify_transaction: 'verify_transaction',
    verify_transfer: 'verify_transfer',
  },
} satisfies Record<Queues, Record<string, string>>;
