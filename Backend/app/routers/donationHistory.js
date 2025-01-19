const express = require('express');
const donationHistoryController = require('../controllers/DonationHistoryController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Các route cho lịch sử quyên góp
router.get('/search', donationHistoryController.searchDonationHistories);
router.post('/', donationHistoryController.createDonationHistory);
router.get('/', donationHistoryController.getAllDonationHistories);
router.get('/:id', donationHistoryController.getDonationHistoryById);
router.put('/:id', donationHistoryController.updateDonationHistory);
router.delete('/:id', donationHistoryController.deleteDonationHistory);

module.exports = router;