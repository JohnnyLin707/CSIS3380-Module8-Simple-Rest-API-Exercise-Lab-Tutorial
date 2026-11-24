const express = require('express');
const User = require('../models/User');

const router = express.Router();

function parseId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: { message: 'id must be a number.' } });
  }
  req.userId = id;
  next();
}

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().sort({ id: 1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/user/:id', parseId, async (req, res, next) => {
  try {
    const user = await User.findOne({ id: req.userId });
    if (!user) return res.status(404).json({ error: { message: 'User not found.' } });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/random', async (req, res, next) => {
  try {
    const count = await User.countDocuments();
    if (count === 0) return res.status(404).json({ error: { message: 'No users yet.' } });
    const skip = Math.floor(Math.random() * count);
    const user = await User.findOne().skip(skip);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/newuser', async (req, res, next) => {
  try {
    const { id, email, username } = req.body;
    if (id === undefined || !email) {
      return res.status(400).json({ error: { message: 'id and email are required.' } });
    }
    const user = await User.create({ id: Number(id), email, username });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/modify/:id', parseId, async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: { message: 'username is required.' } });
    }
    const user = await User.findOneAndUpdate(
      { id: req.userId },
      { username },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: { message: 'User not found.' } });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete('/delete/:id', parseId, async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ id: req.userId });
    if (!user) return res.status(404).json({ error: { message: 'User not found.' } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
