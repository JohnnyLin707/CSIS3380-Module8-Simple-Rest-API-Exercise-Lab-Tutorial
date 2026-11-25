# UserList REST API — CSIS 3380 Module 8 Lab

Jinran · Douglas College

Express 5 + Mongoose 9 + MongoDB Atlas REST API for the `UserList` database (`users` collection).

## Setup

```bash
npm install
cp .env.example .env
# edit .env: paste your MongoDB Atlas connection string (with /UserList in it)
npm start
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/api/users` | List all users |
| GET | `/api/users/user/:id` | Get one user by numeric `id` |
| GET | `/api/getrandomuser` | Get a random user (path from the lab wording) |
| GET | `/api/users/random` | Same, textbook-style path |
| POST | `/api/users/newuser` | Create user (`id`, `email` required) |
| PUT | `/api/users/modify/:id` | Update `username`, returns 200 + updated user |
| DELETE | `/user/delete/:id` | Delete user (also available at `/api/users/delete/:id`) |

Route errors (400/404) return `{ "message": "..." }`; errors passed to `next(err)` return `{ "error": { "message": "..." } }` from the final handler. PUT returns 200 with the updated document; DELETE returns 204 No Content.

## Deploy (Render)

- Build Command: `npm install`
- Start Command: `node server.js`
- Environment: `MONGODB_URI` (Atlas connection string). `PORT` is provided by Render.

See `../index.html` for the full step-by-step tutorial and Postman test plan.
