import { createId } from '@paralleldrive/cuid2';
import {
  text,
  varchar,
  timestamp,
  jsonb,
  pgTable,
  pgEnum,
  serial,
} from 'drizzle-orm/pg-core';
import { customers } from '../../customers/db/customers.db';
import { ReturnRequestStatus } from '../return_requests.schemas';

export const return_request_statuses = pgEnum('return_request_statuses', [
  ReturnRequestStatus.SUBMITTED,
  ReturnRequestStatus.IN_REVIEW,
  ReturnRequestStatus.APPROVED,
  ReturnRequestStatus.REJECTED,
  ReturnRequestStatus.PICKED_UP,
  ReturnRequestStatus.COMPLETED,
]);

export const return_requests = pgTable('return_requests', {
  id: serial('id').primaryKey(),
  uid: varchar('uid', { length: 256 }).$default(createId).unique().notNull(),
  customer_uid: text('customer_uid').references(() => customers.uid),
  status: return_request_statuses('status').default(
    ReturnRequestStatus.SUBMITTED,
  ),
  meta: jsonb('meta').default({}),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
});
