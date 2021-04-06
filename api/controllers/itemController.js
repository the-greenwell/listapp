var db = require('../models');


exports.addItem = async (item_body,list_id) => {
  return db.Item.create(item_body).then(async newItem => {
    await db.List.findOneAndUpdate(
      {_id: list_id},
      {$push: {content: newItem._id}})
    return newItem;
  })
}

exports.updateItem = (item_id,item_body) => {
  return db.Item.findOneAndUpdate(
    {_id: item_id},
    {$set: item_body},
    {new: true},
    (err,item) => {
      return (err ? `error: ${err}` : item);
    })
}

exports.removeItem = async (item_id,list_id) => {
  await db.List.findOneAndUpdate(
    {'content._id': {$lte: list_id}},
    {$pull: {content: item_id}})
  await db.Item.findOneAndDelete({_id: item_id})
  return 'item deleted';
}
