const express = require('express');
const router = express.Router();
const app = express();

const listController = require('../controllers/listController');

// list data
router.get('/:user_id', listController.getAllLists);

// post data
router.post('/:user_id', listController.addList);

// put data
router.put('/:user_id/:list_id', listController.updateList);

// delete data by id
router.delete('/:user_id/:list_id', listController.removeListOwner);

module.exports = router;
