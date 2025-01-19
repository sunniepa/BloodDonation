const db = require('../config/db');
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        // Tạo một số người dùng mẫu
        const users = [
            {
                email: 'user@gmail.com',
                password: '123456',
                user_type: 'User',
                full_name: 'Nguyễn Văn A',
                phone_number: '0123456789',
                address: 'Hà Nội',
                dob: '1990-01-01'
            },
            {
                email: 'admin@gmail.com',
                password: '123456',
                user_type: 'Admin',
                full_name: 'Trần Thị B',
                phone_number: '0987654321',
                address: 'Hồ Chí Minh',
                dob: '1985-05-05'
            },
            {
                email: 'medical@gmail.com',
                password: '123456',
                user_type: 'Medical Staff',
                full_name: 'Lê Văn C',
                phone_number: '0912345678',
                hospital_id: 1, // Giả sử có hospital_id = 1
                role: 'Doctor'
            },
            {
                email: 'hospital@gmail.com',
                password: '123456',
                user_type: 'Hospital',
                hospital_name: 'Bệnh viện A',
                address: 'Đà Nẵng',
                contact_number: '0934567890',
                blood_storage: 100,
                role: 'Manager'
            }
        ];

        for (const user of users) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            // Thêm người dùng vào bảng User_Account
            const [result] = await db.execute(
                'INSERT INTO User_Account (email, password, user_type) VALUES (?, ?, ?)',
                [user.email, hashedPassword, user.user_type]
            );

            const accountId = result.insertId;

            // Thêm dữ liệu vào bảng tương ứng dựa trên user_type
            if (user.user_type === 'User') {
                await db.execute(
                    'INSERT INTO User (account_id, full_name, phone_number, address, dob) VALUES (?, ?, ?, ?, ?)',
                    [accountId, user.full_name, user.phone_number, user.address, user.dob]
                );
            } else if (user.user_type === 'Medical Staff') {
                await db.execute(
                    'INSERT INTO Medical_Staff (account_id, full_name, hospital_id, phone_number, role) VALUES (?, ?, ?, ?, ?)',
                    [accountId, user.full_name, user.hospital_id, user.phone_number, user.role]
                );
            } else if (user.user_type === 'Admin') {
                await db.execute(
                    'INSERT INTO Admin (account_id, full_name) VALUES (?, ?)',
                    [accountId, user.full_name]
                );
            } else if (user.user_type === 'Hospital') {
                await db.execute(
                    'INSERT INTO Hospital (account_id, hospital_name, address, contact_number, blood_storage, role) VALUES (?, ?, ?, ?, ?, ?)',
                    [accountId, user.hospital_name, user.address, user.contact_number, user.blood_storage, user.role]
                );
            }
        }

        console.log('Data seeded successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

seedData();