const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: {
    type: String,
    require: true
  },
  reference_value: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  seq: {
    type: Number,
    require: true
  },
});

const Counter = mongoose.model('Counter', schema);

module.exports = Counter;