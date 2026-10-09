import {
  mockUsers,
  mockEndpoints,
  mockAssets,
  mockScanRuns,
  mockDiff,
  mockSummary,
  mockTIStatus,
  mockApiKeys,
  mockAuditEvents,
} from './fixtures';
import type { User } from '../schemas/auth';
import type { ApiKey } from '../schemas/admin';

// In-memory mutable state for the mock session
let currentLoggedInUser: User | null = mockUsers[0]; // Default to admin for instant preview experience
let usersState = [...mockUsers];
let apiKeysState = [...mockApiKeys];
let auditEventsState = [...mockAuditEvents];
let tiStatusState = { ...mockTIStatus };

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function handleMockRequest(
  url: string,
  options: RequestInit = {}
): Promise<{ status: number; data: unknown; headers?: Record<string, string> }> {
  // Simulate network latency 200 - 350ms
  await delay(250);

  const method = (options.method || 'GET').toUpperCase();
  const parsedUrl = new URL(url, 'http://localhost');
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // 1. Auth endpoints
  if (pathname === '/api/v1/auth/login' && method === 'POST') {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const { username, password } = body;

    const user = usersState.find((u) => u.username.toLowerCase() === (username || '').toLowerCase());
    if (!user) {
      return {
        status: 401,
        data: { error: 'Invalid username or password', code: 'unauthorized' },
      };
    }

    if (!user.is_active) {
      return {
        status: 403,
        data: { error: 'Account is deactivated', code: 'forbidden' },
      };
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return {
        status: 403,
        data: { error: 'Account is locked due to too many failed attempts', code: 'forbidden' },
      };
    }

    // Default accepted passwords for demo
    if (
      password !== 'Admin-Passw0rd!' &&
      password !== 'Analyst-Passw0rd!' &&
      password !== 'Viewer-Passw0rd!' &&
      password !== 'temporary12345!' &&
      password.length < 8
    ) {
      return {
        status: 401,
        data: { error: 'Invalid username or password', code: 'unauthorized' },
      };
    }

    currentLoggedInUser = user;
    return {
      status: 200,
      data: {
        token: 'mock-session-token-for-dev',
        token_type: 'Bearer',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        user,
      },
      headers: {
        'Set-Cookie': 'lv_session=mock-token; Path=/; HttpOnly; SameSite=Strict',
      },
    };
  }

  if (pathname === '/api/v1/auth/logout' && method === 'POST') {
    currentLoggedInUser = null;
    return { status: 204, data: null };
  }

  if (pathname === '/api/v1/auth/me' && method === 'GET') {
    if (!currentLoggedInUser) {
      return {
        status: 401,
        data: { error: 'Not authenticated', code: 'unauthorized' },
      };
    }

    const scopes =
      currentLoggedInUser.role === 'admin'
        ? ['read', 'intel:run', 'admin']
        : currentLoggedInUser.role === 'analyst'
        ? ['read', 'intel:run']
        : ['read'];

    return {
      status: 200,
      data: {
        kind: 'user',
        id: currentLoggedInUser.id,
        name: currentLoggedInUser.display_name,
        scopes,
        role: currentLoggedInUser.role,
        must_change_password: currentLoggedInUser.must_change_password,
        user: currentLoggedInUser,
      },
    };
  }

  if (pathname === '/api/v1/auth/password' && method === 'POST') {
    if (!currentLoggedInUser) {
      return {
        status: 401,
        data: { error: 'Not authenticated', code: 'unauthorized' },
      };
    }
    const body = options.body ? JSON.parse(options.body as string) : {};
    const { new_password } = body;

    // Check policy: >= 12 chars, at least 3 of lower/upper/digit/symbol, no username
    if (new_password.length < 12) {
      return {
        status: 422,
        data: {
          error: 'Password does not meet complexity requirements',
          code: 'weak_password',
          details: 'Password must be at least 12 characters long',
        },
      };
    }

    currentLoggedInUser = {
      ...currentLoggedInUser,
      must_change_password: false,
    };
    usersState = usersState.map((u) => (u.id === currentLoggedInUser?.id ? currentLoggedInUser : u));

    return {
      status: 200,
      data: {
        token: 'new-session-token',
        token_type: 'Bearer',
        user: currentLoggedInUser,
      },
    };
  }

  // 2. Health
  if (pathname === '/api/v1/health') {
    return { status: 200, data: { status: 'ok', version: '0.7.2' } };
  }
  if (pathname === '/api/v1/health/ready') {
    return {
      status: 200,
      data: { status: 'ok', checks: { database: 'ok', intel_worker: 'ok' } },
    };
  }

  // 3. Inventory
  if (pathname === '/api/v1/summary') {
    return { status: 200, data: mockSummary };
  }

  if (pathname === '/api/v1/endpoints') {
    return { status: 200, data: { endpoints: mockEndpoints } };
  }

  if (pathname === '/api/v1/runs') {
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    return { status: 200, data: { runs: mockScanRuns.slice(0, limit) } };
  }

  if (pathname === '/api/v1/items') {
    const runIdParam = searchParams.get('run_id');
    const categoryParam = searchParams.get('category');
    const qParam = (searchParams.get('q') || '').toLowerCase().trim();
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let filtered = [...mockAssets];

    if (runIdParam) {
      const runId = parseInt(runIdParam, 10);
      filtered = filtered.filter((item) => item.run_id === runId);
    }

    if (categoryParam && categoryParam !== 'all') {
      filtered = filtered.filter((item) => item.category === categoryParam);
    }

    if (qParam) {
      filtered = filtered.filter((item) => {
        return (
          item.name.toLowerCase().includes(qParam) ||
          item.item_id.toLowerCase().includes(qParam) ||
          item.platform.toLowerCase().includes(qParam) ||
          (item.metadata.publisher && item.metadata.publisher.toLowerCase().includes(qParam))
        );
      });
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      status: 200,
      data: {
        items: paginated,
        total,
        run_id: runIdParam ? parseInt(runIdParam, 10) : 102,
      },
    };
  }

  if (pathname === '/api/v1/diff') {
    return { status: 200, data: mockDiff };
  }

  if (pathname === '/api/v1/raw') {
    const runId = searchParams.get('run_id') || '102';
    const rawExport = {
      collector_version: '0.7.2',
      run_id: parseInt(runId, 10),
      timestamp: new Date().toISOString(),
      system: {
        os: 'macOS 15.1',
        kernel: 'Darwin 24.1.0',
        arch: 'arm64',
        model: 'MacBookPro18,1',
      },
      inventory: mockAssets,
    };
    return { status: 200, data: rawExport };
  }

  // 4. Threat Intel
  if (pathname === '/api/v1/ti/status') {
    return { status: 200, data: tiStatusState };
  }

  if (pathname === '/api/v1/risk/analyze' && method === 'POST') {
    const runId = parseInt(searchParams.get('run_id') || '102', 10);
    // Trigger simulated quick processing
    tiStatusState = {
      ...tiStatusState,
      counts: { pending: 0, processing: 0, completed: 133, failed: 0 },
    };
    return { status: 202, data: { status: 'queued', run_id: runId } };
  }

  if (pathname === '/api/v1/ti/refresh' && method === 'POST') {
    tiStatusState = {
      ...tiStatusState,
      feeds: {
        ...tiStatusState.feeds,
        updated_at: new Date().toISOString(),
        extension_iocs: tiStatusState.feeds.extension_iocs + 4,
      },
    };
    return { status: 200, data: tiStatusState.feeds };
  }

  // 5. Admin - Users
  if (pathname === '/api/v1/users' && method === 'GET') {
    return { status: 200, data: usersState };
  }

  if (pathname === '/api/v1/users' && method === 'POST') {
    const body = JSON.parse(options.body as string);
    if (usersState.some((u) => u.username.toLowerCase() === body.username.toLowerCase())) {
      return {
        status: 409,
        data: { error: 'Username already taken', code: 'username_taken' },
      };
    }
    const newUser: User = {
      id: `u-${Date.now().toString(36)}`,
      username: body.username,
      display_name: body.display_name,
      role: body.role,
      is_active: true,
      must_change_password: true,
      locked_until: null,
      last_login_at: null,
      created_at: new Date().toISOString(),
    };
    usersState.push(newUser);
    return { status: 201, data: newUser };
  }

  const userMatch = pathname.match(/^\/api\/v1\/users\/([^/]+)$/);
  if (userMatch && method === 'PATCH') {
    const id = userMatch[1];
    const body = JSON.parse(options.body as string);
    const userIndex = usersState.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return { status: 404, data: { error: 'User not found', code: 'not_found' } };
    }
    // Prevent removing the last admin
    if (
      body.role &&
      body.role !== 'admin' &&
      usersState[userIndex].role === 'admin' &&
      usersState.filter((u) => u.role === 'admin' && u.is_active).length <= 1
    ) {
      return {
        status: 409,
        data: { error: 'Cannot demote the last active administrator', code: 'last_admin' },
      };
    }
    usersState[userIndex] = {
      ...usersState[userIndex],
      ...body,
    };
    return { status: 200, data: usersState[userIndex] };
  }

  const resetMatch = pathname.match(/^\/api\/v1\/users\/([^/]+)\/reset-password$/);
  if (resetMatch && method === 'POST') {
    const id = resetMatch[1];
    const userIndex = usersState.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return { status: 404, data: { error: 'User not found', code: 'not_found' } };
    }
    usersState[userIndex] = {
      ...usersState[userIndex],
      must_change_password: true,
    };
    return { status: 200, data: usersState[userIndex] };
  }

  const unlockMatch = pathname.match(/^\/api\/v1\/users\/([^/]+)\/unlock$/);
  if (unlockMatch && method === 'POST') {
    const id = unlockMatch[1];
    const userIndex = usersState.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return { status: 404, data: { error: 'User not found', code: 'not_found' } };
    }
    usersState[userIndex] = {
      ...usersState[userIndex],
      locked_until: null,
    };
    return { status: 200, data: usersState[userIndex] };
  }

  const sessionsMatch = pathname.match(/^\/api\/v1\/users\/([^/]+)\/sessions$/);
  if (sessionsMatch && method === 'DELETE') {
    return { status: 200, data: { revoked: 2 } };
  }

  // 6. Admin - API Keys
  if (pathname === '/api/v1/api-keys' && method === 'GET') {
    const includeRevoked = searchParams.get('include_revoked') === 'true';
    const keys = includeRevoked ? apiKeysState : apiKeysState.filter((k) => !k.revoked_at);
    return { status: 200, data: keys };
  }

  if (pathname === '/api/v1/api-keys' && method === 'POST') {
    const body = JSON.parse(options.body as string);
    const prefix = 'lvk_' + Math.random().toString(36).substring(2, 7);
    const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const plaintextKey = `${prefix}_${secret}`;

    const newKey: ApiKey = {
      id: `k-${Date.now().toString(36)}`,
      name: body.name,
      prefix,
      scopes: body.scopes,
      device_id: body.device_id || null,
      created_at: new Date().toISOString(),
      expires_at: body.expires_in_days
        ? new Date(Date.now() + body.expires_in_days * 86400000).toISOString()
        : null,
      revoked_at: null,
      last_used_at: null,
    };
    apiKeysState.unshift(newKey);
    return { status: 201, data: { ...newKey, key: plaintextKey } };
  }

  const apiKeyMatch = pathname.match(/^\/api\/v1\/api-keys\/([^/]+)$/);
  if (apiKeyMatch && method === 'DELETE') {
    const id = apiKeyMatch[1];
    const keyIndex = apiKeysState.findIndex((k) => k.id === id);
    if (keyIndex === -1) {
      return { status: 404, data: { error: 'API key not found', code: 'not_found' } };
    }
    apiKeysState[keyIndex] = {
      ...apiKeysState[keyIndex],
      revoked_at: new Date().toISOString(),
    };
    return { status: 200, data: apiKeysState[keyIndex] };
  }

  // 7. Admin - Audit Events
  if (pathname === '/api/v1/audit-events') {
    const action = searchParams.get('action');
    const outcome = searchParams.get('outcome');
    const actor = searchParams.get('actor');
    const beforeId = searchParams.get('before_id') ? parseInt(searchParams.get('before_id')!, 10) : null;
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    let events = [...auditEventsState];
    if (action) {
      events = events.filter((e) => e.action === action);
    }
    if (outcome) {
      events = events.filter((e) => e.outcome === outcome);
    }
    if (actor) {
      events = events.filter((e) => e.actor_name.toLowerCase().includes(actor.toLowerCase()));
    }
    if (beforeId) {
      events = events.filter((e) => e.id < beforeId);
    }
    return { status: 200, data: events.slice(0, limit) };
  }

  return {
    status: 404,
    data: { error: 'Endpoint not found', code: 'not_found' },
  };
}
