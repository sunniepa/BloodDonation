const express = require('express');
const bloodRequestController = require('../controllers/BloodRequestController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Các route cho yêu cầu máu
router.get('/search', bloodRequestController.searchBloodRequests);
router.post('/', bloodRequestController.createBloodRequest);
router.get('/', bloodRequestController.getAllBloodRequests);
router.get('/:id', bloodRequestController.getBloodRequestById);
router.put('/:id', bloodRequestController.updateBloodRequest);
router.put('/status/:id', bloodRequestController.updateBloodRequestStatus); // Added route for updating blood request status
router.delete('/:id', bloodRequestController.deleteBloodRequest);

module.exports = router;