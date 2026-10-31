# World Wide Travel

A travel agency website, rebuilt from my Assignment 1 HTML/CSS site using React and Tailwind CSS. Assignment 3 added a real backend, a Postgres database, user authentication and a live deployment. Assignment 4 added real payments with Stripe Checkout (test mode), a webhook, and saved orders.

**Live site:** https://ai-generated1.vercel.app
**API (tours endpoint):** https://travel-api-e693.onrender.com/api/tours

> The API runs on Render's free tier, which goes to sleep after 15 minutes of inactivity. The first request after a quiet period can take up to a minute while the server wakes up. Payments use Stripe **test mode**, so no real money is ever taken.

## Features

- Responsive travel agency site built with React and Tailwind CSS
- Header with a mobile menu (hamburger button) on phones and small laptops, and the full navigation bar on wide screens
- Tour packages loaded from a real Postgres database through a JSON API
- Filter tours by region (All, Asia, Europe)
- Traveller counter on each tour card with a live total price
- Real signup and login with hashed passwords
- Sessions stored in the database, so you stay signed in after a page refresh
- Header shows **Sign in** or **Sign out** (with the user's email) depending on login state
- **Buy now** button on every tour that takes you to Stripe's hosted checkout page
- Payment confirmation popup that shows the status, the tour, the number of travellers and the total
- Cancelled payment message if the customer goes back from Stripe
- Orders saved in the database, linked to the signed-in user
- "Plan a Trip" quote form

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS (JavaScript, no TypeScript) |
| Backend | Node.js, Express |
| Database | Postgres hosted on Neon |
| Auth | `bcrypt` password hashing, `express-session`, `connect-pg-simple` (sessions stored in Postgres) |
| Payments | Stripe Checkout (test mode), Stripe webhooks, Stripe CLI for local testing |
| Hosting | Vercel (frontend), Render (backend), Neon (database) |

## Project structure

```
AiGenerated1/
├── client/                     React + Vite + Tailwind frontend
│   ├── public/images/          Tour images
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          Navigation, mobile menu, Sign in / Sign out
│   │   │   ├── Hero.jsx
│   │   │   ├── TourGrid.jsx        Fetches tours from the API, region filter
│   │   │   ├── TourCard.jsx        One tour card with the Buy now button
│   │   │   ├── TravellerStepper.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── PlanTrip.jsx        Quote form
│   │   │   ├── AuthForm.jsx        Login / signup modal
│   │   │   ├── OrderStatus.jsx     Payment confirmation popup
│   │   │   └── Footer.jsx
│   │   ├── data/siteData.js        Nav links, testimonials, stats (static content)
│   │   ├── api.js                  Fetch helper that sends the session cookie
│   │   ├── App.jsx                 Holds the logged-in user and the payment popups
│   │   └── main.jsx
│   └── vercel.json             Forwards /api requests to the Render backend
├── server/                     Express API
│   ├── index.js                Routes, sessions, auth, checkout, webhook, orders
│   ├── db.js                   Postgres connection pool
│   ├── schema.sql              Database tables
│   ├── seed.js                 Loads the tour data into the database
│   └── package.json
├── .gitignore                  Excludes node_modules, dist and .env
└── README.md
```

## Database schema

Five tables in Postgres:

- **`users`** stores accounts: `id`, `email` (unique), `password_hash` and `created_at`. The real password is never stored, only a bcrypt hash.
- **`tours`** stores the travel packages: `id`, `title`, `region`, `duration`, `price` (in pounds), `image`, `image_alt` and `features` (a list of text).
- **`session`** stores login sessions: `sid`, `sess` and `expire`. It lets users stay signed in after a refresh or a server restart.
- **`orders`** has one row per purchase: `id`, `user_id` (linked to `users`), `status` (`pending` or `paid`), `total_amount` (in pence), `currency`, `stripe_session_id`, `created_at` and `paid_at`.
- **`order_items`** records what was bought: `order_id` (linked to `orders`), `tour_id` (linked to `tours`), `title`, `unit_price` (in pence) and `quantity`. The price at the time of purchase is stored, so old orders stay correct if a tour's price changes later.

Money is stored as whole numbers in pence, to avoid decimal rounding errors. Stripe also works in the smallest currency unit. The full SQL is in [`server/schema.sql`](server/schema.sql).

## API endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/tours` | Returns all tours as JSON |
| POST | `/api/auth/signup` | Creates an account (email + password of 8+ characters) and logs the user in |
| POST | `/api/auth/login` | Checks the email and password and starts a session |
| POST | `/api/auth/logout` | Ends the session |
| GET | `/api/auth/me` | Returns the logged-in user, or `null` if nobody is logged in |
| POST | `/api/checkout` | Signed-in users only. Creates a pending order and a Stripe Checkout Session, and returns the Stripe URL |
| POST | `/api/stripe/webhook` | Called by Stripe after payment. Verifies the signature and marks the order as paid |
| GET | `/api/orders/:id` | Signed-in users only. Returns the status and items of the user's own order |

## How authentication works

1. **Signup:** the server hashes the password with `bcrypt` and saves the email and hash in `users`.
2. **Login:** `bcrypt.compare` checks the typed password against the stored hash. If it matches, the server saves the user's id in a session.
3. **Sessions:** the session is stored in the `session` table in Postgres. The browser receives only a cookie containing the session ID.
4. **Staying signed in:** on every page load, `App.jsx` calls `/api/auth/me`. The browser sends the cookie back, the server finds the session, and the user stays signed in after a refresh.
5. **Logout:** the session is destroyed on the server and the cookie is cleared.

## How payments work

1. **Buy now:** the browser sends only a tour id and a number of travellers to `/api/checkout`. It never sends a price.
2. **Login check:** the `requireAuth` middleware blocks anyone who isn't signed in, so every order belongs to a real user.
3. **Price from the database:** the server looks up the real price in the `tours` table, so changing the page in the browser cannot change what is charged.
4. **Pending order:** the server saves the order and its item together in one database transaction, with the status `pending`.
5. **Stripe Checkout Session:** the server creates a session with the order id attached as metadata, and sends the Stripe page URL back. The browser then goes to Stripe's hosted payment page.
6. **Payment:** the customer pays with Stripe's test card `4242 4242 4242 4242`, any future expiry date and any CVC.
7. **Webhook:** Stripe calls `/api/stripe/webhook`. The server verifies the request's signature with the webhook secret, and only then changes the order from `pending` to `paid`. **The webhook is the only code that can mark an order as paid.**
8. **Confirmation popup:** Stripe sends the customer back to the site, and `OrderStatus.jsx` asks `/api/orders/:id` for the status. It checks up to 6 times, 2 seconds apart, because the webhook can arrive a moment after the redirect. It only reads the status and can never mark anything as paid, so visiting the success URL by hand proves nothing.
9. **Privacy:** the order lookup only returns orders that belong to the signed-in user, and the customer sees the status, tour, travellers and total, not the internal order number.

The webhook route uses `express.raw` and sits above `express.json()` in `index.js`, because Stripe's signature is calculated from the exact raw request body.

## Viewing orders (owner)

Orders can be checked in the Neon SQL Editor:

```sql
SELECT o.id, u.email, o.status, o.total_amount / 100.0 AS total_gbp,
       o.created_at, o.paid_at,
       string_agg(i.title || ' x' || i.quantity, ', ') AS items
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN order_items i ON i.order_id = o.id
GROUP BY o.id, u.email
ORDER BY o.id DESC;
```

Payments also appear in the Stripe dashboard under **Payments**, and webhook deliveries under the event destination.

## Run it locally

### Prerequisites

- Node.js
- A free Postgres database (for example on [Neon](https://neon.tech))
- A free [Stripe](https://stripe.com) account in test mode, and the [Stripe CLI](https://docs.stripe.com/stripe-cli)

### 1. Clone and install

```bash
git clone https://github.com/Sultana-akther20/AiGenerated1.git
cd AiGenerated1

cd server && npm install
cd ../client && npm install
```

### 2. Create the database tables

Run the contents of `server/schema.sql` in your database's SQL editor.

### 3. Add environment variables

Create `server/.env`:

```
DATABASE_URL=your-postgres-connection-string
SESSION_SECRET=a-long-random-string
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_from_stripe_listen
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:3000
```

Both `.env` files are listed in `.gitignore` and are never committed.

### 4. Seed the tours

```bash
cd server
node seed.js
```

### 5. Start everything

Use three terminals:

```bash
# terminal 1: API
cd server
npm run dev

# terminal 2: Stripe webhook listener (prints the whsec_ secret for server/.env)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# terminal 3: website
cd client
npm run dev
```

Open http://localhost:5173. To test a payment, sign in, click **Buy now**, and pay with the test card `4242 4242 4242 4242`.

## Deployment

| Part | Platform | Notes |
|---|---|---|
| Database | Neon | Free Postgres, tables created from `schema.sql` |
| Backend | Render (Web Service) | Root directory `server`, build `npm install`, start `npm start` |
| Frontend | Vercel | Root directory `client`, Vite preset |
| Payments | Stripe (test mode / sandbox) | A webhook destination points to the Render API and listens for `checkout.session.completed` |

**Render environment variables:** `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`, `CLIENT_URL` (the Vercel URL), `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` (the signing secret of the dashboard webhook destination, which is different from the one the Stripe CLI prints).

**Stripe webhook destination:** `https://travel-api-e693.onrender.com/api/stripe/webhook`, listening only for `checkout.session.completed`. It goes straight to Render and not through Vercel.

**Why `client/vercel.json` exists:** the frontend (Vercel) and the backend (Render) are on different domains, which can block login cookies. A rewrite in `vercel.json` forwards every `/api/...` request to the Render server, so the browser only talks to one domain and the session cookie works.

## Responsive design

The header switches layout by screen size:

- **Below 1024px (phones, tablets, small laptops):** a hamburger button opens a menu with the navigation links.
- **1024px and wider:** the full navigation bar is shown.
- The user's email is only shown on very wide screens (1280px and up), and links do not wrap onto two lines.

## Security notes

- Passwords are hashed with bcrypt and never stored in plain text.
- Secrets (`DATABASE_URL`, `SESSION_SECRET`, Stripe keys) are kept in `.env` files and in Render's environment variables, never in git.
- Session cookies are `httpOnly`, and `secure` in production.
- All database queries use parameterised values to prevent SQL injection.
- The price of a purchase is always read from the database, never from the browser.
- Checkout and order lookup require a signed-in user, and a user can only see their own orders.
- Stripe webhook requests are verified with a signing secret before any order is changed.

## Author

Sultana Akther