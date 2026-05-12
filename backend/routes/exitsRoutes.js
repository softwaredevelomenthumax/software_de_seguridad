const express = require('express');

const {
  registerExit,
} = require('../controllers/exitsController');

const router = express.Router();

router.put('/', registerExit);

module.exports = router;