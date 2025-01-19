const db = require('../config/db');

const donorProfileController = {
    // Thêm hồ sơ người hiến máu
    createDonorProfile: async (req, res) => {
        try {
            const {
                user_id,
                weight = 0,
                height = 0,
                blood_pressure = 'N/A',
                hemoglobin_level = 'N/A',
                medical_history = 'None',
                last_donation_date = null,
                is_eligible = false,
                profile_picture = 'default.jpg'
            } = req.body;

            const query = `
                INSERT INTO Donor_Profile (user_id, weight, height, blood_pressure, hemoglobin_level, medical_history, last_donation_date, is_eligible, profile_picture)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [user_id, weight, height, blood_pressure, hemoglobin_level, medical_history, last_donation_date, is_eligible, profile_picture]);

            res.status(201).json({ profile_id: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả hồ sơ người hiến máu
    getAllDonorProfiles: async (req, res) => {
        try {
            const query = 'SELECT * FROM Donor_Profile';
            const [profiles] = await db.execute(query);
            res.status(200).json({ data: profiles });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy hồ sơ người hiến máu theo ID
    getDonorProfileById: async (req, res) => {
        try {
            const profileId = req.params.id;
            const query = 'SELECT * FROM Donor_Profile WHERE profile_id = ?';
            const [profile] = await db.execute(query, [profileId]);

            if (profile.length === 0) {
                return res.status(404).json({ message: 'Donor profile not found' });
            }

            res.status(200).json(profile[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy hồ sơ người hiến máu theo user_id
    getDonorProfileByUserId: async (req, res) => {
        try {
            const userId = req.params.user_id;
            const query = 'SELECT * FROM Donor_Profile WHERE user_id = ?';
            const [profile] = await db.execute(query, [userId]);

            res.status(200).json(profile[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật hồ sơ người hiến máu
    updateDonorProfile: async (req, res) => {
        try {
            const userId = req.params.id; // Changed from profileId to userId
            const fieldsToUpdate = req.body;
            const validFields = ['user_id', 'weight', 'height', 'blood_pressure', 'hemoglobin_level', 'medical_history', 'last_donation_date', 'is_eligible', 'profile_picture'];
            const setClause = [];
            const values = [];

            validFields.forEach(field => {
                if (fieldsToUpdate[field] !== undefined) {
                    if (field === 'last_donation_date') {
                        // Convert date to a format acceptable by the database
                        const date = new Date(fieldsToUpdate[field]);
                        if (isNaN(date.getTime())) {
                            return res.status(400).json({ message: 'Invalid date format for last_donation_date' });
                        }
                        setClause.push(`${field} = ?`);
                        values.push(date.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
                    } else {
                        setClause.push(`${field} = ?`);
                        values.push(fieldsToUpdate[field]);
                    }
                }
            });

            if (setClause.length === 0) {
                return res.status(400).json({ message: 'No valid fields provided for update' });
            }

            const checkQuery = 'SELECT * FROM Donor_Profile WHERE user_id = ?';
            const [existingProfile] = await db.execute(checkQuery, [userId]);

            if (existingProfile.length === 0) {
                // If no profile exists, insert a new one
                const insertQuery = `INSERT INTO Donor_Profile (${validFields.join(', ')}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const insertValues = validFields.map(field => fieldsToUpdate[field] !== undefined ? fieldsToUpdate[field] : null);
                insertValues[0] = userId; // Ensure user_id is set
                await db.execute(insertQuery, insertValues);
                return res.status(201).json({ message: 'Donor profile created successfully' });
            }

            const query = `UPDATE Donor_Profile SET ${setClause.join(', ')} WHERE user_id = ?`; // Changed from profile_id to user_id
            values.push(userId);

            const [result] = await db.execute(query, values);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Donor profile not found' });
            }

            res.status(200).json({ message: 'Donor profile updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa hồ sơ người hiến máu
    deleteDonorProfile: async (req, res) => {
        try {
            const profileId = req.params.id;
            const query = 'DELETE FROM Donor_Profile WHERE profile_id = ?';
            const [result] = await db.execute(query, [profileId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Donor profile not found' });
            }

            res.status(200).json({ message: 'Donor profile deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm hồ sơ người hiến máu
    searchDonorProfiles: async (req, res) => {
        try {
            const searchTerm = req.query.medical_history || '';
            const query = 'SELECT * FROM Donor_Profile WHERE medical_history LIKE ?';
            const [profiles] = await db.execute(query, [`%${searchTerm}%`]);

            res.status(200).json({ data: profiles });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = donorProfileController;