const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    email: { type: String, required: true, trim: true },
    username: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
