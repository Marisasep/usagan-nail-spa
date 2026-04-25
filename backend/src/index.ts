import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { servicesRoute } from './routes/services';
import { bookingsRoute } from './routes/bookings';
import { galleryRoute } from './routes/gallery';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

app.route('/api/services', servicesRoute);
app.route('/api/bookings', bookingsRoute);
app.route('/api/gallery', galleryRoute);

app.get('/api/health', (c) => c.json({ status: 'ok' }));

export default app;
