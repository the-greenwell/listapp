const express = require('express');
const router = express.Router();
const app = express();
const db = require('../models');

// post data
router.post('/:list_id', function(req, res, next) {
  
});

// put data
router.put('/:list_id/:item_id', function(req, res, next) {

});

// delete data by id
router.delete('/:list_id/:item_id', function(req, res, next) {

});

module.exports = router;
