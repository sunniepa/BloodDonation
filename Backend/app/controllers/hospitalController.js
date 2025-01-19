const db = require('../config/db');

// Lấy tất cả bệnh viện
exports.getAllHospitals = async (req, res) => {
    try {
        const query = 'SELECT * FROM Hospital';
        const [hospitals] = await db.execute(query);
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch hospitals', error });
    }
};

// Tìm kiếm bệnh viện
exports.searchHospitals = async (req, res) => {
    const searchQuery = req.query.hospital_name;
    console.log(searchQuery);
    try {
        const query = `SELECT hospital_name FROM Hospital WHERE hospital_name LIKE ?`;
        const [hospitals] = await db.execute(query, [`%${searchQuery}%`]);
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Failed to search hospitals', error });
    }
};

// Tạo bệnh viện mới
exports.createHospital = async (req, res) => {
    const { hospital_name, address, contact_number, blood_storage, account_id } = req.body;
    const query = `
        INSERT INTO Hospital (hospital_name, address, contact_number, blood_storage, account_id)
        VALUES (?, ?, ?, ?, ?)
    `;
    try {
        await db.execute(query, [hospital_name, address, contact_number, blood_storage, account_id]);
        res.status(201).json({ message: 'Hospital created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create hospital', error });
    }
};

// Cập nhật thông tin bệnh viện
exports.updateHospital = async (req, res) => {
    const { hospital_id } = req.params;
    const updates = req.body;
    let query = 'UPDATE Hospital SET ';
    let values = [];
    for (let key in updates) {
        query += `${key} = ?, `;
        values.push(updates[key]);
    }
    query = query.slice(0, -2); // Remove the last comma and space
    query += ' WHERE hospital_id = ?';
    values.push(hospital_id);
    try {
        await db.execute(query, values);
        res.status(200).json({ message: 'Hospital updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update hospital', error });
    }
};

// Xóa bệnh viện
exports.deleteHospital = async (req, res) => {
    const { hospital_id } = req.params;
    const query = 'DELETE FROM Hospital WHERE hospital_id = ?';
    try {
        await db.execute(query, [hospital_id]);
        res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete hospital', error });
    }
};

// Lấy thông tin bệnh viện theo ID
exports.getHospitalById = async (req, res) => {
    const { hospital_id } = req.params;
    const query = 'SELECT * FROM Hospital WHERE hospital_id = ?';
    try {
        const [hospital] = await db.execute(query, [hospital_id]);
        if (hospital.length === 0) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        res.status(200).json(hospital[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch hospital', error });
    }
}; 