# UserList REST API — CSIS 3380 Module 8 Lab

Johnny · Douglas College

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
| GET | `/api/users/random` | Get a random user |
| POST | `/api/users/newuser` | Create user (`id`, `email` required) |
| PUT | `/api/users/modify/:id` | Update `username` |
| DELETE | `/user/delete/:id` | Delete user (also available at `/api/users/delete/:id`) |

Errors return JSON with `{ "error": { "message": "..." } }` and status 400/404/500.

## Deploy (Render)

- Build Command: `npm install`
- Start Command: `node server.js`
- Environment: `MONGODB_URI` (Atlas connection string). `PORT` is provided by Render.

See `../Lab教程-REST-API-MongoDB.html` for the full step-by-step tutorial and Postman test plan.
