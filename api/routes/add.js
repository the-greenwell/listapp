const express = require('express');
const router = express.Router();

const listController = require('../controllers/listController');

// add list owner
router.post('/:sender_id/:user_id/:list_id/', listController.addListOwner);

module.exports = router;
