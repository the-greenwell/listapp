var mongoose = require("mongoose");

var UserSchema = mongoose.model(
  'User',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    username: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
      }
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  })
);

module.exports = UserSchema;
