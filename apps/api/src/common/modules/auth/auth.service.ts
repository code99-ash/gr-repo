import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { ORM } from 'src/common/repository/index';
import { InviteUserJWTTokenPayload, JWTPayload } from './auth.interface';
import { Model } from 'src/common/repository/index';
import { createId } from '@paralleldrive/cuid2';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './auth.dto';
import { PASSWORD_ROUNDS } from 'src/common/config/app.config';
import { AccountsService } from 'src/core/modules/accounts/accounts.service';
import { BasicAccount } from 'src/core/modules/accounts/entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  async validateAccountCredentials(email: string, password: string) {
    const account = await this.accountsService.getBaseAccount('email', email);

    const result = bcrypt.compare(password, account.password);

    if (!result) return null;

    return Model(BasicAccount, account);
  }

  async verifyAccountToken(uid: string) {
    const account = await this.accountsService.getBaseAccount('uid', uid);

    if (!account) return null;

    return Model(BasicAccount, account);
  }

  async login(account: ORM<typeof BasicAccount>) {
    const payload: JWTPayload = {
      username: '',
      sub: account.uid,
      type: account.type,
      permissions: account.permissions,
    };

    payload.username = account.email;

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    throw new Error(`Method not implemented, ${email}`);
    // const account = await this.accountsService.getBaseAccount('email', email);

    // if (!account) throw new NotFoundException('Account not found');

    // const { invite_token } = await this.generateAccountJWTToken(email);
    // const invite_link = `${this.configService.get<string>(
    //   'ADMIN_BASE_URL',
    // )}/reset-password?token=${invite_token}`;

    // // send notifications event
    // await this.eventEmitter.emitAsync(
    //   EventEmittions.auth.forgot_password,
    //   Model(ForgotPasswordEventPayload, {
    //     email: account.email,
    //     invite_link,
    //     recipient_name: account.first_name,
    //   }),
    // );

    // return true;
  }

  async resetPassword(data: ResetPasswordDto & { email: string }) {
    const account = await this.accountsService.getBaseAccount(
      'email',
      data.email,
    );

    if (!account) throw new NotFoundException('Account not found');

    const hashed_password = await bcrypt.hash(data.password, PASSWORD_ROUNDS);

    await this.accountsService.updateSensitiveBaseAccount(account.uid, {
      password: hashed_password,
    });

    return true;
  }

  async generateAccountJWTToken(email: string) {
    // TODO: store the invite_secret within the DB and verify it exists when it is used
    const invite_secret = createId();
    const payload: InviteUserJWTTokenPayload = {
      invite_secret,
      email,
    };

    return {
      invite_token: this.jwtService.sign(payload),
    };
  }

  async validateAccountJWTToken(token: string) {
    const decodedToken =
      this.jwtService.decode<InviteUserJWTTokenPayload>(token);

    return decodedToken;
  }
}
