const router = require("express").Router();
const userController = require('../controllers/userController');

// Register User
router.post("/register", userController.register);
// Log User In
router.post('/login', userController.login);

module.exports = router;
