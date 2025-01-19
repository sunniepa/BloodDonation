const db = require('../config/db');

const reportsController = {
    // Thêm báo cáo
    createReport: async (req, res) => {
        try {
            const { user_id, total_donors, successful_donations, failed_donations, urgent_responses, blood_type_distribution, health_status_distribution } = req.body;

            const query = `
                INSERT INTO Reports (user_id, total_donors, successful_donations, failed_donations, urgent_responses, blood_type_distribution, health_status_distribution)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [user_id, total_donors, successful_donations, failed_donations, urgent_responses, blood_type_distribution, health_status_distribution]);

            res.status(201).json({ report_id: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả báo cáo
    getAllReports: async (req, res) => {
        try {
            const query = 'SELECT * FROM Reports';
            const [reports] = await db.execute(query);
            res.status(200).json({ data: reports });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy báo cáo theo ID
    getReportById: async (req, res) => {
        try {
            const reportId = req.params.id;
            const query = 'SELECT * FROM Reports WHERE report_id = ?';
            const [report] = await db.execute(query, [reportId]);

            if (report.length === 0) {
                return res.status(404).json({ message: 'Report not found' });
            }

            res.status(200).json(report[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy báo cáo theo user_id
    getReportsByUserId: async (req, res) => {
        try {
            const userId = req.params.user_id;
            const query = 'SELECT * FROM Reports WHERE user_id = ?';
            const [reports] = await db.execute(query, [userId]);

            if (reports.length === 0) {
                return res.status(404).json({ message: 'No reports found for this user' });
            }

            res.status(200).json({ data: reports });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật báo cáo
    updateReport: async (req, res) => {
        try {
            const reportId = req.params.id;
            const { total_donors, successful_donations, failed_donations, urgent_responses, blood_type_distribution, health_status_distribution } = req.body;

            const query = `
                UPDATE Reports SET total_donors = ?, successful_donations = ?, failed_donations = ?, urgent_responses = ?, blood_type_distribution = ?, health_status_distribution = ?
                WHERE report_id = ?
            `;
            const [result] = await db.execute(query, [total_donors, successful_donations, failed_donations, urgent_responses, blood_type_distribution, health_status_distribution, reportId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Report not found' });
            }

            res.status(200).json({ message: 'Report updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa báo cáo
    deleteReport: async (req, res) => {
        try {
            const reportId = req.params.id;
            const query = 'DELETE FROM Reports WHERE report_id = ?';
            const [result] = await db.execute(query, [reportId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Report not found' });
            }

            res.status(200).json({ message: 'Report deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm báo cáo
    searchReports: async (req, res) => {
        try {
            const searchTerm = req.query.blood_type_distribution || '';
            const query = 'SELECT * FROM Reports WHERE blood_type_distribution LIKE ?';
            const [reports] = await db.execute(query, [`%${searchTerm}%`]);

            res.status(200).json({ data: reports });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = reportsController;