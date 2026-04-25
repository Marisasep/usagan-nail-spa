import { Hono } from 'hono';

type Bindings = { DB: D1Database };

export const servicesRoute = new Hono<{ Bindings: Bindings }>();

servicesRoute.get('/', async (c) => {
  const category = c.req.query('category');

  let query = 'SELECT * FROM services WHERE is_active = 1';
  const params: string[] = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';

  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(results);
});

servicesRoute.get('/:id', async (c) => {
  const id = c.req.param('id');
  const result = await c.env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1').bind(id).first();

  if (!result) {
    return c.json({ error: 'Service not found' }, 404);
  }

  return c.json(result);
});
