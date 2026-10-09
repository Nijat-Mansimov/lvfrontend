import { apiClient } from '../client';
import {
  LoginRequest,
  LoginResponse,
  LoginResponseSchema,
  MeResponse,
  MeResponseSchema,
  ChangePasswordRequest,
} from '../schemas/auth';

export const authEndpoints = {
  login: (data: LoginRequest) =>
    apiClient<LoginResponse>(
      '/api/v1/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      { schema: LoginResponseSchema, skipAuthRedirect: true }
    ),

  logout: () =>
    apiClient<null>('/api/v1/auth/logout', { method: 'POST' }, { skipAuthRedirect: true }),

  getMe: () =>
    apiClient<MeResponse>('/api/v1/auth/me', { method: 'GET' }, { schema: MeResponseSchema }),

  changePassword: (data: ChangePasswordRequest) =>
    apiClient<LoginResponse>(
      '/api/v1/auth/password',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      { schema: LoginResponseSchema }
    ),
};
