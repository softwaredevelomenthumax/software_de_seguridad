const express = require('express');

const {
  login,
  register,
  getUsers,
} = require('../controllers/authController');

const router = express.Router();

// ================= LOGIN =================
router.post('/login', login);

// ================= REGISTER =================
router.post('/register', register);

// ================= GET USERS =================
router.get('/users', getUsers);

module.exports = router;