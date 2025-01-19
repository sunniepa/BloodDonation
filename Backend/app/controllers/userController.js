const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _const = require('../config/constant');

const userController = {
    getAllUsers: async (req, res) => {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10000;
        const offset = (page - 1) * limit;

        try {
            const query = `SELECT * FROM User_Account LIMIT ${offset}, ${limit}`; // Sửa tên bảng

            const [users] = await db.execute(query);
            res.status(200).json({ data: users });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllMedicalStaff: async (req, res) => {
        try {
            const [medicalStaff] = await db.execute('SELECT * FROM Medical_Staff');
            res.status(200).json({ data: medicalStaff });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllClient: async (req, res) => {
        try {
            const [users] = await db.execute('SELECT * FROM User');
            res.status(200).json({ data: users });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllAdmins: async (req, res) => {
        try {
            const [admins] = await db.execute('SELECT * FROM Admin');
            res.status(200).json({ data: admins });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllHospitals: async (req, res) => {
        try {
            const [hospitals] = await db.execute('SELECT * FROM Hospital');
            res.status(200).json({ data: hospitals });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    createUser: async (req, res) => {
        try {
            const inputEmail = req.body.email;

            // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
            const [checkEmailExist] = await db.execute('SELECT * FROM User_Account WHERE email = ?', [inputEmail]);
            if (checkEmailExist.length > 0) {
                return res.status(400).json("User with this email already exists"); // Trả về 400
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const { email, user_type, full_name, phone_number, address, dob, hospital_id } = req.body;

            // Thêm người dùng vào bảng User_Account
            const values = [email || null, hashed || null, user_type || 'User'];
            const query = 'INSERT INTO User_Account (email, password, user_type) VALUES (?, ?, ?)';
            const [result] = await db.execute(query, values);
            const accountId = result.insertId;

            // Thêm dữ liệu vào bảng tương ứng dựa trên user_type
            const defaultValues = {
                full_name: null,
                phone_number: null,
                address: null,
                dob: null,
                hospital_id: null
            };

            if (user_type === 'User') {
                console.log("đã vô")
                const result = await db.execute(
                    'INSERT INTO User (account_id, full_name, phone_number, address, dob) VALUES (?, ?, ?, ?, ?)',
                    [accountId, full_name || defaultValues.full_name, phone_number || defaultValues.phone_number, address || defaultValues.address, dob || defaultValues.dob]
                );
                console.log(result.affectedRows > 0 ? 'Insert successful' : 'Insert failed');
            } else if (user_type === 'Medical Staff') {
                await db.execute(
                    'INSERT INTO Medical_Staff (account_id, full_name, hospital_id, phone_number) VALUES (?, ?, ?, ?)',
                    [accountId, full_name || defaultValues.full_name, hospital_id || defaultValues.hospital_id, phone_number || defaultValues.phone_number]
                );
            } else if (user_type === 'Admin') {
                await db.execute(
                    'INSERT INTO Admin (account_id, full_name) VALUES (?, ?)',
                    [accountId, full_name || defaultValues.full_name]
                );
            } else if (user_type === 'Hospital') {
                await db.execute(
                    'INSERT INTO Hospital (account_id, hospital_name, address, contact_number) VALUES (?, ?, ?, ?)',
                    [accountId, full_name || defaultValues.full_name, address || defaultValues.address, phone_number || defaultValues.phone_number] // Sử dụng full_name cho hospital_name
                );
            }

            res.status(200).json({ id: accountId, email, user_type });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;

            const [checkUserExist] = await db.execute('SELECT * FROM User_Account WHERE account_id = ?', [userId]); // Sửa tên bảng

            if (checkUserExist.length === 0) {
                return res.status(400).json("User not found"); // Trả về 400
            }

            const deleteQuery = 'DELETE FROM User_Account WHERE account_id = ?'; // Sửa tên bảng
            await db.execute(deleteQuery, [userId]);

            res.status(200).json("Delete success");
        } catch (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(200).json("Cannot delete user, as they are referenced in other records"); // Trả về 400
            }
            res.status(500).json(err);
        }
    },

    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const { email, password, user_type } = req.body;

            const [checkEmailExist] = await db.execute('SELECT * FROM User_Account WHERE email = ? AND account_id != ?', [email, userId]); // Sửa tên bảng

            if (checkEmailExist.length > 0) {
                return res.status(400).json({ message: 'Email already exists' }); // Trả về 400
            }

            const updateFields = [];
            const updateValues = [];

            if (email) {
                updateFields.push('email = ?');
                updateValues.push(email);
            }
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                updateFields.push('password = ?');
                updateValues.push(hashedPassword);
            }
            if (user_type) {
                updateFields.push('user_type = ?');
                updateValues.push(user_type);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ message: 'No fields to update' }); // Trả về 400
            }

            const updateQuery = `UPDATE User_Account SET ${updateFields.join(', ')} WHERE account_id = ?`; // Sửa tên bảng
            const updatedValues = [...updateValues, userId];

            const [result] = await db.execute(updateQuery, updatedValues);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json("Update success");
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    changePassword: async (req, res) => {
        try {
            const userId = req.params.id; // Lấy userId từ params
            const { currentPassword, newPassword } = req.body;

            // Kiểm tra xem người dùng có tồn tại không
            const [user] = await db.execute('SELECT * FROM User_Account WHERE account_id = ?', [userId]);
            if (user.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // So sánh mật khẩu hiện tại
            const isMatch = await bcrypt.compare(currentPassword, user[0].password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Băm mật khẩu mới và cập nhật
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await db.execute('UPDATE User_Account SET password = ? WHERE account_id = ?', [hashedPassword, userId]);

            res.status(200).json({ message: 'Password changed successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    getProfile: async (req, res) => {
        try {
            const userId = req.params.id; // Lấy userId từ params

            // Lấy thông tin từ bảng User_Account
            const [userAccount] = await db.execute('SELECT * FROM User_Account WHERE account_id = ?', [userId]);
            if (userAccount.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userType = userAccount[0].user_type;
            let userProfile;

            // Lấy thông tin từ bảng tương ứng dựa trên user_type
            if (userType === 'User') {
                const [user] = await db.execute('SELECT * FROM User WHERE account_id = ?', [userId]);
                userProfile = { ...userAccount[0], ...user[0] }; // Kết hợp thông tin
            } else if (userType === 'Medical Staff') {
                const [medicalStaff] = await db.execute('SELECT * FROM Medical_Staff WHERE account_id = ?', [userId]);
                userProfile = { ...userAccount[0], ...medicalStaff[0] }; // Kết hợp thông tin
            } else if (userType === 'Admin') {
                const [admin] = await db.execute('SELECT * FROM Admin WHERE account_id = ?', [userId]);
                userProfile = { ...userAccount[0], ...admin[0] }; // Kết hợp thông tin
            } else if (userType === 'Hospital') {
                const [hospital] = await db.execute('SELECT * FROM Hospital WHERE account_id = ?', [userId]);
                userProfile = { ...userAccount[0], ...hospital[0] }; // Kết hợp thông tin
            }

            res.status(200).json(userProfile);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.params.id; // Lấy userId từ params
            const { full_name, phone_number, address, dob } = req.body;

            // Kiểm tra xem người dùng có tồn tại không
            const [userAccount] = await db.execute('SELECT * FROM User_Account WHERE account_id = ?', [userId]);
            if (userAccount.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userType = userAccount[0].user_type;

            // Cập nhật thông tin dựa trên user_type
            if (userType === 'User') {
                await db.execute(
                    'UPDATE User SET full_name = ?, phone_number = ?, address = ?, dob = ? WHERE account_id = ?',
                    [full_name, phone_number, address, dob, userId]
                );
            } else if (userType === 'Medical Staff') {
                await db.execute(
                    'UPDATE Medical_Staff SET full_name = ?, phone_number = ? WHERE account_id = ?',
                    [full_name, phone_number, userId]
                );
            } else if (userType === 'Admin') {
                await db.execute(
                    'UPDATE Admin SET full_name = ? WHERE account_id = ?',
                    [full_name, userId]
                );
            } else if (userType === 'Hospital') {
                await db.execute(
                    'UPDATE Hospital SET hospital_name = ?, address = ?, contact_number = ? WHERE account_id = ?',
                    [full_name, address, phone_number, userId] // Sử dụng full_name cho hospital_name
                );
            }

            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

};

module.exports = userController;