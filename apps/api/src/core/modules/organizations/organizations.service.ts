import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsRepository } from './organization.repository';
import { eq } from 'drizzle-orm';
import { organizations } from './db/organizations.db';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsRepository.create(createOrganizationDto);
  }

  findAll() {
    return this.organizationsRepository.list({
      where: eq(organizations.is_deleted, false),
    });
  }

  findOne(uid: string) {
    return this.organizationsRepository.get('uid', uid);
  }

  update(uid: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsRepository.update(uid, updateOrganizationDto);
  }

  remove(uid: string) {
    return this.organizationsRepository.delete(uid);
  }
}
