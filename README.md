# World Wide Travel

A travel agency website, rebuilt from my Assignment 1 HTML/CSS site using React + vite and Tailwind CSS, and extended in Assignment 3 with a real backend, a Postgres database, user authentication, and a live deployment.

**Live site:** https://ai-generated1.vercel.app
**API (tours endpoint):** https://travel-api-e693.onrender.com/api/tours

> The API runs on Render's free tier, which goes to sleep after 15 minutes of inactivity. The first request after a quiet period can take up to a minute while the server wakes up.

## Features

- Responsive travel agency site built with React+vite and Tailwind CSS
- Tour packages loaded from a real Postgres database through a JSON API
- Filter tours by region (All, Asia, Europe)
- Traveller counter on each tour card with a live total price
- Real signup and login with hashed passwords
- Sessions stored in the database, so you stay signed in after a page refresh
- Header shows **Sign in** or **Sign out** (with the user's email) depending on login state
- "Plan a Trip" quote form

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS (JavaScript, no TypeScript) |
| Backend | Node.js, Express |
| Database | Postgres hosted on Neon |
| Auth | `bcrypt` password hashing, `express-session`, `connect-pg-simple` (sessions stored in Postgres) |
| Hosting | Vercel (frontend), Render (backend), Neon (database) |

## Project structure

```
AiGenerated1/
├── client/                     React + Vite + Tailwind frontend
│   ├── public/images/          Tour images
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          Navigation, Sign in / Sign out
│   │   │   ├── Hero.jsx
│   │   │   ├── TourGrid.jsx        Fetches tours from the API, region filter
│   │   │   ├── TourCard.jsx        One tour package card
│   │   │   ├── TravellerStepper.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── PlanTrip.jsx        Quote form
│   │   │   ├── AuthForm.jsx        Login / signup modal
│   │   │   └── Footer.jsx
│   │   ├── data/siteData.js        Nav links, testimonials, stats (static content)
│   │   ├── api.js                  Small fetch helper that sends the session cookie
│   │   ├── App.jsx                 Holds the logged-in user state
│   │   └── main.jsx
│   └── vercel.json             Forwards /api requests to the Render backend
├── server/                     Express API
│   ├── index.js                Routes, sessions, auth
│   ├── db.js                   Postgres connection pool
│   ├── schema.sql              Database tables
│   ├── seed.js                 Loads the tour data into the database
│   └── package.json
├── .gitignore                  Excludes node_modules, dist and .env
└── README.md
```

## Database schema

Three tables in Postgres:

- **`users`** stores accounts: `id`, `email` (unique), `password_hash` and `created_at`. The real password is never stored, only a bcrypt hash.
- **`tours`** stores the travel packages shown on the site: `id`, `title`, `region`, `duration`, `price`, `image`, `image_alt` and `features` (a list of text).
- **`session`** stores login sessions: `sid`, `sess` and `expire`. It lets users stay signed in after a refresh or a server restart.

The full SQL is in [`server/schema.sql`](server/schema.sql).

## API endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/tours` | Returns all tours as JSON |
| POST | `/api/auth/signup` | Creates an account (email + password of 8+ characters) and logs the user in |
| POST | `/api/auth/login` | Checks the email and password and starts a session |
| POST | `/api/auth/logout` | Ends the session |
| GET | `/api/auth/me` | Returns the logged-in user, or `null` if nobody is logged in |

## How authentication works

1. **Signup:** the server hashes the password with `bcrypt` and saves the email and hash in `users`.
2. **Login:** `bcrypt.compare` checks the typed password against the stored hash. If it matches, the server saves the user's id in a session.
3. **Sessions:** the session is stored in the `session` table in Postgres. The browser receives only a cookie containing the session ID.
4. **Staying signed in:** on every page load, `App.jsx` calls `/api/auth/me`. The browser sends the cookie back, the server finds the session, and the user stays signed in after a refresh.
5. **Logout:** the session is destroyed on the server and the cookie is cleared.

## Run it locally

### Prerequisites

- Node.js
- A free Postgres database (for example on [Neon](https://neon.tech))

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

### 5. Start both servers

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

Open http://localhost:5173.

## Deployment

| Part | Platform | Notes |
|---|---|---|
| Database | Neon | Free Postgres, tables created from `schema.sql` |
| Backend | Render (Web Service) | Root directory `server`, build `npm install`, start `npm start` |
| Frontend | Vercel | Root directory `client`, Vite preset |

**Render environment variables:** `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`, `CLIENT_URL` (the Vercel URL).

**Why `client/vercel.json` exists:** the frontend (Vercel) and the backend (Render) are on different domains, which can block login cookies. A rewrite in `vercel.json` forwards every `/api/...` request to the Render server, so the browser only talks to one domain and the session cookie works.

## Security notes

- Passwords are hashed with bcrypt and never stored in plain text.
- Secrets (`DATABASE_URL`, `SESSION_SECRET`) are kept in `.env` files and in Render's environment variables, never in git.
- Session cookies are `httpOnly`, and `secure` in production.
- All database queries use parameterised values to prevent SQL injection.

## Author

Sultana Akther