import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest, NextResponse } from "next/server";

// In-memory rate limiter and blocked IPs
const blockedIPs = new Set<string>();

const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 1000; // Max requests per minute per IP (allows development/testing)

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    return false;
  }

  return true;
}

export async function proxy(request: NextRequest) {
  const clientIP = getClientIP(request);

  // Rate limit requests per IP to prevent bot abuse
  if (!checkRateLimit(clientIP)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - /api/send-sms (SMS API - public)
     * - /api/test-sms (SMS test - public)
     * - /api/retell/webhook (Retell webhook - public)
     * - /api/retell/call (Retell call API - public)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/send-sms|api/test-sms|api/webhooks/sms|api/retell|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
