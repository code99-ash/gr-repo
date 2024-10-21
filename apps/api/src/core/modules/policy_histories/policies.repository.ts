import { Inject, Injectable } from '@nestjs/common';
import { DBQueryConfig, eq } from 'drizzle-orm';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { policies } from './db/policy_histories.db';
import { CreatePolicyDto, UnprocessedPolicyCreateDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { ActivatePolicyDto } from './dto/activate-policy.dto';
import { FlowRecordDto } from './dto/policy-flow.dto';


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

    async saveAs(policySchema: CreatePolicyDto) {
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

    async activate(
        id: number, 
        activateSchema: ActivatePolicyDto, 
        current_flow: FlowRecordDto, 
        user_id: string
    ) {
     
        const [activated] = await this.db.update(policies).set({
            status: activateSchema.status,
            activated_at: new Date(),
            activated_by: user_id,
            current_flow: { ...current_flow, activated_by: user_id }
        })
        .where(eq(policies.id, id))
        .returning()

        return activated;
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
