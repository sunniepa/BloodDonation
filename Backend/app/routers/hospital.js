const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

router.get('/search', hospitalController.searchHospitals);
router.get('/', hospitalController.getAllHospitals);
router.post('/', hospitalController.createHospital);
router.put('/:hospital_id', hospitalController.updateHospital);
router.delete('/:hospital_id', hospitalController.deleteHospital);
router.get('/:hospital_id', hospitalController.getHospitalById);

module.exports = router; 