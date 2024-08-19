import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import {
  ForgotPasswordEventPayload,
  ForgotPasswordSchema,
  LoginUserSchema,
  ResetPasswordSchema,
} from './auth.schema';

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
