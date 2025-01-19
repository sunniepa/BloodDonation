const express = require('express');
const giftHistoryController = require('../controllers/GiftHistoryController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Các route cho lịch sử quà tặng
router.get('/search', giftHistoryController.searchGiftHistories);
router.post('/', giftHistoryController.createGiftHistory);
router.get('/', giftHistoryController.getAllGiftHistories);
router.get('/:id', giftHistoryController.getGiftHistoryById);
router.put('/:id', giftHistoryController.updateGiftHistory);
router.delete('/:id', giftHistoryController.deleteGiftHistory);
router.get('/user/:userId', giftHistoryController.getGiftHistoriesByUserId);

module.exports = router;