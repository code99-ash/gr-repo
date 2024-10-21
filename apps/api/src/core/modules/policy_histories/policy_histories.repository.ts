import { Inject, Injectable } from '@nestjs/common';
import { DBQueryConfig, eq } from 'drizzle-orm';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { policy_histories } from './db/policy_histories.db';
import { CreatePolicyHistoryDto } from './dto/create-policy-history.dto';


@Injectable()
export class PolicyHistoryRepository {

    constructor(@Inject(DB) private db: Database) {}

    private async _get(key: keyof typeof policy_histories._.columns, value: string|number) {
        const user = await this.db.query.policy_histories.findFirst({
          where: eq(policy_histories[key], value),
        });
    
        return user ?? null;
    }

    async list(config: DBQueryConfig) {
        return await this.db.query.policy_histories.findMany(config);
    }

    async get(key: keyof typeof policy_histories._.columns, value: string | number) {
        return this._get(key, value);
    }

    async create(createHistoryDto: CreatePolicyHistoryDto) {
        const [policy] = await this.db.insert(policy_histories)
                                    .values(createHistoryDto)
                                    .returning();
    
        return policy;
    }
}
