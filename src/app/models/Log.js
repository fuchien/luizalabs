const mongoose = require('mongoose');

const Log = new mongoose.Schema({
  gameId: {
    type: Number,
    required: true,
  },
  total_kills: {
    type: Number,
    required: true,
  },
  players: {
    type: Array,
    required: true,
  },
  kills: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Log', Log);
