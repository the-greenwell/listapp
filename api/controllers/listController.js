const db = require('../models');
const itemController = require('./itemController');

const verifyUser = (user, params) => {
  return (user.id == params ? true : false);
};

const verifyListOwner = async (user, list) => {
  var verified = false;
  await db.List.find(
    {'owners': {$lte: user}},
    found => {
      verified = found == null ? true : false;
    }
  )
  return verified;
};

const updateListOwnership = async (user,list,sender) => {
  if(sender){
    var l;
    try {
      l = await db.List.findOneAndUpdate(
        {_id: list, 'owners': {$lte: sender}},
        { $addToSet: { owners: user } },
        { new: true, useFindAndModify: false }
      ).populate('owners','name').populate('content');
      await db.User.findOneAndUpdate(
        {_id: user},
        { $addToSet: { lists: l._id } },
        { new: true, useFindAndModify: false }
      );
    } catch (err) {
      return (`error: ${error.toString()}`);
    }
    return l;
  } else {
    var l;
    try {
      l = await db.List.findOneAndUpdate(
        {_id: list},
        { $addToSet: { owners: user } },
        { new: true, useFindAndModify: false }
      ).populate('owners','name').populate('content');
      await db.User.findOneAndUpdate(
        {_id: user},
        { $addToSet: { lists: list } },
        { new: true, useFindAndModify: false }
      );
    } catch (err) {
      return (`error: ${error.toString()}`);
    }
    return l;
  }
};

exports.getAllLists = async (req,res) => {
  if( verifyUser(req.user, req.params.user_id) ){
    var user = await db.User.findById(req.user.id).populate({
        path:'lists',
        populate: {path: 'owners', select: 'name'},
        populate: {path:'content', populate: {path: 'owner', select: 'name'}}
      });
    res.json(user.lists);
  } else {
    res.send('invalid user');
  };
};

exports.addList = async (req,res) => {
  if ( verifyUser(req.user, req.params.user_id) ) {
    var list;
    try {
      list = await db.List.create(req.body).then(async newList => {
        return updateListOwnership(req.user.id, newList._id);
      });
    } catch (err) {
      res.status(400).json({ error: err.toString() });
    }
    res.json(list);
  } else {
    res.send('invalid user');
  };
};

exports.updateList = async (req,res) => {
  if ( verifyUser(req.user, req.params.user_id) ) {
    if ( verifyListOwner(req.user.id, req.params.list_id) ) {
      var list = await db.List.findById(
        req.params.list_id,
        async (err, found) => {
          if(err) {res.status(400).json({ error: err.toString() })}
          found.title = req.body.title;
          found.save().then(saved => {
            res.json(saved);
          }).catch(err => {
            res.json(err)
          });
        });
    } else {
      res.send('invalid permission');
    };
  } else {
    res.send('invalid user');
  };
};

exports.removeListOwner = async (req,res) => {
  if (verifyUser(req.user, req.params.user_id)) {
    if ( verifyListOwner(req.user.id, req.params.list_id) ) {
      var list = await db.User.findByIdAndUpdate(
        req.user.id,
        {$pull: {lists: req.params.list_id}},
        async (err, user) => {
          if(err) {res.status(400).json({ error: err.toString() })}
          var l = user.lists.includes(req.params.list_id);
          if(l){
            await db.List.findOneAndUpdate(
              {_id: req.params.list_id},
              {$pull: {owners: user._id}},
              (err) => {
                if(err) res.json(err);
                else    res.send('list deleted');
              })
            } else {
              res.send('invalid list');
            };
        });
    } else {
      res.send('invalid permission');
    };
  } else {
    res.send('invalid user')
  };
};

exports.addListItem = async (req,res) => {
  if (verifyUser(req.user, req.params.user_id)) {
    if ( verifyListOwner(req.user.id, req.params.list_id) ) {
      var i = await itemController.addItem(req.body,req.params.list_id,req.user.id);
      res.json(i)
    } else {
      res.send('invalid permission');
    };
  } else {
    res.send('invalid user');
  };
};

exports.addListOwner = async (req,res) => {
  if (verifyUser(req.user, req.params.user_id)) {
    var u = await updateListOwnership(req.user.id,req.params.list_id,req.params.sender_id);
    res.json(u)
  } else {
    res.send('invalid user');
  };
};

exports.updateListItem = async (req,res) => {
  if (verifyUser(req.user, req.params.user_id)) {
    if ( verifyListOwner(req.user.id, req.params.list_id) ) {
      var i = await itemController.updateItem(req.params.item_id, req.body, req.user.id);
      res.json(i);
    } else {
      res.send('invalid permission');
    };
  } else {
    res.send('invalid user');
  };
};

exports.removeListItem = async (req,res) => {
  if (verifyUser(req.user, req.params.user_id)) {
    if ( verifyListOwner(req.user.id, req.params.list_id) ) {
      var i = await itemController.removeItem(req.params.item_id, req.params.list_id, req.user.id);
      res.json(i);
    } else {
      res.send('invalid permission');
    };
  } else {
    res.send('invalid user');
  };
};
