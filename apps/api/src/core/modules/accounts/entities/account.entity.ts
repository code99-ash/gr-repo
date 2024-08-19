import { createSelectSchema } from 'drizzle-zod';
import { accounts } from '../db/accounts.db';
import { Permissions } from '../db/accounts.db';
import { z } from 'zod';
import { ORM } from 'src/common/repository';
import { BaseAccount, CreateBaseAccount } from '../db/accounts.db';
import { AccountType } from '../schemas/account.schemas';

export type BaseAccount = ORM<typeof BaseAccount>;

export const BasicAccount = BaseAccount.extend({
  type: z.enum([AccountType.USER]).default(AccountType.USER),
}).omit({ password: true });

export const CreateBasicAccount = CreateBaseAccount.extend({
  type: z.enum([AccountType.USER]).default(AccountType.USER),
  email: z.string(),
});

const Account = createSelectSchema(accounts, {
  permissions: Permissions,
});

export type Account = z.infer<typeof Account>;
