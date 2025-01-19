const express = require('express');
const eventCategoryController = require('../controllers/eventCategoryController');
const verifyToken = require('../utils/middleware');

const router = express.Router();

// Các route cho danh mục sự kiện
router.get('/search', eventCategoryController.searchCategories);
router.post('/', eventCategoryController.createCategory);
router.get('/', eventCategoryController.getAllCategories);
router.get('/:id', eventCategoryController.getCategoryById);
router.put('/:id', eventCategoryController.updateCategory);
router.delete('/:id', eventCategoryController.deleteCategory);

module.exports = router;