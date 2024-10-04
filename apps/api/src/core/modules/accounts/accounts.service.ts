import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { ISchema, Model } from 'src/common/repository';
import {
  BaseAccount,
  UpdateBaseAccount,
  UpdateSensitiveBaseAccount,
} from './db/accounts.db';
import {
  BasicAccount,
  CreateAdminAccount,
  CreateBasicAccount,
} from './schemas/account.schema';
import { PASSWORD_ROUNDS } from 'src/common/config/app.config';
import { AccountType } from './entities/account.entity';
import { ToggleActiveAccountState } from './dto/account.dto';

@Injectable()
export class AccountsService {
  constructor(public accountRepository: AccountsRepository) {}
  async getBaseAccount(key: 'email' | 'uid', id: string) {
    const db_account = await this.accountRepository.get(key, id);

    if (!db_account) throw new NotFoundException('User not found');
    return Model(BaseAccount, db_account);
  }

  async updateBaseAccount(
    uid: string,
    update: ISchema<typeof UpdateBaseAccount>,
  ) {
    const account = Model(UpdateBaseAccount, update);
    return await this.accountRepository.update(uid, account);
  }

  async updateSensitiveBaseAccount(
    uid: string,
    update: ISchema<typeof UpdateSensitiveBaseAccount>,
  ) {
    const user = Model(UpdateSensitiveBaseAccount, update);
    return await this.accountRepository.update(uid, user);
  }

  async getBasicAccount(key: 'email' | 'uid', id: string) {
    const base_account = await this.getBaseAccount(key, id);

    return Model(BasicAccount, base_account);
  }

  async createBasicAccount(
    createBasicAccountSchema: ISchema<typeof CreateBasicAccount>,
  ) {
    const alreadyExisting = await this.accountRepository.get(
      'email',
      createBasicAccountSchema.email,
    );
    if (alreadyExisting) throw new Error('Account with email already exists');
    let password: number | string = Math.random() * 100000000; // generate a random password to be changed later on invite
    password = password.toString();
    password = await bcrypt.hash(password, PASSWORD_ROUNDS);
    const model = Model(CreateBasicAccount, {
      ...createBasicAccountSchema,
      password,
    });
    return await this.accountRepository.create(model);
  }

  async createAdminAccount(
    createAdminAccountSchema: ISchema<typeof CreateAdminAccount>,
  ) {
    const alreadyExisting = await this.accountRepository.get(
      'email',
      createAdminAccountSchema.email,
    );
    if (alreadyExisting) throw new Error('Account with email already exists');
    let password: number | string = Math.random() * 100000000; // generate a random password to be changed later on invite
    password = password.toString();
    password = await bcrypt.hash(password, PASSWORD_ROUNDS);
    const model = Model(CreateAdminAccount, {
      ...createAdminAccountSchema,
      password,
    });
    return await this.accountRepository.create(model);
  }

  async getAllBasicUsers() {
    return await this.accountRepository.list({
      where: (users, { eq }) => eq(users.type, AccountType.USER),
    });
  }

  async countAccounts(type: AccountType) {
    return await this.accountRepository.count(type);
  }

  async toggleActiveState(
    uid: string,
    schema: ISchema<typeof ToggleActiveAccountState>,
  ) {
    return await this.updateSensitiveBaseAccount(uid, schema);
  }

  async deleteAccount(uid: string) {
    return await this.updateSensitiveBaseAccount(uid, { is_deleted: true });
  }

  async restoreAccount(uid: string) {
    return await this.updateSensitiveBaseAccount(uid, { is_deleted: true });
  }

  async updateAccount(uid: string, update: ISchema<typeof UpdateBaseAccount>) {
    const [updatedAccount] = await this.updateBaseAccount(uid, update);
    return Model(UpdateBaseAccount, updatedAccount);
  }
}
