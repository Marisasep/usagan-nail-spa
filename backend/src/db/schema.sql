CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
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
  technician_id TEXT,
  booking_date TEXT NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (technician_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  category TEXT NOT NULL CHECK(category IN ('nail', 'eyelash', 'spa')),
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT DEFAULT 'technician' CHECK(role IN ('owner', 'admin', 'technician')),
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Seed users
INSERT OR IGNORE INTO users (id, username, password_hash, display_name, role) VALUES
  ('admin-001', 'admin', 'ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270', 'เจ้าของร้าน', 'owner'),
  ('staff-001', 'staff', '02defbfb8190f9d0719ef7a23da2049bd2e61442bc14021a6d8a4ae35ca334b7', 'พนักงาน', 'admin'),
  ('tech-001', 'tech', 'bc62812f19e2944fa15d0b0ec9e5776dbdc99ec297e80fded67c69b41232ad30', 'ช่างเล็บ', 'technician');

-- Seed services
INSERT OR IGNORE INTO services (id, name, description, price, duration, category, image) VALUES
  ('spa-hand-foot', 'สปามือและเท้าพรีเมียม 8 ขั้นตอน', 'ปรนนิบัติมือและเท้า ด้วยสปาเข้มข้น 8 ขั้นตอน', 799, 90, 'spa', '/image/006.jpg'),
  ('gel-nail', 'ทำเล็บเจล', 'ทำเล็บเจลสวยด้วยวัสดุพรีเมียม', 590, 60, 'nail', '/image/002.jpg'),
  ('nail-extension', 'ต่อเล็บ', 'บริการต่อเล็บโดยช่างมืออาชีพ', 990, 120, 'nail', '/image/003.jpg'),
  ('eyelash-extension', 'ต่อขนตา', 'ต่อขนตาธรรมชาติสวยงาม', 890, 90, 'eyelash', '/image/004.jpg'),
  ('mani-pedi', 'ทำเล็บมือและเท้า', 'ทำเล็บมือและเท้าแบบคลาสสิก', 450, 60, 'nail', '/image/005.jpg'),
  ('nail-spa-package', 'แพ็คเกจเล็บ + สปา', 'แพ็คเกจทำเล็บพร้อมสปาครบวงจร', 1290, 150, 'package', '/image/007.jpg');
