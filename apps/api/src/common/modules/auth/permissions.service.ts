import * as micromatch from 'micromatch';

import { Domains, Resources, Actions } from './permissions.interface';
import { Account } from '../../../core/modules/accounts/entities/account.entity';

export class Permission {
  domain: Domains;
  domain_id: string;
  resource: Resources;
  action: Actions;

  constructor(
    domain: Domains,
    domain_id: string,
    resource: Resources,
    action: Actions,
  ) {
    this.domain = domain;
    this.domain_id = domain_id;
    this.resource = resource;
    this.action = action;
  }

  static parse(permission: string): Permission {
    if (permission.trim() === '*') {
      return new Permission(Domains.ALL, '*', Resources.ALL, Actions.ALL);
    }

    if (!permission.includes(':')) {
      const message = `Incorrect permission format: ${permission}, permission has to be "*" or contain one or more ":"`;
      console.warn(message);
      throw new Error(message);
    }

    const elements = permission.split(':');
    if (elements.length < 4) {
      const difference = 4 - elements.length;
      for (let i = 0; i < difference; i++) {
        elements.push('*');
      }
    }

    const [domain, domain_id, resource, action] = elements;
    return new Permission(
      domain as Domains,
      domain_id,
      resource as Resources,
      action as Actions,
    );
  }

  toString(): string {
    return `${this.domain}:${this.domain_id}:${this.resource}:${this.action}`;
  }

  equals(pattern: Permission): boolean {
    /**
     * Role comparison is one way - this does not check for true equality
     * in this case it's possible that a == b is true, but b == a is false at the same time.
     * 'this' is a permission that the user has, 'pattern' is a permission that is being checked for.
     * If the permission in 'this' has an asterisk for something the 'pattern' requires, then the requirement is considered as fulfilled
     * e.g. if 'this' = organization:57d03f57-7019-4d9b-8105-9b57a48937c7:payment:*
     * and 'pattern' = organization:57d03f57-7019-4d9b-8105-9b57a48937c7:payment:list
     * then the check passes and we return true. This does not work in the opposite direction, 'pattern' may not have asterisks inside.
     */
    if (!(pattern instanceof Permission)) {
      return false;
    }

    const domain_match = micromatch.isMatch(this.domain, pattern.domain);
    const domain_id_match = micromatch.isMatch(
      this.domain_id,
      pattern.domain_id,
    );
    const resource_match = micromatch.isMatch(this.resource, pattern.resource);
    const action_match = micromatch.isMatch(this.action, pattern.action);

    return domain_match && domain_id_match && resource_match && action_match;
  }

  static getAllPermissions(account: Account): Permission[] {
    return account.permissions.map((perm) => Permission.parse(perm));
  }

  static hasPermission(permission: Permission, account: Account): boolean {
    const allPerms: Permission[] = Permission.getAllPermissions(account);
    return allPerms.some((perm) => perm.equals(permission));
  }

  static hasDomainPermission(
    domain_id: string,
    domain_name: string,
    account: Account,
  ): boolean {
    const allPerms: Permission[] = Permission.getAllPermissions(account);
    return allPerms.some(
      (perm) =>
        (perm.domain === domain_name || perm.domain === '*') &&
        (perm.domain_id === domain_id || perm.domain_id === '*'),
    );
  }
}
