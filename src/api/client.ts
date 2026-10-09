import { z } from 'zod';
import { ApiError, ApiErrorSchema } from './schemas/common';
import { handleMockRequest } from './mock/mockTransport';

export const isMockMode = import.meta.env.VITE_USE_MOCKS !== 'false';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface RequestConfig<T> {
  schema?: z.ZodType<T>;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuthRedirect?: boolean;
}

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'req_' + Math.random().toString(36).substring(2, 15);
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
  config: RequestConfig<T> = {}
): Promise<T> {
  const requestId = generateRequestId();

  // Construct URL with query parameters
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
  const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`, origin);
  if (config.params) {
    Object.entries(config.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  headers.set('X-Request-ID', requestId);
  if (options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  let status: number;
  let responseData: unknown;
  let responseHeaders: Headers;

  if (isMockMode) {
    const mockRes = await handleMockRequest(url.pathname + url.search, {
      ...options,
      headers,
    });
    status = mockRes.status;
    responseData = mockRes.data;
    responseHeaders = new Headers(mockRes.headers || {});
  } else {
    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers,
        credentials: 'same-origin',
      });
      status = response.status;
      responseHeaders = response.headers;

      if (status === 204) {
        responseData = null;
      } else {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : null;
      }
    } catch (err: unknown) {
      throw new ApiError(0, 'network_error', 'Network error or unable to connect to server', requestId, err);
    }
  }

  // Handle errors
  if (status >= 400) {
    let errorCode = 'unknown_error';
    let errorMessage = `HTTP Error ${status}`;
    let errorDetails: unknown = undefined;

    const errorParsed = ApiErrorSchema.safeParse(responseData);
    if (errorParsed.success) {
      errorCode = errorParsed.data.code;
      errorMessage = errorParsed.data.error;
      errorDetails = errorParsed.data.details;
    } else if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
      errorMessage = String((responseData as { message: unknown }).message);
    }

    // 401: Unauthorized -> redirect to login
    if (status === 401 && !config.skipAuthRedirect) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?next=${encodeURIComponent(currentPath)}`;
      }
    }

    // 403: Password change required
    if (status === 403 && errorCode === 'password_change_required') {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/account/password')) {
        window.location.href = '/account/password?forced=1';
      }
    }

    // 429: Rate limited
    if (status === 429) {
      const retryAfter = responseHeaders.get('Retry-After') || '60';
      errorMessage = `Rate limited. Please retry in ${retryAfter} seconds.`;
    }

    throw new ApiError(status, errorCode, errorMessage, requestId, errorDetails);
  }

  if (status === 204) {
    return null as T;
  }

  // Zod Runtime Validation
  if (config.schema) {
    const parseResult = config.schema.safeParse(responseData);
    if (!parseResult.success) {
      console.error(`[API Schema Mismatch] Path: ${path}`, parseResult.error.format());
      throw new ApiError(
        500,
        'schema_validation_error',
        `API response did not match expected schema for ${path}`,
        requestId,
        parseResult.error.issues
      );
    }
    return parseResult.data;
  }

  return responseData as T;
}
