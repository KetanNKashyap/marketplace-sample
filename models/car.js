var mongoose = require('mongoose');

var Car = mongoose.model('Car', {
  build: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  model: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  year: {
    type: String,
    default: null
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  featured: {
    type: Boolean,
    default: null
  },
  start: {
    type: String,
    default: null
  },
  end: {
    type: String,
    default: null
  }
});

module.exports = {Car};
