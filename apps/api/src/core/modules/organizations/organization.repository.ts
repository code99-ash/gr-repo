import { Inject, Injectable } from '@nestjs/common';
import { DBQueryConfig, eq } from 'drizzle-orm';
import { type Database } from 'src/common/db/db.types';
import { DB } from 'src/common/db/drizzle.provider';
import { ORM } from 'src/common/repository';
import {
  CreateOrganization,
  organizations,
  UpdateOrganization,
} from './db/organizations.db';

@Injectable()
export class OrganizationsRepository {
  constructor(@Inject(DB) private db: Database) {}

  private async _get(key: 'uid', id: string) {
    const organization = await this.db.query.organizations.findFirst({
      where: eq(organizations[key], id),
    });

    return organization ?? null;
  }

  async get(key: 'uid', id: string) {
    return this._get(key, id);
  }

  async list(config: DBQueryConfig) {
    return await this.db.query.organizations.findMany(config);
  }

  async create(organizationSchema: ORM<typeof CreateOrganization>) {
    const [organization] = await this.db
      .insert(organizations)
      .values(organizationSchema)
      .returning({
        uid: organizations.uid,
        name: organizations.name,
      });
    return organization;
  }

  async update(
    uid: string,
    organizationSchema: ORM<typeof UpdateOrganization>,
  ) {
    return this.db
      .update(organizations)
      .set(organizationSchema)
      .where(eq(organizations.uid, uid))
      .returning();
  }

  async delete(uid: string) {
    return this.db
      .update(organizations)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(organizations.uid, uid));
  }
}
