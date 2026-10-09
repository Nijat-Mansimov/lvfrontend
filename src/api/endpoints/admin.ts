import { apiClient } from '../client';
import {
  User,
  UserSchema,
} from '../schemas/auth';
import {
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  RevokeSessionsResponse,
  RevokeSessionsResponseSchema,
  ApiKey,
  ApiKeySchema,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  CreateApiKeyResponseSchema,
  AuditEvent,
  UsersListSchema,
  ApiKeysListSchema,
  AuditEventsListSchema,
} from '../schemas/admin';

export const adminEndpoints = {
  // Users
  getUsers: () =>
    apiClient<User[]>('/api/v1/users', { method: 'GET' }, { schema: UsersListSchema }),

  createUser: (data: CreateUserRequest) =>
    apiClient<User>(
      '/api/v1/users',
      { method: 'POST', body: JSON.stringify(data) },
      { schema: UserSchema }
    ),

  updateUser: (id: string, data: UpdateUserRequest) =>
    apiClient<User>(
      `/api/v1/users/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      { schema: UserSchema }
    ),

  resetPassword: (id: string, data: ResetPasswordRequest) =>
    apiClient<User>(
      `/api/v1/users/${id}/reset-password`,
      { method: 'POST', body: JSON.stringify(data) },
      { schema: UserSchema }
    ),

  unlockUser: (id: string) =>
    apiClient<User>(`/api/v1/users/${id}/unlock`, { method: 'POST' }, { schema: UserSchema }),

  revokeSessions: (id: string) =>
    apiClient<RevokeSessionsResponse>(
      `/api/v1/users/${id}/sessions`,
      { method: 'DELETE' },
      { schema: RevokeSessionsResponseSchema }
    ),

  // API Keys
  getApiKeys: (includeRevoked: boolean = false) =>
    apiClient<ApiKey[]>(
      '/api/v1/api-keys',
      { method: 'GET' },
      { params: { include_revoked: includeRevoked }, schema: ApiKeysListSchema }
    ),

  createApiKey: (data: CreateApiKeyRequest) =>
    apiClient<CreateApiKeyResponse>(
      '/api/v1/api-keys',
      { method: 'POST', body: JSON.stringify(data) },
      { schema: CreateApiKeyResponseSchema }
    ),

  revokeApiKey: (id: string) =>
    apiClient<ApiKey>(`/api/v1/api-keys/${id}`, { method: 'DELETE' }, { schema: ApiKeySchema }),

  // Audit Events
  getAuditEvents: (params: {
    action?: string;
    outcome?: string;
    actor?: string;
    before_id?: number;
    limit?: number;
  }) =>
    apiClient<AuditEvent[]>(
      '/api/v1/audit-events',
      { method: 'GET' },
      { params, schema: AuditEventsListSchema }
    ),
};
