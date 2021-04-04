const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

exports.register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if(error) {
    return res.status(400).json({error: error.details[0].message});
  }
  const usernameExists = await db.User.findOne({ username: req.body.username });
  if (usernameExists){
    return res.status(400).json({ error: "Username already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt)
  const user = new db.User({
    name: req.body.name,
    username: req.body.username,
    password: password,
  });
  try {
    const savedUser = await user.save();
    res.json({ error: null, data: { userId: savedUser._id } });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if(error) {
    return res.status(400).json({error: error.details[0].message});
  }
  const user = await db.User.findOne({ username: req.body.username });
  console.log(user.lists)
  if(!user) {
    return res.status(400).json({ error: 'Username is wrong *CHANGE BEFOROE DEPLOY*'});
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "Password is wrong *CHANGE BEFOROE DEPLOY*" });
  }
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.SECRET, { expiresIn: '45m'});
    res.json({
      auth_token: token,
      userId: user._id,
    });
};
