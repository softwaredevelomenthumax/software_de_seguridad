const express = require('express');

const {
  registerExit,
  deleteEntry,
} = require('../controllers/exitsController');

const router = express.Router();

router.put('/', registerExit);
router.delete('/:id', deleteEntry);

module.exports = router;