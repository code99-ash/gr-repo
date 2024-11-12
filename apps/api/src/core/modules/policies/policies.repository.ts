import { Inject, Injectable } from '@nestjs/common';
import { and, DBQueryConfig, eq, inArray, isNull, ne, notInArray } from 'drizzle-orm';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { policies } from './db/policies.db';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { UpdatePolicyStatusDto } from './dto/update-policy-status.dto';


@Injectable()
export class PoliciesRepository {

    constructor(@Inject(DB) private db: Database) {}

    private async _get(key: keyof typeof policies._.columns, value: string | number) {
        const data = await this.db.query.policies.findFirst({
          where: and(isNull(policies.deleted_at), eq(policies[key], value)),
        });
    
        return data ?? null;
    }

    async list() {
        return await this.db.query.policies.findMany({
            where: isNull(policies.deleted_at),
            columns: {
                policy_flow: false
            }
        });
    }

    async filterFetch(filters: string[]) {
        return await this.db.query.policies.findMany({
            where: and(
                isNull(policies.deleted_at),
                ne(policies.policy_status, 'draft'),
                notInArray(policies.uid, filters),
            )
        });
    }

    async filterFetchInArray(filters: string[]) {
        return await this.db.query.policies.findMany({
            where: and(
                isNull(policies.deleted_at),
                ne(policies.policy_status, 'draft'),
                inArray(policies.uid, filters),
            )
        });
    }

    async get(key: keyof typeof policies._.columns, value: string | number) {
        return this._get(key, value);
    }

    async create(policySchema: CreatePolicyDto) {
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

    async updateStatus(uid: string, updatePolicyStatusDto: UpdatePolicyStatusDto) {
        return await this.db.update(policies)
                            .set(updatePolicyStatusDto)
                            .where(eq(policies.uid, uid))
                            .returning();
    }

    async activate(uid: string,  user_uid: string) {
        const [activated] = await this.db.update(policies).set({
            policy_status: 'active',
            activated_at: new Date(),
            activated_by: user_uid,
        })
        .where(and(
            isNull(policies.deleted_at), 
            eq(policies.uid, uid)
        ))
        .returning()

        return activated;
    }

    async softDelete(uid: string) {
        return await this.db
                    .update(policies)
                    .set({deleted_at: new Date()})
                    .where(eq(policies.uid, uid))
                    .returning();
                    
    }

}
