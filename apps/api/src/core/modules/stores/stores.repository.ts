import { Inject, Injectable } from '@nestjs/common';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { CreateStoreDto } from './dto/create-store.dto';
import { stores } from './db/stores.db';
import { eq } from 'drizzle-orm';

@Injectable()
export class StoresRepository {
  constructor(@Inject(DB) private db: Database) {}

  async findStore(key: keyof typeof stores._.columns, value: string) {
    const store = await this.db.query.stores.findFirst({
      where: eq(stores[key], value)
    });

    return store ?? null;
  }

  async createStore(store: CreateStoreDto) {
    return await this.db.insert(stores).values(store).returning();
  }
  
}
