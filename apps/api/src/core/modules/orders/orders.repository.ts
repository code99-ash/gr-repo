import { Inject, Injectable } from '@nestjs/common';
import { DBQueryConfig, eq } from 'drizzle-orm';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { ORM } from 'src/common/repository';
import { orders } from './db/orders.db';
import { CreateBaseOrder, UpdateBaseOrder } from './schemas/orders.schema';

@Injectable()
export class OrdersRepository {
  constructor(@Inject(DB) private db: Database) {}

  private async _get(key: 'id' | 'uid', id: string) {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders[key], id),
    });

    return order;
  }

  async get(key: 'id' | 'uid', id: string) {
    return await this._get(key, id);
  }

  async list(config: DBQueryConfig) {
    return await this.db.query.orders.findMany(config);
  }

  async create(orderSchema: ORM<typeof CreateBaseOrder>) {
    return await this.db.insert(orders).values(orderSchema).returning();
  }

  async update(uid: string, orderSchema: ORM<typeof UpdateBaseOrder>) {
    return this.db
      .update(orders)
      .set(orderSchema)
      .where(eq(orders.uid, uid))
      .returning();
  }
}
