export enum Resources {
  ALL = '*',
  USER = 'user',
  ACCOUNT = 'account',
  ORGANIZATION = 'organization',
  PRODUCT = 'product',
  ORDER = 'order',
  CUSTOMER = 'customer',
  RETURN_REQUEST = 'return_request',
}

export enum Domains {
  ALL = '*',
  INTERNAL = 'internal', // internal domain is to grant an admin access over all resources
  PRIVATE = 'private', // private domain is to access only a user's information. The user's uid would be verified before access is granted
}

export enum Actions {
  ALL = '*',
  READ = 'read',
  LIST = 'list',
  UPDATE = 'update',
  CREATE = 'create',
  DELETE = 'delete',
}

export type PermissionString =
  | `${Domains}:${string}:${Resources}:${Actions}`
  | '*';
