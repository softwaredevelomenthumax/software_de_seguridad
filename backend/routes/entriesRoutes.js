const express = require('express');

const {
  getEntries,
  createEntry,
  deleteEntry,
} = require('../controllers/entriesController');

const router = express.Router();

router.get('/', getEntries);
router.post('/', createEntry);
router.delete('/:id', deleteEntry);


module.exports = router;