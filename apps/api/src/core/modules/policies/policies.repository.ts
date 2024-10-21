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

    private async _get(key: keyof typeof policies._.columns, value: string | number) {
        const user = await this.db.query.policies.findFirst({
          where: eq(policies[key], value),
        });
    
        return user ?? null;
    }

    async list(config: DBQueryConfig) {
        return await this.db.query.policies.findMany(config);
    }

    async get(key: keyof typeof policies._.columns, value: string | number) {
        return this._get(key, value);
    }

    async saveAs(policySchema: CreatePolicyDto) {
        const [policy] = await this.db.insert(policies)
                                    .values(policySchema)
                                    .returning();
    
        return policy;
    }

    async update(uid: string, policySchema: UpdatePolicyDto) {
        
        const [updatedPolicy] = await this.db.update(policies)
                                            .set(policySchema)
                                            .where(eq(policies.uid, uid))
                                            .returning();

        return updatedPolicy;
    }

    async activate(uid: string,  user_id: string) {
        const [activated] = await this.db.update(policies).set({
            status: 'active',
            activated_at: new Date(),
            activated_by: user_id,
        })
        .where(eq(policies.uid, uid))
        .returning()

        return activated;
    }

    async deleteAnyway(uid: string) {
        return await this.db.delete(policies)
                        .where(eq(policies.uid, uid));
    }

    async setAsDeleted(uid: string) {
        return this.db
                    .update(policies)
                    .set({deleted_at: new Date()})
                    .where(eq(policies.uid, uid))
    }

}
