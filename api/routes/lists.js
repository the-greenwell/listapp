const express = require('express');
const router = express.Router();

const listController = require('../controllers/listController');

// get list
router.get('/:user_id', listController.getAllLists);

// post list
router.post('/:user_id', listController.addList);

// put list
router.put('/:user_id/:list_id', listController.updateList);

// delete list
router.delete('/:user_id/:list_id', listController.removeListOwner);

// post list item
router.post('/:user_id/:list_id', listController.addListItem);

// put list item
router.put('/:user_id/:list_id/:item_id', listController.updateListItem);

// delete list item
router.delete('/:user_id/:list_id/:item_id', listController.removeListItem);

module.exports = router;
