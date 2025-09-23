# Bionary Backend API

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` file (see example in this repo).
3. Seed the database:
   ```bash
   npm run seed
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/login` — Login for admins (returns JWT)
- `GET/POST/PUT/DELETE /api/events` — Manage events (auth required)
- `GET/POST/PUT/DELETE /api/gallery` — Manage gallery (auth required)
- `GET/POST/PUT/DELETE /api/leaderboard` — Manage leaderboard (auth required)
- `GET/POST/PUT/DELETE /api/blog` — Manage blog (auth required)
- `GET /api/audit` — View audit log (auth required)

## Notes
- All protected endpoints require `Authorization: Bearer <token>` header.
- Passwords are hashed with bcrypt.
- All admin actions are logged in the audit log.
