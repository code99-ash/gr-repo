import { AccountType } from '../../../core/modules/accounts/schemas/account.schemas';

export interface JWTPayload {
  username: string;
  sub: string;
  type: AccountType;
  permissions: Array<string>;
}

export interface InviteUserJWTTokenPayload {
  email: string;
  invite_secret: string;
}
