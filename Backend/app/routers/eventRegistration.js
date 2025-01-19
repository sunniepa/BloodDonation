const express = require('express');
const eventRegistrationController = require('../controllers/EventRegistrationController');

const router = express.Router();

// Các route cho đăng ký sự kiện

router.put('/status/:id', eventRegistrationController.updateStatus); // Cập nhật trạng thái đăng ký
router.post('/', eventRegistrationController.createRegistration); // Tạo đăng ký
router.get('/:id', eventRegistrationController.getRegistrationById); // Lấy đăng ký theo ID
router.put('/:id', eventRegistrationController.updateRegistration); // Cập nhật đăng ký
router.get('/', eventRegistrationController.getAllRegistrations); // Lấy tất cả đăng ký
router.get('/event/:event_id', eventRegistrationController.getRegistrationsByEventId); // Lấy đăng ký theo event_id
router.get('/user/:user_id', eventRegistrationController.getRegistrationsByUserId); // Lấy đăng ký theo user_id
router.delete('/:id', eventRegistrationController.deleteRegistration); // Xóa đăng ký
router.get('/event/details/:event_id', eventRegistrationController.getRegistrationsWithDetailsByEventId); // Lấy đăng ký theo event_id với đầy đủ thông tin

module.exports = router; 