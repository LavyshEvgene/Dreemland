var mongoose = require('mongoose');
var crypto = require('crypto');
var db = mongoose.connect("mongodb://localhost:27017/dreemland");
var User = require('../models/User.js');

exports.createUser = function (userData) {
  console.log(userData);
  var user = {
    username: userData.username,
    password: hash(userData.password),
    email: userData.email,
    number: userData.number,
    role: userData.role,
    otherOptions: userData.otherOptions
  };
  return new User(user).save();
};

exports.getUser = function (id) {
  return User.findOne(id)
};

exports.checkUser = function (userData) {
  return User.findOne({username: userData.username}).then(function (user) {
    if(user && user.password === hash(userData.password)) {
      console.log("User password is ok");
      return Promise.resolve(user);
    } else {
      return {result: false};
    }
  })
};

function hash(text) {
  return crypto.createHash('sha1').update(text).digest('base64');
}