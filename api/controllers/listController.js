var db = require('../models');

const verifyUser = (user, params) => {
  return (user.id == params ? true : false);
};

exports.getAllLists = async (req,res) => {
  if( verifyUser(req.user, req.params.user_id) ){
    const user = await db.User.findById(req.user.id).populate({path:'lists',populate: {path: 'owners', select: 'name'}});
    res.json(user.lists);
  } else {
    res.send('invalid user')
  };
};

exports.addList = async (req,res) => {
  const listOwnership = (user,list) => {
    return db.List.findByIdAndUpdate(
      list._id,
      { $push: { owners: user } },
      { new: true, useFindAndModify: false }
    ).populate('owners','name');
  };
  if ( verifyUser(req.user, req.params.user_id) ) {
    const list = await db.List.create(req.body).then(async newList => {
      await db.User.findByIdAndUpdate(
        req.user.id,
        { $push: { lists: newList._id } },
        { new: true, useFindAndModify: false }
      );
      return listOwnership(req.user.id, newList);
    });
    res.json(list);
  } else {
    res.send('invalid user')
  };
};

exports.updateList = async (req,res) => {
  if ( verifyUser(req.user, req.params.user_id) ) {
    const list = await db.User.findById(
      req.user.id,
      async (err, user) => {
        if(err) {res.json(err)}
        var l = user.lists.includes(req.params.list_id);
        if(l){
          await db.List.findOneAndUpdate(
            {_id: req.params.list_id},
            {$set: req.body},
            {new: true},
            (err,list) => {
              if(err) res.json(err);
              else    res.json(list);
            }
          );
        } else {
          res.send('invalid list')
        }
      }
    )
  } else {
    res.send('invalid user')
  };
};

exports.removeListOwner = async (req,res) => {
  if ( verifyUser(req.user, req.params.user_id) ) {

  } else {
    res.send('invalid user')
  };
};
