const mongoose = require('mongoose');

const Item = new mongoose.Schema({
  title : {
    type: String,
    required: true
  },
  link : {
    type: String,
    required: true
  },
  date: {
   type: Date,
   default: Date.now
 },
 color: {
   type: String,
   default: 'color-8'
 },
 owner: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User'
 }
});

module.exports = mongoose.model('Item', Item);
