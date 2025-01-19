const db = require('../config/db');

const medicalStaffController = {
    // Lấy tất cả nhân viên y tế
    getAllMedicalStaff: async (req, res) => {
        try {
            const query = 'SELECT * FROM Medical_Staff';
            const [staff] = await db.execute(query);
            res.status(200).json(staff);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch medical staff', error });
        }
    },

    // Tạo nhân viên y tế mới
    createMedicalStaff: async (req, res) => {
        const { full_name, phone_number, role, hospital_id, profile_picture, account_id } = req.body;
        const query = `
            INSERT INTO Medical_Staff (full_name, phone_number, role, hospital_id, profile_picture, account_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        try {
            await db.execute(query, [full_name, phone_number, role, hospital_id, profile_picture, account_id]);
            res.status(201).json({ message: 'Medical staff created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create medical staff', error });
        }
    },

    // Cập nhật thông tin nhân viên y tế
    updateMedicalStaff: async (req, res) => {
        const { staff_id } = req.params;
        const { full_name, phone_number, role, hospital_id, profile_picture, account_id } = req.body;
        let query = 'UPDATE Medical_Staff SET ';
        let params = [];
        if (full_name) {
            query += 'full_name = ?, ';
            params.push(full_name);
        }
        if (phone_number) {
            query += 'phone_number = ?, ';
            params.push(phone_number);
        }
        if (role) {
            query += 'role = ?, ';
            params.push(role);
        }
        if (hospital_id) {
            query += 'hospital_id = ?, ';
            params.push(hospital_id);
        }
        if (profile_picture) {
            query += 'profile_picture = ?, ';
            params.push(profile_picture);
        }
        if (account_id) {
            query += 'account_id = ?, ';
            params.push(account_id);
        }
        query = query.slice(0, -2); // Remove the last comma and space
        query += ' WHERE staff_id = ?';
        params.push(staff_id);
        try {
            const [result] = await db.execute(query, params);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Medical staff not found' });
            }
            res.status(200).json({ message: 'Medical staff updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update medical staff', error });
        }
    },

    // Xóa nhân viên y tế
    deleteMedicalStaff: async (req, res) => {
        const { staff_id } = req.params;
        const query = 'DELETE FROM Medical_Staff WHERE staff_id = ?';
        try {
            const [result] = await db.execute(query, [staff_id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Medical staff not found' });
            }
            res.status(200).json({ message: 'Medical staff deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete medical staff', error });
        }
    },

    // Tìm kiếm nhân viên y tế
    searchMedicalStaff: async (req, res) => {
        const searchTerm = req.query.full_name || '';
        const query = `
            SELECT * FROM Medical_Staff 
            WHERE full_name LIKE ? OR phone_number LIKE ? OR role LIKE ?
        `;
        try {
            const [staff] = await db.execute(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
            res.status(200).json({ data: staff });
        } catch (error) {
            res.status(500).json({ message: 'Failed to search medical staff', error });
        }
    },

    // Lấy thông tin nhân viên y tế theo ID
    getMedicalStaffById: async (req, res) => {
        const { staff_id } = req.params;
        const query = 'SELECT * FROM Medical_Staff WHERE staff_id = ?';
        try {
            const [staff] = await db.execute(query, [staff_id]);
            if (staff.length === 0) {
                return res.status(404).json({ message: 'Medical staff not found' });
            }
            res.status(200).json(staff[0]);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch medical staff', error });
        }
    },
};

module.exports = medicalStaffController; 