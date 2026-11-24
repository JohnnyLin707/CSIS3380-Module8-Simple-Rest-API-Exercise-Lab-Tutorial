require('dotenv').config({ quiet: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'UserList API - Johnny, Douglas College' });
});

app.use('/api/users', userRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(400).json({ error: { message: 'Duplicate id: id must be unique.' } });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: { message: err.message } });
  }
  res.status(err.status || 500).json({ error: { message: err.message } });
});

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
