import { createMiddleware } from 'hono/factory';

type Role = 'owner' | 'admin' | 'technician';

type Env = {
  Bindings: { DB: D1Database };
  Variables: { userId: string; userRole: Role };
};

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function createToken(userId: string, role: string): Promise<string> {
  const payload = { userId, role, exp: Date.now() + 1000 * 60 * 60 * 24 };
  const json = JSON.stringify(payload);
  return btoa(json);
}

function verifyToken(token: string): { userId: string; role: Role } | null {
  try {
    const json = atob(token);
    const payload = JSON.parse(json) as { userId: string; role: Role; exp: number };
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = header.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
  c.set('userId', payload.userId);
  c.set('userRole', payload.role);
  await next();
});

function requireRole(...allowed: Role[]) {
  return createMiddleware<Env>(async (c, next) => {
    const role = c.get('userRole');
    if (!allowed.includes(role)) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    await next();
  });
}

export { hashPassword, createToken, verifyToken, authMiddleware, requireRole };
export type { Role };
