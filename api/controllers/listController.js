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
}

exports.getAllLists = async (req,res) => {
  if( verifyUser(req.user, req.params.user_id) ){
    const user = await db.User.findById(req.user.id).populate({path:'lists',populate: {path: 'owners', select: 'name'}, populate: 'content'});
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
    if ( verifyListOwner(req.user.id, req.params.list_id) ) {
      const list = await db.List.findById(
        req.params.list_id,
        async (err, found) => {
          if(err) {res.json(err)}
          var u = found.owners.includes(req.user.id);
          if(u){
            found.title = req.body.title,
            await found.save().then(saved => {
              res.json(saved);
            }).catch(err => {
              res.json(err)
            });
          } else {
            res.send('invalid list');
          };
        });
    } else {
      res.send('no permission')
    };
  } else {
    res.send('invalid user');
  };
};

exports.removeListOwner = async (req,res) => {
  if (verifyUser(req.user, req.params.user_id)) {
    if ( verifyListOwner(req.user.id, req.params.list_id) ) {
      const list = await db.User.findByIdAndUpdate(
        req.user.id,
        {$pull: {lists: req.params.list_id}},
        async (err, user) => {
          if(err) {res.json(err)}
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
      res.send('no permission')
    };
  } else {
    res.send('invalid user')
  };
};

exports.addListItem = async (req,res) => {
  if (verifyUser(req.user, req.params.user_id)) {
    if ( verifyListOwner(req.user.id, req.params.list_id) ) {
      const list = await db.User.findById(
        req.user.id,
        async (err, user) => {
          if(err) {res.json(err)}
          var l = user.lists.includes(req.params.list_id);
          var i = await itemController.addItem(req.body,req.params.list_id);
          if(l){
              res.json(i)
            } else {
              res.send('invalid list');
            };
        });
    } else {
      res.send('no permission')
    };
  } else {
    res.send('invalid user');
  };
}

exports.updateListItem = async (req,res) => {
  if (verifyUser(req.user, req.params.user_id)) {
    if ( verifyListOwner(req.user.id, req.params.list_id) ) {
      var i = await itemController.updateItem(req.params.item_id, req.body);
      res.json(i);
    } else {
      res.send('no permission')
    };
  } else {
    res.send('invalid user');
  };
}

exports.removeListItem = async (req,res) => {
  if (verifyUser(req.user, req.params.user_id)) {
    if ( verifyListOwner(req.user.id, req.params.list_id) ) {
      await itemController.removeItem(req.params.item_id, req.params.list_id)
        .then(res.send('item removed'))
        .catch(err=> {res.json(err)});
    } else {
      res.send('no permission')
    };
  } else {
    res.send('invalid user');
  };
}
