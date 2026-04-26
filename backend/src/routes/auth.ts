import { Hono } from 'hono';
import { hashPassword, createToken } from '../middleware/auth';

type Bindings = { DB: D1Database };

export const authRoute = new Hono<{ Bindings: Bindings }>();

authRoute.post('/login', async (c) => {
  const { username, password } = await c.req.json<{
    username: string;
    password: string;
  }>();

  if (!username || !password) {
    return c.json({ error: 'Missing credentials' }, 400);
  }

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE username = ? AND is_active = 1'
  )
    .bind(username)
    .first<{ id: string; password_hash: string; display_name: string; role: string }>();

  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const hash = await hashPassword(password);
  if (hash !== user.password_hash) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = await createToken(user.id, user.role);

  return c.json({
    token,
    user: {
      id: user.id,
      displayName: user.display_name,
      role: user.role,
    },
  });
});
