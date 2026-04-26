import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { servicesRoute } from './routes/services';
import { bookingsRoute } from './routes/bookings';
import { galleryRoute } from './routes/gallery';
import { authRoute } from './routes/auth';
import { adminRoute } from './routes/admin';

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

app.route('/api/services', servicesRoute);
app.route('/api/bookings', bookingsRoute);
app.route('/api/gallery', galleryRoute);
app.route('/api/auth', authRoute);
app.route('/api/admin', adminRoute);

app.get('/api/health', (c) => c.json({ status: 'ok' }));

// Serve images from R2
app.get('/uploads/:key{.+}', async (c) => {
  const key = c.req.param('key');
  const object = await c.env.BUCKET.get(key);
  if (!object) return c.notFound();
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
});

export default app;
