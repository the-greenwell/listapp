const express = require('express');
const router = express.Router();
const app = express();
const db = require('../models');

// list data
router.get('/:user_id', function(req, res) {

});

// get data by id
router.get('/:user_id/:list_id', function(req, res, next) {

});

// post data
router.post('/:user_id', function(req, res, next) {
  db.List.create(req.body).then(async list => {
    await list.owners.push(req.params.user_id);
    res.json(list);
  }).catch(err =>{
    res.json(err)
  })
});

// put data
router.put('/:user_id/:list_id', function(req, res, next) {

});

// delete data by id
router.delete('/:user_id/:list_id', function(req, res, next) {

});

module.exports = router;
