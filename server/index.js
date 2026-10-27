import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import "dotenv/config";
import { pool } from "./db.js";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PgStore = connectPgSimple(session);
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1); 

//app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
//app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// ---------- Stripe webhook (needs the raw body, so it goes BEFORE express.json) ----------
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;
    try {
      // Verify the message really came from Stripe
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature check failed:", err.message);
      return res.status(400).send("Invalid signature");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = Number(session.metadata?.orderId);

      if (session.payment_status === "paid" && orderId) {
        try {
          await pool.query(
            `UPDATE orders
             SET status = 'paid', paid_at = now()
             WHERE id = $1 AND stripe_session_id = $2 AND status = 'pending'`,
            [orderId, session.id]
          );
          console.log("Order", orderId, "marked as paid");
        } catch (err) {
          console.error(err);
          return res.status(500).send("Database error");
        }
      }
    }

    res.json({ received: true });
  }
);

app.use(express.json());


app.use(
  session({
    store: new PgStore({ pool, tableName: "session" }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    },
  })
);

// Blocks anyone who isn't signed in
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Please sign in to continue" });
  }
  next();
}

// ---------- data ----------
app.get("/api/tours", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM tours ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load tours" });
  }
});

// ---------- auth ----------
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 8) {
    return res
      .status(400)
      .json({ error: "Email and a password of at least 8 characters are required" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email.toLowerCase(), hash]
    );
    req.session.userId = rows[0].id;
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "That email is already registered" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      (email || "").toLowerCase(),
    ]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password || "", user.password_hash))) {
      return res.status(401).json({ error: "Wrong email or password" });
    }
    req.session.userId = user.id;
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

app.get("/api/auth/me", async (req, res) => {
  if (!req.session.userId) return res.json(null);
  try {
    const { rows } = await pool.query("SELECT id, email FROM users WHERE id = $1", [
      req.session.userId,
    ]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- checkout ----------
app.post("/api/checkout", requireAuth, async (req, res) => {
  const tourId = Number(req.body.tourId);
  const travellers = Number(req.body.travellers);

  // Validate what the browser sent (never trust it)
  if (!Number.isInteger(tourId) || !Number.isInteger(travellers) || travellers < 1 || travellers > 20) {
    return res.status(400).json({ error: "Invalid tour or number of travellers" });
  }

  const db = await pool.connect();
  try {
    // 1. Look up the REAL price in our own database
    const tourResult = await db.query("SELECT id, title, price FROM tours WHERE id = $1", [tourId]);
    const tour = tourResult.rows[0];
    if (!tour) return res.status(404).json({ error: "Tour not found" });

    const unitAmount = tour.price * 100; // pounds -> pence
    const total = unitAmount * travellers;

    // 2. Save the order and its item together (all or nothing)
    await db.query("BEGIN");
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, status, total_amount, currency)
       VALUES ($1, 'pending', $2, 'gbp') RETURNING id`,
      [req.session.userId, total]
    );
    const orderId = orderResult.rows[0].id;

    await db.query(
      `INSERT INTO order_items (order_id, tour_id, title, unit_price, quantity)
       VALUES ($1, $2, $3, $4, $5)`,
      [orderId, tour.id, tour.title, unitAmount, travellers]
    );
    await db.query("COMMIT");

    // 3. Start a Stripe Checkout Session for this order
    const userResult = await db.query("SELECT email FROM users WHERE id = $1", [req.session.userId]);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: userResult.rows[0].email,
      line_items: [
        {
          quantity: travellers,
          price_data: {
            currency: "gbp",
            unit_amount: unitAmount,
            product_data: { name: tour.title },
          },
        },
      ],
      metadata: { orderId: String(orderId) },
      success_url: `${process.env.CLIENT_URL}/?order=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/?canceled=1`,
    });

    // 4. Remember which Stripe session belongs to this order
    await db.query("UPDATE orders SET stripe_session_id = $1 WHERE id = $2", [session.id, orderId]);

    res.json({ url: session.url });
  } catch (err) {
    await db.query("ROLLBACK").catch(() => {});
    console.error(err);
    res.status(500).json({ error: "Could not start checkout" });
  } finally {
    db.release();
  }
});

// ---------- order lookup ----------
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid order id" });
  }
  try {
    // Only the person who placed the order can see it
    const orderResult = await pool.query(
      `SELECT id, status, total_amount, currency, created_at, paid_at
       FROM orders WHERE id = $1 AND user_id = $2`,
      [id, req.session.userId]
    );
    const order = orderResult.rows[0];
    if (!order) return res.status(404).json({ error: "Order not found" });

    const itemsResult = await pool.query(
      "SELECT title, unit_price, quantity FROM order_items WHERE order_id = $1",
      [id]
    );
    res.json({ ...order, items: itemsResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
