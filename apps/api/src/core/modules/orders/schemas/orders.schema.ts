import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { OrderMeta, orders } from 'src/common/db/schemas';

export const BaseOrder = createSelectSchema(orders, {
  meta: OrderMeta,
});

export const CreateBaseOrder = createInsertSchema(orders, {
  meta: OrderMeta,
});

export const UpdateBaseOrder = BaseOrder.omit({ id: true, uid: true });
