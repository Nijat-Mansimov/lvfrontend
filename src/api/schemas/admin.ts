import { z } from 'zod';
import { RoleSchema, UserSchema } from './auth';

export const CreateUserRequestSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  role: RoleSchema,
  display_name: z.string().min(1, 'Display name is required'),
});
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = z.object({
  role: RoleSchema.optional(),
  is_active: z.boolean().optional(),
  display_name: z.string().optional(),
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const ResetPasswordRequestSchema = z.object({
  temporary_password: z.string().min(12, 'Temporary password must be at least 12 characters'),
});
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

export const RevokeSessionsResponseSchema = z.object({
  revoked: z.number(),
});
export type RevokeSessionsResponse = z.infer<typeof RevokeSessionsResponseSchema>;

export const ApiKeyScopeSchema = z.enum(['inventory:write', 'read', 'intel:run']);
export type ApiKeyScope = z.infer<typeof ApiKeyScopeSchema>;

export const ApiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  prefix: z.string(),
  scopes: z.array(z.string()),
  device_id: z.string().nullable(),
  created_at: z.string(),
  expires_at: z.string().nullable(),
  revoked_at: z.string().nullable(),
  last_used_at: z.string().nullable(),
});
export type ApiKey = z.infer<typeof ApiKeySchema>;

export const CreateApiKeyRequestSchema = z.object({
  name: z.string().min(1, 'Key name is required'),
  scopes: z.array(ApiKeyScopeSchema).min(1, 'Select at least one scope'),
  device_id: z.string().optional().nullable(),
  expires_in_days: z.number().min(1).max(3650).optional().nullable(),
});
export type CreateApiKeyRequest = z.infer<typeof CreateApiKeyRequestSchema>;

export const CreateApiKeyResponseSchema = ApiKeySchema.extend({
  key: z.string(),
});
export type CreateApiKeyResponse = z.infer<typeof CreateApiKeyResponseSchema>;

export const AuditOutcomeSchema = z.enum(['success', 'failure', 'denied']);
export type AuditOutcome = z.infer<typeof AuditOutcomeSchema>;

export const AuditEventSchema = z.object({
  id: z.number(),
  occurred_at: z.string(),
  actor_type: z.string(),
  actor_id: z.string(),
  actor_name: z.string(),
  action: z.string(),
  outcome: AuditOutcomeSchema,
  target_type: z.string().nullable(),
  target_id: z.string().nullable(),
  ip_address: z.string().nullable(),
  request_id: z.string().nullable(),
  details: z.record(z.string(), z.unknown()),
});
export type AuditEvent = z.infer<typeof AuditEventSchema>;

export const UsersListSchema = z.array(UserSchema);
export const ApiKeysListSchema = z.array(ApiKeySchema);
export const AuditEventsListSchema = z.array(AuditEventSchema);
