import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import {
  ForgotPasswordEventPayload,
  ForgotPasswordSchema,
  LoginUserSchema,
  ResetPasswordSchema,
} from './auth.schema';
import { CreateAdminAccount } from 'src/core/modules/accounts/schemas/account.schema';
import { CreateOrganization, CreateUser } from 'src/common/db/schemas';
import { z } from 'zod';

export class LoginUserDto extends createZodDto(extendApi(LoginUserSchema)) {}

export class ForgotPasswordDto extends createZodDto(
  extendApi(ForgotPasswordSchema),
) {}

export class ForgotPasswordEventPayloadDto extends createZodDto(
  extendApi(ForgotPasswordEventPayload),
) {}

export class ResetPasswordDto extends createZodDto(
  extendApi(ResetPasswordSchema),
) {}

export class SignupAdminDto extends createZodDto(
  extendApi(
    z.object({
      account: CreateAdminAccount,
      organization: CreateOrganization,
      user: CreateUser,
    }),
  ),
) {}
