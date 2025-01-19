const express = require('express');
const reportsController = require('../controllers/ReportsController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Các route cho báo cáo
router.get('/search', reportsController.searchReports);
router.post('/', reportsController.createReport);
router.get('/', reportsController.getAllReports);
router.get('/:id', reportsController.getReportById);
router.put('/:id', reportsController.updateReport);
router.delete('/:id', reportsController.deleteReport);
router.get('/user/:user_id', reportsController.getReportsByUserId);

module.exports = router;