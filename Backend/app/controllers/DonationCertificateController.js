const db = require('../config/db');

const donationCertificateController = {
    // Thêm chứng nhận quyên góp
    createDonationCertificate: async (req, res) => {
        try {
            const { user_id, donation_id, certificate_date, certificate_number } = req.body;

            const query = `
                INSERT INTO Donation_Certificate (user_id, donation_id, certificate_date, certificate_number)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [user_id, donation_id, certificate_date, certificate_number]);

            res.status(201).json({ certificate_id: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy tất cả chứng nhận quyên góp
    getAllDonationCertificates: async (req, res) => {
        try {
            const query = 'SELECT * FROM Donation_Certificate';
            const [certificates] = await db.execute(query);
            res.status(200).json({ data: certificates });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy chứng nhận quyên góp theo ID
    getDonationCertificateById: async (req, res) => {
        try {
            const certificateId = req.params.id;
            const query = 'SELECT * FROM Donation_Certificate WHERE certificate_id = ?';
            const [certificate] = await db.execute(query, [certificateId]);

            if (certificate.length === 0) {
                return res.status(404).json({ message: 'Donation certificate not found' });
            }

            res.status(200).json(certificate[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật chứng nhận quyên góp
    updateDonationCertificate: async (req, res) => {
        try {
            const certificateId = req.params.id;
            const { user_id, donation_id, certificate_date, certificate_number } = req.body;

            // Validate and format the certificate_date to ensure it's in the correct format
            const formattedDate = new Date(certificate_date);
            if (isNaN(formattedDate.getTime())) {
                return res.status(400).json({ message: 'Invalid date format for certificate_date' });
            }

            const query = `
                UPDATE Donation_Certificate SET user_id = ?, donation_id = ?, certificate_date = ?, certificate_number = ?
                WHERE certificate_id = ?
            `;
            const [result] = await db.execute(query, [user_id, donation_id, formattedDate.toISOString().slice(0, 19).replace('T', ' '), certificate_number, certificateId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Donation certificate not found' });
            }

            res.status(200).json({ message: 'Donation certificate updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa chứng nhận quyên góp
    deleteDonationCertificate: async (req, res) => {
        try {
            const certificateId = req.params.id;
            const query = 'DELETE FROM Donation_Certificate WHERE certificate_id = ?';
            const [result] = await db.execute(query, [certificateId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Donation certificate not found' });
            }

            res.status(200).json({ message: 'Donation certificate deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm chứng nhận quyên góp
    searchDonationCertificates: async (req, res) => {
        try {
            const searchTerm = req.query.certificate_number || '';
            const query = 'SELECT * FROM Donation_Certificate WHERE certificate_number LIKE ?';
            const [certificates] = await db.execute(query, [`%${searchTerm}%`]);

            res.status(200).json({ data: certificates });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = donationCertificateController;