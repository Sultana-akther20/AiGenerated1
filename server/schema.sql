CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tours (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  region TEXT NOT NULL,
  duration TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  features TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'gbp',
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tour_id INTEGER NOT NULL REFERENCES tours(id),
  title TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);