const db = require('../config/db');

const giftHistoryController = {
    // Thêm lịch sử quà tặng
    createGiftHistory: async (req, res) => {
        try {
            const { user_id, donation_id, gift_type, gift_description, gift_value, gift_date } = req.body;

            const query = `
                INSERT INTO Gift_History (user_id, donation_id, gift_type, gift_description, gift_value, gift_date)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [user_id, donation_id, gift_type, gift_description, gift_value, gift_date]);

            res.status(201).json({ gift_id: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả lịch sử quà tặng
    getAllGiftHistories: async (req, res) => {
        try {
            const query = 'SELECT * FROM Gift_History';
            const [histories] = await db.execute(query);
            res.status(200).json({ data: histories });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy lịch sử quà tặng theo ID
    getGiftHistoryById: async (req, res) => {
        try {
            const giftId = req.params.id;
            const query = 'SELECT * FROM Gift_History WHERE gift_id = ?';
            const [history] = await db.execute(query, [giftId]);

            if (history.length === 0) {
                return res.status(404).json({ message: 'Gift history not found' });
            }

            res.status(200).json(history[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy lịch sử quà tặng theo user_id
    getGiftHistoriesByUserId: async (req, res) => {
        try {
            const userId = req.params.user_id;
            const query = 'SELECT * FROM Gift_History WHERE user_id = ?';
            const [histories] = await db.execute(query, [userId]);

            if (histories.length === 0) {
                return res.status(404).json({ message: 'No gift histories found for this user' });
            }

            res.status(200).json({ data: histories });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật lịch sử quà tặng
    updateGiftHistory: async (req, res) => {
        try {
            const giftId = req.params.id;
            const { user_id, donation_id, gift_type, gift_description, gift_value, gift_date } = req.body;

            // Chỉ cập nhật các trường có giá trị mới
            const fieldsToUpdate = [];
            const values = [];

            if (user_id !== undefined) {
                fieldsToUpdate.push('user_id = ?');
                values.push(user_id);
            }
            if (donation_id !== undefined) {
                fieldsToUpdate.push('donation_id = ?');
                values.push(donation_id);
            }
            if (gift_type !== undefined) {
                fieldsToUpdate.push('gift_type = ?');
                values.push(gift_type);
            }
            if (gift_description !== undefined) {
                fieldsToUpdate.push('gift_description = ?');
                values.push(gift_description);
            }
            if (gift_value !== undefined) {
                fieldsToUpdate.push('gift_value = ?');
                values.push(gift_value);
            }
            if (gift_date !== undefined) {
                // Convert gift_date to a valid format if necessary
                const formattedDate = new Date(gift_date).toISOString().slice(0, 19).replace('T', ' ');
                fieldsToUpdate.push('gift_date = ?');
                values.push(formattedDate);
            }

            // Nếu không có trường nào để cập nhật
            if (fieldsToUpdate.length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }

            const query = `
                UPDATE Gift_History SET ${fieldsToUpdate.join(', ')}
                WHERE gift_id = ?
            `;
            values.push(giftId);
            const [result] = await db.execute(query, values);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Gift history not found' });
            }

            res.status(200).json({ message: 'Gift history updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa lịch sử quà tặng
    deleteGiftHistory: async (req, res) => {
        try {
            const giftId = req.params.id;
            const query = 'DELETE FROM Gift_History WHERE gift_id = ?';
            const [result] = await db.execute(query, [giftId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Gift history not found' });
            }

            res.status(200).json({ message: 'Gift history deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm lịch sử quà tặng
    searchGiftHistories: async (req, res) => {
        try {
            const searchTerm = req.query.gift_type || '';
            const query = 'SELECT * FROM Gift_History WHERE gift_type LIKE ?';
            const [histories] = await db.execute(query, [`%${searchTerm}%`]);

            res.status(200).json({ data: histories });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = giftHistoryController;