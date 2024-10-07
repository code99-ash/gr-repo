import { z } from 'zod';

export const LoginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ForgotPasswordEventPayload = z.object({
  invite_link: z.string(),
  email: z.string(),
  recipient_name: z.string(),
});

export const ResetPasswordSchema = z.object({
  password: z.string(),
  token: z.string(),
});

export const SignupAdminSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  organization_name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  middle_name: z.string().optional(),
});
