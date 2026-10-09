import { z } from 'zod';

export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
  request_id: z.string().optional(),
  details: z.union([z.record(z.string(), z.unknown()), z.array(z.unknown()), z.string()]).optional(),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>;

export class ApiError extends Error {
  status: number;
  code: string;
  requestId?: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, requestId?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
  }
}
