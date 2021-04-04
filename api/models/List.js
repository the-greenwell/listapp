const mongoose = require('mongoose');
const Item = require('./Item').schema;

const List = mongoose.model(
  'List',
  new mongoose.Schema({
    title : {
      type: String,
      required: true
    },
    content: [Item],
    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    date: {
     type: Date,
     default: Date.now
    }
  })
)

module.exports = List;
