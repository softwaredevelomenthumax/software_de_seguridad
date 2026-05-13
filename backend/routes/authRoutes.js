const express = require('express');

const {
  login,
  register,
  getUsers,
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/users', getUsers);

module.exports = router;