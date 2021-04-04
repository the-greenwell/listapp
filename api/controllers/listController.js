var db = require('../models');

exports.getAllLists = async (req,res) => {

}

exports.getList = async (req,res) => {

}

const listOwnership = async (user,list)=> {
  await db.List.findByIdAndUpdate(
    list._id,
    { $push: { owners: user } },
    { new: true, useFindAndModify: false }
  ).populate('owners','name');
  var u = await db.User.findByIdAndUpdate(
    user,
    { $push: { lists: list._id } },
    { new: true, useFindAndModify: false }
  ).populate('lists');

  return u;
};

exports.addList = async (req,res) => {
  const list = await db.List.create(req.body).then(newList => {
    return listOwnership(req.params.user_id, newList);
  });

  console.log(list);
  res.json(list);
}

exports.updateList = async (req,res) => {

}

exports.removeListOwner = async (req,res) => {

}
