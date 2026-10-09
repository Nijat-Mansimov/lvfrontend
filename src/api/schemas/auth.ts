import { z } from 'zod';

export const RoleSchema = z.enum(['admin', 'analyst', 'viewer']);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  display_name: z.string(),
  role: RoleSchema,
  is_active: z.boolean(),
  must_change_password: z.boolean(),
  locked_until: z.string().nullable(),
  last_login_at: z.string().nullable(),
  created_at: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const LoginRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  token: z.string().optional(),
  token_type: z.string().optional(),
  expires_at: z.string().optional(),
  user: UserSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const MeResponseSchema = z.object({
  kind: z.enum(['user', 'api_key']),
  id: z.string(),
  name: z.string(),
  scopes: z.array(z.string()),
  role: RoleSchema.nullable(),
  must_change_password: z.boolean(),
  user: UserSchema.optional(),
});
export type MeResponse = z.infer<typeof MeResponseSchema>;

export const ChangePasswordRequestSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(12, 'Password must be at least 12 characters'),
});
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
