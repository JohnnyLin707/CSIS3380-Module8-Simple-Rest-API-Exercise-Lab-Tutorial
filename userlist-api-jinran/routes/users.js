const express = require('express');
const User = require('../models/User');

const router = express.Router();

// id in the URL is a string; convert it to a number before querying MongoDB
function parseId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'id must be a number.' });
  }
  req.userId = id;
  next();
}

// Send a GET request to /api/users to READ a list of users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().sort({ id: 1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Send a GET request to /api/users/random to READ (view) a random user
// In the Quote API this had to come before /:id; here the single-user path
// is /user/:id, so there is no clash, but we keep the order as a good habit.
async function getRandomUser(req, res, next) {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      res.status(404).json({ message: 'No users yet.' });
    } else {
      const skip = Math.floor(Math.random() * count);
      const user = await User.findOne().skip(skip);
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
}
router.get('/random', getRandomUser);

// Send a GET request to /api/users/user/:id to READ (view) one user
router.get('/user/:id', parseId, async (req, res, next) => {
  try {
    const user = await User.findOne({ id: req.userId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (err) {
    next(err);
  }
});

// Send a POST request to /api/users/newuser to CREATE a new user
router.post('/newuser', async (req, res, next) => {
  try {
    if (req.body.id !== undefined && req.body.email) {
      const user = await User.create({
        id: Number(req.body.id),
        email: req.body.email,
        username: req.body.username
      });
      res.status(201).json(user);
    } else {
      res.status(400).json({ message: 'id and email are required.' });
    }
  } catch (err) {
    next(err);
  }
});

// Send a PUT request to /api/users/modify/:id to UPDATE (edit) a user's username
// MongoDB tutorial Step 10: return 200 with the updated document
router.put('/modify/:id', parseId, async (req, res, next) => {
  try {
    if (!req.body.username) {
      return res.status(400).json({ message: 'username is required.' });
    }
    const user = await User.findOneAndUpdate(
      { id: req.userId },
      { username: req.body.username },
      { returnDocument: 'after', runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Send a DELETE request to /api/users/delete/:id to DELETE a user
router.delete('/delete/:id', parseId, async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ id: req.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
module.exports.getRandomUser = getRandomUser;
