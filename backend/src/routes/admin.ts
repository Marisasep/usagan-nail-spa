import { Hono } from 'hono';
import { authMiddleware, requireRole, hashPassword } from '../middleware/auth';

type Env = {
  Bindings: { DB: D1Database; BUCKET: R2Bucket };
  Variables: { userId: string; userRole: string };
};

export const adminRoute = new Hono<Env>();

adminRoute.use('/*', authMiddleware);

// ── Dashboard stats (owner, admin) ──

adminRoute.get('/stats', requireRole('owner', 'admin'), async (c) => {
  const [bookings, bookingsToday, bookingsPending, services, users] =
    await Promise.all([
      c.env.DB.prepare('SELECT COUNT(*) as count FROM bookings').first<{ count: number }>(),
      c.env.DB.prepare(
        "SELECT COUNT(*) as count FROM bookings WHERE booking_date = date('now')"
      ).first<{ count: number }>(),
      c.env.DB.prepare(
        "SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'"
      ).first<{ count: number }>(),
      c.env.DB.prepare('SELECT COUNT(*) as count FROM services WHERE is_active = 1').first<{ count: number }>(),
      c.env.DB.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1').first<{ count: number }>(),
    ]);

  const recentBookings = await c.env.DB.prepare(
    `SELECT b.id, b.customer_name, b.booking_date, b.booking_time, b.status,
            s.name as service_name, u.display_name as technician_name
     FROM bookings b
     JOIN services s ON b.service_id = s.id
     LEFT JOIN users u ON b.technician_id = u.id
     ORDER BY b.created_at DESC LIMIT 5`
  ).all();

  return c.json({
    totalBookings: bookings?.count ?? 0,
    bookingsToday: bookingsToday?.count ?? 0,
    bookingsPending: bookingsPending?.count ?? 0,
    totalServices: services?.count ?? 0,
    totalUsers: users?.count ?? 0,
    recentBookings: recentBookings.results,
  });
});

// ── Users CRUD (owner only) ──

adminRoute.get('/users', requireRole('owner', 'admin'), async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, username, display_name, role, is_active, created_at FROM users ORDER BY created_at DESC'
  ).all();
  return c.json(results);
});

adminRoute.post('/users', requireRole('owner', 'admin'), async (c) => {
  const body = await c.req.json<{
    username: string;
    password: string;
    displayName: string;
    role?: string;
  }>();

  if (!body.username || !body.password || !body.displayName) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE username = ?')
    .bind(body.username)
    .first();
  if (existing) {
    return c.json({ error: 'Username already exists' }, 409);
  }

  const id = crypto.randomUUID();
  const hash = await hashPassword(body.password);

  await c.env.DB.prepare(
    'INSERT INTO users (id, username, password_hash, display_name, role) VALUES (?, ?, ?, ?, ?)'
  )
    .bind(id, body.username, hash, body.displayName, body.role ?? 'technician')
    .run();

  return c.json({ id, username: body.username, displayName: body.displayName }, 201);
});

adminRoute.put('/users/:id', requireRole('owner', 'admin'), async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{
    displayName?: string;
    role?: string;
    password?: string;
    isActive?: boolean;
  }>();

  const fields: string[] = [];
  const values: unknown[] = [];

  if (body.displayName !== undefined) { fields.push('display_name = ?'); values.push(body.displayName); }
  if (body.role !== undefined) { fields.push('role = ?'); values.push(body.role); }
  if (body.password) { fields.push('password_hash = ?'); values.push(await hashPassword(body.password)); }
  if (body.isActive !== undefined) { fields.push('is_active = ?'); values.push(body.isActive ? 1 : 0); }

  if (fields.length === 0) return c.json({ error: 'No fields to update' }, 400);

  values.push(id);
  await c.env.DB.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

adminRoute.delete('/users/:id', requireRole('owner', 'admin'), async (c) => {
  const id = c.req.param('id');
  if (id === c.get('userId')) return c.json({ error: 'Cannot delete yourself' }, 400);
  await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ── Technicians list (owner, admin) ──

adminRoute.get('/technicians', requireRole('owner', 'admin'), async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, display_name FROM users WHERE role = 'technician' AND is_active = 1 ORDER BY display_name"
  ).all();
  return c.json(results);
});

// ── Image upload (R2) ──

adminRoute.post('/upload', requireRole('owner', 'admin'), async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return c.json({ error: 'No file provided' }, 400);

  const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
  const key = `${crypto.randomUUID()}.${ext}`;

  await c.env.BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  return c.json({ url: `/uploads/${key}` });
});

// ── Services CRUD (owner only) ──

adminRoute.get('/services', requireRole('owner', 'admin'), async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM services ORDER BY created_at DESC').all();
  return c.json(results);
});

adminRoute.post('/services', requireRole('owner', 'admin'), async (c) => {
  const body = await c.req.json<{ name: string; description?: string; price: number; duration: number; category: string; image?: string }>();
  if (!body.name || !body.price || !body.duration || !body.category) return c.json({ error: 'Missing required fields' }, 400);
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO services (id, name, description, price, duration, category, image) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, body.name, body.description ?? null, body.price, body.duration, body.category, body.image ?? null).run();
  return c.json({ id }, 201);
});

