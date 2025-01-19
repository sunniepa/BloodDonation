const db = require('../config/db');

const eventCategoryController = {
    // Thêm danh mục sự kiện
    createCategory: async (req, res) => {
        try {
            const { category_name } = req.body;
            const query = `INSERT INTO Event_Category (category_name) VALUES (?)`;
            const [result] = await db.execute(query, [category_name]);
            res.status(201).json({ category_id: result.insertId, category_name });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả danh mục sự kiện
    getAllCategories: async (req, res) => {
        try {
            const query = 'SELECT * FROM Event_Category';
            const [categories] = await db.execute(query);
            res.status(200).json({ data: categories });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy danh mục sự kiện theo ID
    getCategoryById: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const query = 'SELECT * FROM Event_Category WHERE category_id = ?';
            const [category] = await db.execute(query, [categoryId]);

            if (category.length === 0) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json(category[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật danh mục sự kiện
    updateCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const { category_name } = req.body;

            const query = `UPDATE Event_Category SET category_name = ? WHERE category_id = ?`;
            const [result] = await db.execute(query, [category_name, categoryId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json({ message: 'Category updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa danh mục sự kiện
    deleteCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const query = 'DELETE FROM Event_Category WHERE category_id = ?';
            const [result] = await db.execute(query, [categoryId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm danh mục sự kiện
    searchCategories: async (req, res) => {
        try {
            const searchTerm = req.query.category_name || '';
            const query = 'SELECT * FROM Event_Category WHERE category_name LIKE ?';
            const [categories] = await db.execute(query, [`%${searchTerm}%`]);

            res.status(200).json({ data: categories });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = eventCategoryController;