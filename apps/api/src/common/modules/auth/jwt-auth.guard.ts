import {
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from './permissions.service';
import { Account } from '../../../core/modules/accounts/entities/account.entity';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  permissions: Array<string> = [];
  constructor(@Inject(Reflector) private reflector: Reflector) {
    super();
  }

  static hasPermissions(
    perms: string[] | Permission[] | undefined,
    current_account: Account,
  ): true {
    if (!perms) {
      throw new InternalServerErrorException(
        'Permissions not set for resource',
      );
    }

    const allowed: boolean[] = [];
    for (const perm of perms) {
      const permission =
        typeof perm === 'string' ? Permission.parse(perm) : perm;

      const hasPermission = Permission.hasPermission(
        permission,
        current_account,
      );

      if (hasPermission) {
        allowed.push(true);
      } else {
        throw new UnauthorizedException();
      }
    }

    if (allowed.every((allow) => allow)) {
      return true;
    }
    throw new UnauthorizedException();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    const sup = super.canActivate(context);

    const permissions = this.reflector.get<Array<string>>(
      'permissions',
      context.getHandler(),
    );
    this.permissions = permissions;
    return sup;
  }

  handleRequest(err: any, account: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !account) {
      throw err || new UnauthorizedException();
    }

    JWTAuthGuard.hasPermissions(this.permissions, account as Account);

    return account;
  }
}
