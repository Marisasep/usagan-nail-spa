import { Hono } from 'hono';

type Bindings = { DB: D1Database };

export const bookingsRoute = new Hono<{ Bindings: Bindings }>();

bookingsRoute.post('/', async (c) => {
  const body = await c.req.json<{
    customerName: string;
    customerPhone: string;
    serviceId: string;
    date: string;
    time: string;
    note?: string;
  }>();

  if (!body.customerName || !body.customerPhone || !body.serviceId || !body.date || !body.time) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const id = crypto.randomUUID();

  await c.env.DB.prepare(
    `INSERT INTO bookings (id, customer_name, customer_phone, service_id, booking_date, booking_time, note)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, body.customerName, body.customerPhone, body.serviceId, body.date, body.time, body.note ?? null)
    .run();

  return c.json({ id, status: 'pending' }, 201);
});

bookingsRoute.get('/:id', async (c) => {
  const id = c.req.param('id');
  const result = await c.env.DB.prepare(
    `SELECT b.*, s.name as service_name
     FROM bookings b
     JOIN services s ON b.service_id = s.id
     WHERE b.id = ?`
  ).bind(id).first();

  if (!result) {
    return c.json({ error: 'Booking not found' }, 404);
  }

  return c.json(result);
});
