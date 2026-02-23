const express = require('express');
const router = express.Router({ mergeParams: true });
const bucketController = require('../controllers/bucketController');

// Bucket item routes
router.post('/', bucketController.addItem);
router.post('/:itemId/toggle', bucketController.toggleItem);
router.post('/:itemId/delete', bucketController.deleteItem);

module.exports = router;
