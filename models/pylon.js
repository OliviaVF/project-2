const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const pylonSchema = new mongoose.Schema({
  name: { type: String, required: true},
  category: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String, required: true },
  tel: { type: String, required: true },
  comments: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Pylon', pylonSchema);
