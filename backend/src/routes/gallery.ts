import { Hono } from 'hono';

type Bindings = { DB: D1Database };

export const galleryRoute = new Hono<{ Bindings: Bindings }>();

galleryRoute.get('/', async (c) => {
  const category = c.req.query('category');

  let query = 'SELECT * FROM gallery WHERE is_active = 1';
  const params: string[] = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';

  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json(results);
});
