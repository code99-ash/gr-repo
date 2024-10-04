import { extendApi } from '@anatine/zod-openapi';
import { CreateUser } from '../db/users.db';
import { createZodDto } from '@anatine/zod-nestjs';

export class CreateUserDto extends createZodDto(extendApi(CreateUser)) {}
