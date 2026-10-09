import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { ApiError } from '@/api/schemas/common';
import { apiClient } from '@/api/client';

describe('API Client & Schema Validation', () => {
  it('maps errors into ApiError instances with proper status and code', async () => {
    try {
      await apiClient('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'non-existent-user', password: 'bad-password' }),
      }, { skipAuthRedirect: true });
      expect.fail('Should have thrown an error');
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.status).toBe(401);
      expect(apiErr.code).toBe('unauthorized');
    }
  });

  it('validates schema response correctly in mock mode', async () => {
    const TestSchema = z.object({
      status: z.string(),
      version: z.string(),
    });

    const res = await apiClient<{ status: string; version: string }>(
      '/api/v1/health',
      { method: 'GET' },
      { schema: TestSchema }
    );

    expect(res.status).toBe('ok');
    expect(res.version).toBe('0.7.2');
  });
});
