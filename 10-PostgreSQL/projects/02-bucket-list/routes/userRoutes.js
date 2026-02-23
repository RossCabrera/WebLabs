const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.get('/', userController.listUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.showDashboard);

module.exports = router;
