import { Inject, Injectable } from '@nestjs/common';
import { DBQueryConfig, eq } from 'drizzle-orm';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { ORM } from 'src/common/repository';
import { CreateUser, UpdateUser, users } from './db/users.db';

@Injectable()
export class UsersRepository {
  constructor(@Inject(DB) private db: Database) {}

  private async _get(key: 'uid', id: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users[key], id),
    });

    return user ?? null;
  }

  async get(key: 'uid', id: string) {
    return this._get(key, id);
  }

  async list(config: DBQueryConfig) {
    return await this.db.query.users.findMany(config);
  }

  async create(userSchema: ORM<typeof CreateUser>) {
    return this.db.insert(users).values(userSchema).returning();
  }

  async update(uid: string, userSchema: ORM<typeof UpdateUser>) {
    return this.db
      .update(users)
      .set(userSchema)
      .where(eq(users.uid, uid))
      .returning();
  }

  async delete(uid: string) {
    return this.db
      .update(users)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(users.uid, uid));
  }
}
