const db = require('../config/db');

const donationHistoryController = {
    // Thêm lịch sử quyên góp
    createDonationHistory: async (req, res) => {
        try {
            const { user_id, event_id, donation_date, blood_amount, status, feedback } = req.body;

            // Convert the donation_date to a format compatible with MySQL
            const formattedDate = new Date(donation_date).toISOString().slice(0, 19).replace('T', ' ');

            const query = `
                INSERT INTO Donation_History (user_id, event_id, donation_date, blood_amount, status, feedback)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [user_id, event_id, formattedDate, blood_amount, status, feedback]);

            res.status(201).json({ history_id: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả lịch sử quyên góp
    getAllDonationHistories: async (req, res) => {
        try {
            const query = 'SELECT * FROM Donation_History';
            const [histories] = await db.execute(query);
            res.status(200).json({ data: histories });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy lịch sử quyên góp theo ID
    getDonationHistoryById: async (req, res) => {
        try {
            const historyId = req.params.id;
            const query = 'SELECT * FROM Donation_History WHERE history_id = ?';
            const [history] = await db.execute(query, [historyId]);

            if (history.length === 0) {
                return res.status(404).json({ message: 'Donation history not found' });
            }

            res.status(200).json(history[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật lịch sử quyên góp
    updateDonationHistory: async (req, res) => {
        try {
            const historyId = req.params.id;
            const { user_id, event_id, donation_date, blood_amount, status, feedback } = req.body;

            const query = `
                UPDATE Donation_History SET user_id = ?, event_id = ?, donation_date = ?, blood_amount = ?, status = ?, feedback = ?
                WHERE history_id = ?
            `;
            const [result] = await db.execute(query, [user_id, event_id, donation_date, blood_amount, status, feedback, historyId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Donation history not found' });
            }

            res.status(200).json({ message: 'Donation history updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa lịch sử quyên góp
    deleteDonationHistory: async (req, res) => {
        try {
            const historyId = req.params.id;
            const query = 'DELETE FROM Donation_History WHERE history_id = ?';
            const [result] = await db.execute(query, [historyId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Donation history not found' });
            }

            res.status(200).json({ message: 'Donation history deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm lịch sử quyên góp
    searchDonationHistories: async (req, res) => {
        try {
            const searchTerm = req.query.feedback || '';
            const query = 'SELECT * FROM Donation_History WHERE feedback LIKE ?';
            const [histories] = await db.execute(query, [`%${searchTerm}%`]);

            res.status(200).json({ data: histories });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = donationHistoryController;