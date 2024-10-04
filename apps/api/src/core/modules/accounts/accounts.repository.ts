import { Inject, Injectable } from '@nestjs/common';
import { count, DBQueryConfig, eq } from 'drizzle-orm';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { ORM } from 'src/common/repository';
import {
  CreateBaseAccount,
  UpdateBaseAccount,
  UpdateSensitiveBaseAccount,
  accounts,
} from './db/accounts.db';
import { AccountType } from './entities/account.entity';

@Injectable()
export class AccountsRepository {
  constructor(@Inject(DB) private db: Database) {}

  private async _get(key: 'email' | 'uid', id: string) {
    const user = await this.db.query.accounts.findFirst({
      where: eq(accounts[key], id),
    });

    return user ?? null;
  }

  async get(key: 'email' | 'uid', id: string) {
    return this._get(key, id);
  }

  async list(config: DBQueryConfig) {
    return await this.db.query.accounts.findMany(config);
  }

  async count(type: AccountType) {
    const [total] = await this.db
      .select({ count: count() })
      .from(accounts)
      .where(eq(accounts.type, type));
    return total?.count;
  }

  async create(accountSchema: ORM<typeof CreateBaseAccount>) {
    const [account] = await this.db
      .insert(accounts)
      .values(accountSchema)
      .returning({
        uid: accounts.uid,
        email: accounts.email,
        type: accounts.type,
      });
    return account;
  }

  async update(
    uid: string,
    accountSchema: ORM<
      typeof UpdateBaseAccount | typeof UpdateSensitiveBaseAccount
    >,
  ) {
    return this.db
      .update(accounts)
      .set(accountSchema)
      .where(eq(accounts.uid, uid))
      .returning();
  }
}
