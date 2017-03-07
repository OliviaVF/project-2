const mongoose = require('mongoose');

const pylonSchema = new mongoose.Schema({
  name: { type: String, required: true},
  category: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String, required: true },
  tel: { type: String, required: true },
  lat: { type: String, required: true },
  lng: { type: String, required: true },
  comments: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
});

pylonSchema.methods.ownedBy = function pylonOwnedBy(user) {
  return this.createdBy.id === user.id;
};

module.exports = mongoose.model('Pylon', pylonSchema);
