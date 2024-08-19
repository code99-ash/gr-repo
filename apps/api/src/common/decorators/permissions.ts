import { SetMetadata } from '@nestjs/common';
import { PermissionString } from '../modules/auth/permissions.interface';

export const Permissions = (permissions: Array<PermissionString>) =>
  SetMetadata('permissions', permissions);
