CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description TEXT,
  description_th TEXT,
  price INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('nail', 'eyelash', 'spa', 'package')),
  image TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_id TEXT NOT NULL,
  booking_date TEXT NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  category TEXT NOT NULL CHECK(category IN ('nail', 'eyelash', 'spa')),
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Seed services
INSERT OR IGNORE INTO services (id, name, name_th, description, description_th, price, duration, category, image) VALUES
  ('spa-hand-foot', 'Premium Hand & Foot Spa', 'สปามือและเท้าพรีเมียม 8 ขั้นตอน', 'Intensive 8-step spa treatment', 'ปรนนิบัติมือและเท้า ด้วยสปาเข้มข้น 8 ขั้นตอน', 799, 90, 'spa', '/images/spa-hand-foot.jpg'),
  ('gel-nail', 'Gel Nail Art', 'ทำเล็บเจล', 'Beautiful gel nail art', 'ทำเล็บเจลสวยด้วยวัสดุพรีเมียม', 590, 60, 'nail', '/images/gel-nail.jpg'),
  ('nail-extension', 'Nail Extension', 'ต่อเล็บ', 'Professional nail extension', 'บริการต่อเล็บโดยช่างมืออาชีพ', 990, 120, 'nail', '/images/nail-extension.jpg'),
  ('eyelash-extension', 'Eyelash Extension', 'ต่อขนตา', 'Natural-looking eyelash extensions', 'ต่อขนตาธรรมชาติสวยงาม', 890, 90, 'eyelash', '/images/eyelash.jpg'),
  ('mani-pedi', 'Manicure & Pedicure', 'ทำเล็บมือและเท้า', 'Classic manicure and pedicure', 'ทำเล็บมือและเท้าแบบคลาสสิก', 450, 60, 'nail', '/images/mani-pedi.jpg'),
  ('nail-spa-package', 'Nail + Spa Package', 'แพ็คเกจเล็บ + สปา', 'Complete nail art with spa', 'แพ็คเกจทำเล็บพร้อมสปาครบวงจร', 1290, 150, 'package', '/images/package.jpg');
