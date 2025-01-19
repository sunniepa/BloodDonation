const db = require('../config/db');

const bloodStorageController = {
    // Thêm kho máu
    createBloodStorage: async (req, res) => {
        try {
            const { hospital_id, blood_type, quantity, expiry_date } = req.body;

            const query = `
                INSERT INTO Blood_Storage (hospital_id, blood_type, quantity, expiry_date)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [hospital_id, blood_type, quantity, expiry_date]);

            res.status(201).json({ storage_id: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả kho máu
    getAllBloodStorages: async (req, res) => {
        try {
            const query = 'SELECT * FROM Blood_Storage';
            const [storages] = await db.execute(query);
            res.status(200).json({ data: storages });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy kho máu theo ID
    getBloodStorageById: async (req, res) => {
        try {
            const storageId = req.params.id;
            const query = 'SELECT * FROM Blood_Storage WHERE storage_id = ?';
            const [storage] = await db.execute(query, [storageId]);

            if (storage.length === 0) {
                return res.status(404).json({ message: 'Blood storage not found' });
            }

            res.status(200).json(storage[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật kho máu
    updateBloodStorage: async (req, res) => {
        try {
            const storageId = req.params.id;
            const { hospital_id, blood_type, quantity, expiry_date } = req.body;

            let query = 'UPDATE Blood_Storage SET ';
            const queryParams = [];

            if (hospital_id) {
                query += 'hospital_id = ?, ';
                queryParams.push(hospital_id);
            }
            if (blood_type) {
                query += 'blood_type = ?, ';
                queryParams.push(blood_type);
            }
            if (quantity) {
                query += 'quantity = ?, ';
                queryParams.push(quantity);
            }
            if (expiry_date) {
                query += 'expiry_date = ?, ';
                queryParams.push(expiry_date);
            }

            query = query.slice(0, -2); // Remove the last comma and space
            query += ' WHERE storage_id = ?';
            queryParams.push(storageId);

            const [result] = await db.execute(query, queryParams);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Blood storage not found' });
            }

            res.status(200).json({ message: 'Blood storage updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa kho máu
    deleteBloodStorage: async (req, res) => {
        try {
            const storageId = req.params.id;
            const query = 'DELETE FROM Blood_Storage WHERE storage_id = ?';
            const [result] = await db.execute(query, [storageId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Blood storage not found' });
            }

            res.status(200).json({ message: 'Blood storage deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm kho máu
    searchBloodStorages: async (req, res) => {
        try {
            const searchTerm = req.query.blood_type || '';
            const query = 'SELECT * FROM Blood_Storage WHERE blood_type LIKE ?';
            const [storages] = await db.execute(query, [`%${searchTerm}%`]);

            res.status(200).json({ data: storages });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = bloodStorageController;