const express = require('express');
const router = express.Router();
const userV2Controller = require('../controllers/UserV2Controller');

router.get('/search', userV2Controller.searchUsers);
router.get('/', userV2Controller.getAllUsers);
router.get('/:user_id', userV2Controller.getUserById);
router.post('/', userV2Controller.createUser);
router.put('/:user_id', userV2Controller.updateUser);
router.delete('/:user_id', userV2Controller.deleteUser);

module.exports = router; 