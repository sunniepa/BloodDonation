const express = require('express');
const bloodStorageController = require('../controllers/BloodStorageController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Các route cho kho máu

router.get('/', bloodStorageController.getAllBloodStorages);
router.get('/search', bloodStorageController.searchBloodStorages);
router.post('/', bloodStorageController.createBloodStorage);
router.get('/:id', bloodStorageController.getBloodStorageById);
router.put('/:id', bloodStorageController.updateBloodStorage);
router.delete('/:id', bloodStorageController.deleteBloodStorage);

module.exports = router;