var db = require('../models');

exports.addItem = async (item_body,list_id,user_id) => {
  return db.Item.create(item_body).then(async newItem => {
    var i = await db.Item.findOneAndUpdate(
      {_id: newItem._id},
      {owner: user_id},
      { new: true, useFindAndModify: false }).populate('owner', '_id');
    await db.List.findOneAndUpdate(
      {_id: list_id},
      {$addToSet: {content: newItem._id}},
      { useFindAndModify: false });
    return i;
  })
};

exports.updateItem = (item_id,item_body,user_id) => {
  return db.Item.findOneAndUpdate(
    {_id: item_id, owner: user_id},
    {$set: item_body},
    { new: true, useFindAndModify: false },
    (err,item) => {
      return (err ? `error: ${err}` : item);
    }).populate('owner', '_id');
};

exports.removeItem = async (item_id,list_id,user_id) => {
  var l = await db.List.findOneAndUpdate(
    {_id: list_id, 'content': {$lte: item_id}},
    {$pull: {content: item_id}},
    { new: true, useFindAndModify: false });
  try {
    await db.Item.findOneAndDelete({_id: item_id, owner: user_id});
  } catch (err) {
    return (err.toString());
  }
  if (l == null) { l = 'item not found'}
  return l;
};
