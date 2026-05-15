const express = require('express');
const router = express.Router();

const {
  getCollaborators,
  createCollaborator
} = require('../controllers/collaboratorsController');

router.get('/', getCollaborators);

router.post('/', createCollaborator);

module.exports = router;