adminRoute.put('/services/:id', requireRole('owner', 'admin'), async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{ name?: string; description?: string; price?: number; duration?: number; category?: string; image?: string; isActive?: boolean }>();
  const fields: string[] = [];
  const values: unknown[] = [];
  if (body.name !== undefined) { fields.push('name = ?'); values.push(body.name); }
  if (body.description !== undefined) { fields.push('description = ?'); values.push(body.description); }
  if (body.price !== undefined) { fields.push('price = ?'); values.push(body.price); }
  if (body.duration !== undefined) { fields.push('duration = ?'); values.push(body.duration); }
  if (body.category !== undefined) { fields.push('category = ?'); values.push(body.category); }
  if (body.image !== undefined) { fields.push('image = ?'); values.push(body.image); }
  if (body.isActive !== undefined) { fields.push('is_active = ?'); values.push(body.isActive ? 1 : 0); }
  if (fields.length === 0) return c.json({ error: 'No fields to update' }, 400);
  values.push(id);
  await c.env.DB.prepare(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

adminRoute.delete('/services/:id', requireRole('owner', 'admin'), async (c) => {
  await c.env.DB.prepare('DELETE FROM services WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ── Bookings management (owner, admin) ──

adminRoute.get('/bookings', requireRole('owner', 'admin'), async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT b.*, s.name as service_name, u.display_name as technician_name
     FROM bookings b
     JOIN services s ON b.service_id = s.id
     LEFT JOIN users u ON b.technician_id = u.id
     ORDER BY b.booking_date DESC, b.booking_time DESC`
  ).all();
  return c.json(results);
});

adminRoute.put('/bookings/:id/status', requireRole('owner', 'admin'), async (c) => {
  const { status } = await c.req.json<{ status: string }>();
  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) return c.json({ error: 'Invalid status' }, 400);
  await c.env.DB.prepare('UPDATE bookings SET status = ? WHERE id = ?').bind(status, c.req.param('id')).run();
  return c.json({ success: true });
});

adminRoute.put('/bookings/:id/assign', requireRole('owner', 'admin'), async (c) => {
  const { technicianId } = await c.req.json<{ technicianId: string | null }>();
  await c.env.DB.prepare('UPDATE bookings SET technician_id = ? WHERE id = ?').bind(technicianId, c.req.param('id')).run();
  return c.json({ success: true });
});

// ── Schedule: all technicians (owner, admin) ──

adminRoute.get('/schedule', requireRole('owner', 'admin'), async (c) => {
  const date = c.req.query('date') ?? new Date().toISOString().slice(0, 10);

  const { results } = await c.env.DB.prepare(
    `SELECT b.id, b.customer_name, b.booking_date, b.booking_time, b.status,
            s.name as service_name, s.duration,
            b.technician_id, u.display_name as technician_name
     FROM bookings b
     JOIN services s ON b.service_id = s.id
     LEFT JOIN users u ON b.technician_id = u.id
     WHERE b.booking_date = ?
     ORDER BY b.booking_time ASC`
  ).bind(date).all();

  return c.json(results);
});

// ── Weekly schedule (owner, admin) ──

adminRoute.get('/schedule/week', requireRole('owner', 'admin'), async (c) => {
  const startDate = c.req.query('start') ?? new Date().toISOString().slice(0, 10);
  const endDate = c.req.query('end') ?? startDate;

  const { results } = await c.env.DB.prepare(
    `SELECT b.id, b.customer_name, b.booking_date, b.booking_time, b.status,
            s.name as service_name, s.duration,
            b.technician_id, u.display_name as technician_name
     FROM bookings b
     JOIN services s ON b.service_id = s.id
     LEFT JOIN users u ON b.technician_id = u.id
     WHERE b.booking_date >= ? AND b.booking_date <= ?
     ORDER BY b.booking_date ASC, b.booking_time ASC`
  ).bind(startDate, endDate).all();

  return c.json(results);
});

// ── Technician's weekly schedule ──

adminRoute.get('/my-schedule/week', async (c) => {
  const userId = c.get('userId');
  const startDate = c.req.query('start') ?? new Date().toISOString().slice(0, 10);
  const endDate = c.req.query('end') ?? startDate;

  const { results } = await c.env.DB.prepare(
    `SELECT b.id, b.customer_name, b.customer_phone, b.booking_date, b.booking_time, b.status, b.note,
            s.name as service_name, s.duration
     FROM bookings b
     JOIN services s ON b.service_id = s.id
     WHERE b.technician_id = ? AND b.booking_date >= ? AND b.booking_date <= ?
     ORDER BY b.booking_date ASC, b.booking_time ASC`
  ).bind(userId, startDate, endDate).all();

  return c.json(results);
});

// ── My schedule: technician's own bookings ──

adminRoute.get('/my-schedule', async (c) => {
  const userId = c.get('userId');
  const date = c.req.query('date') ?? new Date().toISOString().slice(0, 10);

  const { results } = await c.env.DB.prepare(
    `SELECT b.id, b.customer_name, b.customer_phone, b.booking_date, b.booking_time, b.status, b.note,
            s.name as service_name, s.duration
     FROM bookings b
     JOIN services s ON b.service_id = s.id
     WHERE b.technician_id = ? AND b.booking_date = ?
     ORDER BY b.booking_time ASC`
  ).bind(userId, date).all();

  return c.json(results);
});

// ── Me: get current user info ──

adminRoute.get('/me', async (c) => {
  const userId = c.get('userId');
  const user = await c.env.DB.prepare(
    'SELECT id, username, display_name, role FROM users WHERE id = ?'
  ).bind(userId).first();
  return c.json(user);
});
