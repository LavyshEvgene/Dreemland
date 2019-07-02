var mongoose = require('mongoose');
var User = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  otherOptions: {
    type: Array,
    required: false
  }
});

module.exports = mongoose.model('User', User);