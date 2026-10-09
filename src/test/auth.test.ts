import { describe, it, expect } from 'vitest';
import { LoginRequestSchema, RoleSchema } from '@/api/schemas/auth';
import { CreateApiKeyRequestSchema } from '@/api/schemas/admin';

describe('Auth & Admin Form Schemas', () => {
  it('validates login request form data', () => {
    const valid = LoginRequestSchema.safeParse({ username: 'admin', password: 'secretpassword' });
    expect(valid.success).toBe(true);

    const missingUser = LoginRequestSchema.safeParse({ username: '', password: 'secretpassword' });
    expect(missingUser.success).toBe(false);

    const missingPass = LoginRequestSchema.safeParse({ username: 'admin', password: '' });
    expect(missingPass.success).toBe(false);
  });

  it('validates user roles enum strictly', () => {
    expect(RoleSchema.safeParse('admin').success).toBe(true);
    expect(RoleSchema.safeParse('analyst').success).toBe(true);
    expect(RoleSchema.safeParse('viewer').success).toBe(true);
    expect(RoleSchema.safeParse('superadmin').success).toBe(false);
  });

  it('validates API key creation parameters and enforces at least one scope', () => {
    const validKey = CreateApiKeyRequestSchema.safeParse({
      name: 'Mac Collector Alice',
      scopes: ['inventory:write', 'read'],
      expires_in_days: 90,
    });
    expect(validKey.success).toBe(true);

    const emptyScopes = CreateApiKeyRequestSchema.safeParse({
      name: 'Test Key',
      scopes: [],
    });
    expect(emptyScopes.success).toBe(false);
  });
});
