export interface RequestContext {
  requestId: string;
  correlationId: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
}