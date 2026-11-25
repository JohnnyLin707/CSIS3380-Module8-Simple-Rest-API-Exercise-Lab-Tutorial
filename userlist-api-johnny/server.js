require('dotenv').config({ quiet: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

// ------------------------------------------------------------ the plan
// Send a GET request to /api/users to READ a list of users
// Send a GET request to /api/users/user/:id to READ (view) one user
// Send a GET request to /api/users/random to READ (view) a random user
// Send a POST request to /api/users/newuser to CREATE a new user
// Send a PUT request to /api/users/modify/:id to UPDATE (edit) a user's username
// Send a DELETE request to /api/users/delete/:id to DELETE a user

// Middleware: turn a JSON request body into the object req.body
app.use(express.json());
app.use(cors());

// A first JSON route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the UserList API' });
});

app.use('/api/users', userRoutes);
app.use('/user', userRoutes);   // the lab wording uses DELETE /user/delete/:id

// ------------------------------------------------ error handling
// 1. No route above matched: make a 404 error and pass it on
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 2. The error handler (4 parameters): every next(err) ends up here
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: { message: err.message } });
  }
  if (err.code === 11000) {
    return res.status(400).json({ error: { message: 'Duplicate id: id must be unique.' } });
  }
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// ------------------------------------------------ start
// Connect to MongoDB first; only then start listening for requests
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`UserList API listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
