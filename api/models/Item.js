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
 likes: [],
 color: {
   type: String,
   default: 'color-8'
 }
});

module.exports = mongoose.model('Item', Item);
