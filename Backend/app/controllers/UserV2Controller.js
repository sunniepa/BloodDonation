const db = require('../config/db');

const userV2Controller = {
    // Lấy tất cả người dùng
    getAllUsers: async (req, res) => {
        try {
            const query = 'SELECT * FROM user';
            const [users] = await db.execute(query);
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch users', error });
        }
    },

    // Lấy thông tin người dùng theo ID
    getUserById: async (req, res) => {
        const { user_id } = req.params;
        const query = 'SELECT * FROM user WHERE user_id = ?';
        try {
            const [user] = await db.execute(query, [user_id]);
            if (user.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user[0]);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch user', error });
        }
    },

    // Tạo người dùng mới
    createUser: async (req, res) => {
        const { full_name, phone_number, address, dob, blood_type, is_donor, profile_picture, account_id } = req.body;
        
        // Check if the account already has a user
        const checkQuery = 'SELECT * FROM user WHERE account_id = ?';
        const insertQuery = `
            INSERT INTO user (full_name, phone_number, address, dob, blood_type, is_donor, profile_picture, account_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        try {
            const [existingUser] = await db.execute(checkQuery, [account_id]);
            if (existingUser.length > 0) {
                return res.status(200).json({ message: 'Account already has a user' });
            }
            
            await db.execute(insertQuery, [full_name, phone_number, address, dob, blood_type, is_donor, profile_picture, account_id]);
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create user', error });
        }
    },

    // Cập nhật thông tin người dùng
    updateUser: async (req, res) => {
        const { user_id } = req.params;
        const { full_name, phone_number, address, dob, blood_type, is_donor, profile_picture } = req.body;
        
        // Prepare an array to hold the values to update
        const values = [];
        const fields = [];

        // Check which fields are provided and prepare the update query accordingly
        if (full_name !== undefined && full_name !== null) {
            fields.push('full_name = ?');
            values.push(full_name);
        }
        if (phone_number !== undefined && phone_number !== null) {
            fields.push('phone_number = ?');
            values.push(phone_number);
        }
        if (address !== undefined && address !== null) {
            fields.push('address = ?');
            values.push(address);
        }
        if (dob !== undefined && dob !== null) {
            fields.push('dob = ?');
            values.push(dob);
        }
        if (blood_type !== undefined && blood_type !== null) {
            fields.push('blood_type = ?');
            values.push(blood_type);
        }
        if (is_donor !== undefined && is_donor !== null) {
            fields.push('is_donor = ?');
            values.push(is_donor);
        }
        if (profile_picture !== undefined && profile_picture !== null) {
            fields.push('profile_picture = ?');
            values.push(profile_picture);
        }

        // If no fields to update, return a message
        if (fields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Construct the query
        const query = `
            UPDATE user SET ${fields.join(', ')}
            WHERE user_id = ?
        `;
        values.push(user_id); // Add user_id to the end of the values array

        try {
            const [result] = await db.execute(query, values);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update user', error });
        }
    },

    // Xóa người dùng
    deleteUser: async (req, res) => {
        const { user_id } = req.params;
        const query = 'DELETE FROM user WHERE user_id = ?';
        try {
            const [result] = await db.execute(query, [user_id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete user', error });
        }
    },

    // Tìm kiếm người dùng
    searchUsers: async (req, res) => {
        const searchTerm = req.query.username || '';
        const query = `
            SELECT * FROM user 
            WHERE full_name LIKE ? 
            OR address LIKE ? 
            OR blood_type LIKE ? 
            OR phone_number LIKE ?
        `;
        try {
            const [users] = await db.execute(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
            res.status(200).json({ data: users });
        } catch (error) {
            res.status(500).json({ message: 'Failed to search users', error });
        }
    },
};

module.exports = userV2Controller; 