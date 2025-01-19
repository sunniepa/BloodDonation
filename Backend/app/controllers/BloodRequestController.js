const db = require('../config/db');

const bloodRequestController = {
    // Thêm yêu cầu máu
    createBloodRequest: async (req, res) => {
        try {
            const { hospital_id, blood_type, requested_quantity, status } = req.body;

            const query = `
                INSERT INTO Blood_Request (hospital_id, blood_type, requested_quantity, status)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [hospital_id, blood_type, requested_quantity, status]);

            res.status(201).json({ request_id: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả yêu cầu máu
    getAllBloodRequests: async (req, res) => {
        try {
            const query = 'SELECT * FROM Blood_Request';
            const [requests] = await db.execute(query);
            res.status(200).json({ data: requests });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy yêu cầu máu theo ID
    getBloodRequestById: async (req, res) => {
        try {
            const requestId = req.params.id;
            const query = 'SELECT * FROM Blood_Request WHERE request_id = ?';
            const [request] = await db.execute(query, [requestId]);

            if (request.length === 0) {
                return res.status(404).json({ message: 'Blood request not found' });
            }

            res.status(200).json(request[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật yêu cầu máu
    updateBloodRequest: async (req, res) => {
        try {
            const requestId = req.params.id;
            const { hospital_id, blood_type, requested_quantity, status } = req.body;
            let query = 'UPDATE Blood_Request SET ';
            const queryParams = [];

            if (hospital_id) {
                query += 'hospital_id = ?, ';
                queryParams.push(hospital_id);
            }
            if (blood_type) {
                query += 'blood_type = ?, ';
                queryParams.push(blood_type);
            }
            if (requested_quantity) {
                query += 'requested_quantity = ?, ';
                queryParams.push(requested_quantity);
            }
            if (status) {
                query += 'status = ?, ';
                queryParams.push(status);
            }

            query = query.slice(0, -2); // Remove the last comma and space
            query += ' WHERE request_id = ?';
            queryParams.push(requestId);

            const [result] = await db.execute(query, queryParams);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Blood request not found' });
            }

            res.status(200).json({ message: 'Blood request updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật trạng thái yêu cầu máu
    updateBloodRequestStatus: async (req, res) => {
        try {
            const requestId = req.params.id;
            const { status } = req.body;

            const query = 'UPDATE Blood_Request SET status = ? WHERE request_id = ?';
            const [result] = await db.execute(query, [status, requestId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Blood request not found' });
            }

            res.status(200).json({ message: 'Blood request status updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa yêu cầu máu
    deleteBloodRequest: async (req, res) => {
        try {
            const requestId = req.params.id;
            const query = 'DELETE FROM Blood_Request WHERE request_id = ?';
            const [result] = await db.execute(query, [requestId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Blood request not found' });
            }

            res.status(200).json({ message: 'Blood request deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm yêu cầu máu
    searchBloodRequests: async (req, res) => {
        try {
            const searchTerm = req.query.blood_type || '';
            const query = 'SELECT * FROM Blood_Request WHERE blood_type LIKE ?';
            const [requests] = await db.execute(query, [`%${searchTerm}%`]);

            res.status(200).json({ data: requests });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = bloodRequestController;