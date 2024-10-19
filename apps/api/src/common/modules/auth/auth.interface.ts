import { AccountType } from '../../../core/modules/accounts/entities/account.entity';

export interface JWTPayload {
  username: string;
  sub: string;
  type: AccountType;
  permissions: Array<string>;
  organization_uid: string;
}

export interface InviteUserJWTTokenPayload {
  email: string;
  invite_secret: string;
}
