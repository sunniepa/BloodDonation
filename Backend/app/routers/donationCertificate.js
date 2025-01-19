const express = require('express');
const donationCertificateController = require('../controllers/DonationCertificateController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Các route cho chứng nhận quyên góp
router.get('/search', donationCertificateController.searchDonationCertificates);
router.post('/', donationCertificateController.createDonationCertificate);
router.get('/', donationCertificateController.getAllDonationCertificates);
router.get('/:id', donationCertificateController.getDonationCertificateById);
router.put('/:id', donationCertificateController.updateDonationCertificate);
router.delete('/:id', donationCertificateController.deleteDonationCertificate);

module.exports = router;