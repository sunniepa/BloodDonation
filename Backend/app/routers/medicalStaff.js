const express = require('express');
const router = express.Router();
const medicalStaffController = require('../controllers/MedicalStaffController');

router.get('/search', medicalStaffController.searchMedicalStaff);
router.get('/', medicalStaffController.getAllMedicalStaff);
router.post('/', medicalStaffController.createMedicalStaff);
router.put('/:staff_id', medicalStaffController.updateMedicalStaff);
router.delete('/:staff_id', medicalStaffController.deleteMedicalStaff);
router.get('/:staff_id', medicalStaffController.getMedicalStaffById);

module.exports = router; 