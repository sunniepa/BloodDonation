const express = require('express');
const donorProfileController = require('../controllers/DonorProfileController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Các route cho hồ sơ người hiến máu
router.get('/user/:user_id', donorProfileController.getDonorProfileByUserId);
router.get('/search', donorProfileController.searchDonorProfiles);
router.post('/', donorProfileController.createDonorProfile);
router.get('/', donorProfileController.getAllDonorProfiles);
router.get('/:id', donorProfileController.getDonorProfileById);
router.put('/:id', donorProfileController.updateDonorProfile);
router.delete('/:id', donorProfileController.deleteDonorProfile);

module.exports = router;