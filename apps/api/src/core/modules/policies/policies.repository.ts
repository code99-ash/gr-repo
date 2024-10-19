import { Inject, Injectable } from '@nestjs/common';
import { DBQueryConfig, eq } from 'drizzle-orm';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { policies } from './db/policies.db';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';


@Injectable()
export class PoliciesRepository {

    constructor(@Inject(DB) private db: Database) {}

    private async _get(key: 'id' | 'uid', id: string | number) {
        const user = await this.db.query.policies.findFirst({
          where: eq(policies[key], id),
        });
    
        return user ?? null;
    }

    async list(config: DBQueryConfig) {
        return await this.db.query.policies.findMany(config);
    }

    async get(key: 'id' | 'uid', id: string | number) {
        return this._get(key, id);
    }

    async create(policySchema: CreatePolicyDto) {
        const [policy] = await this.db.insert(policies)
                                    .values(policySchema)
                                    .returning();
    
        return policy;
    }
    

    async update(id: number, policySchema: UpdatePolicyDto) {
        
        const [updatedPolicy] = await this.db.update(policies)
                                            .set(policySchema)
                                            .where(eq(policies.id, id))
                                            .returning();

        return updatedPolicy;
    }

    async deleteAnyway(key: 'uid'|'id', id: string | number) {
        return await this.db.delete(policies)
                        .where(eq(policies[key], id));
    }

    async setAsDeleted(key: 'uid'|'id', id: string | number) {
        return this.db
                    .update(policies)
                    .set({deleted_at: new Date()})
                    .where(eq(policies[key], id))
    } 

}
