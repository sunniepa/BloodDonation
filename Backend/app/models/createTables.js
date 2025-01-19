const db = require('../config/db');

const createTables = async () => {
    try {
        // Tạo cơ sở dữ liệu "BloodDonation" nếu chưa tồn tại
        await db.execute(`CREATE DATABASE IF NOT EXISTS BloodDonation`);
        console.log('Database "BloodDonation" created or already exists.');

        // Tạo bảng "User_Account" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS User_Account (
                account_id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                user_type ENUM('Admin', 'User', 'Medical Staff', 'Hospital') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "User_Account" created or already exists.');

        // Tạo bảng "User" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS User (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                account_id INT,
                full_name VARCHAR(255) NOT NULL,
                phone_number VARCHAR(15),
                address VARCHAR(255),
                dob DATE,
                blood_type ENUM('A', 'B', 'AB', 'O'),
                is_donor BOOLEAN DEFAULT FALSE,
                profile_picture VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (account_id) REFERENCES User_Account(account_id)
            )
        `);
        console.log('Table "User" created or already exists.');

        // Tạo bảng "Hospital" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Hospital (
                hospital_id INT AUTO_INCREMENT PRIMARY KEY,
                account_id INT,
                hospital_name VARCHAR(255) NOT NULL,
                address VARCHAR(255),
                contact_number VARCHAR(15),
                blood_storage INT,
                role VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (account_id) REFERENCES User_Account(account_id)
            )
        `);
        console.log('Table "Hospital" created or already exists.');

        // Tạo bảng "Medical_Staff" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Medical_Staff (
                staff_id INT AUTO_INCREMENT PRIMARY KEY,
                account_id INT,
                full_name VARCHAR(255) NOT NULL,
                hospital_id INT,
                phone_number VARCHAR(15),
                role VARCHAR(50),
                profile_picture VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (account_id) REFERENCES User_Account(account_id),
                FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id)
            )
        `);
        console.log('Table "Medical_Staff" created or already exists.');

        // Tạo bảng "Event_Category" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Event_Category (
                category_id INT AUTO_INCREMENT PRIMARY KEY,
                category_name VARCHAR(255) NOT NULL
            )
        `);
        console.log('Table "Event_Category" created or already exists.');

        // Tạo bảng "Event" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Event (
                event_id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                location VARCHAR(255),
                start_time DATETIME,
                end_time DATETIME,
                expected_blood_units INT,
                urgent_blood_type ENUM('A', 'B', 'AB', 'O'),
                organizer_id INT,
                category_id INT,
                image_url VARCHAR(255),
                status ENUM('chưa phê duyệt') DEFAULT 'chưa phê duyệt',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (organizer_id) REFERENCES Medical_Staff(staff_id),
                FOREIGN KEY (category_id) REFERENCES Event_Category(category_id)
            )
        `);
        console.log('Table "Event" created or already exists.');

        // Tạo bảng "Donation_History" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Donation_History (
                history_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                event_id INT,
                donation_date DATE,
                blood_amount INT,
                status ENUM('Thành công', 'Thất bại', 'Huỷ'),
                feedback TEXT,
                FOREIGN KEY (user_id) REFERENCES User(user_id),
                FOREIGN KEY (event_id) REFERENCES Event(event_id)
            )
        `);
        console.log('Table "Donation_History" created or already exists.');

        // Tạo bảng "Donor_Profile" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Donor_Profile (
                profile_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                weight DECIMAL(5, 2),
                height DECIMAL(5, 2),
                blood_pressure VARCHAR(20),
                hemoglobin_level DECIMAL(5, 2),
                medical_history TEXT,
                last_donation_date DATE,
                is_eligible BOOLEAN DEFAULT FALSE,
                profile_picture VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES User(user_id)
            )
        `);
        console.log('Table "Donor_Profile" created or already exists.');

        // Tạo bảng "Blood_Storage" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Blood_Storage (
                storage_id INT AUTO_INCREMENT PRIMARY KEY,
                hospital_id INT,
                blood_type ENUM('A', 'B', 'AB', 'O'),
                quantity INT,
                expiry_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id)
            )
        `);
        console.log('Table "Blood_Storage" created or already exists.');

        // Tạo bảng "Blood_Request" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Blood_Request (
                request_id INT AUTO_INCREMENT PRIMARY KEY,
                hospital_id INT,
                blood_type ENUM('A', 'B', 'AB', 'O'),
                requested_quantity INT,
                status ENUM('Đang xử lý', 'Hoàn thành', 'Bị từ chối'),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id)
            )
        `);
        console.log('Table "Blood_Request" created or already exists.');

        // Tạo bảng "Admin" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Admin (
                admin_id INT AUTO_INCREMENT PRIMARY KEY,
                account_id INT,
                full_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (account_id) REFERENCES User_Account(account_id)
            )
        `);
        console.log('Table "Admin" created or already exists.');

        // Tạo bảng "Reports" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Reports (
                report_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                total_donors INT,
                successful_donations INT,
                failed_donations INT,
                urgent_responses INT,
                blood_type_distribution TEXT,
                health_status_distribution TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES User(user_id)
            )
        `);
        console.log('Table "Reports" created or already exists.');

        // Tạo bảng "Blood_Inventory_Transaction" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Blood_Inventory_Transaction (
                transaction_id INT AUTO_INCREMENT PRIMARY KEY,
                hospital_id INT,
                blood_type ENUM('A', 'B', 'AB', 'O'),
                transaction_type ENUM('Nhập kho', 'Xuất kho'),
                quantity INT,
                transaction_date DATE,
                request_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id),
                FOREIGN KEY (request_id) REFERENCES Blood_Request(request_id)
            )
        `);
        console.log('Table "Blood_Inventory_Transaction" created or already exists.');

        // Tạo bảng "Donation_Certificate" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Donation_Certificate (
                certificate_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                donation_id INT,
                certificate_date DATE,
                certificate_number VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES User(user_id),
                FOREIGN KEY (donation_id) REFERENCES Donation_History(history_id)
            )
        `);
        console.log('Table "Donation_Certificate" created or already exists.');

        // Tạo bảng "Gift_History" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Gift_History (
                gift_id INT AUTO_INCREMENT PRIMARY KEY,
                donation_id INT,
                user_id INT,
                gift_type ENUM('Tiền mặt', 'Nhu yếu phẩm', 'Khác'),
                gift_description TEXT,
                gift_value DECIMAL(10, 2),
                gift_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (donation_id) REFERENCES Donation_History(history_id),
                FOREIGN KEY (user_id) REFERENCES User(user_id)
            )
        `);
        console.log('Table "Gift_History" created or already exists.');

        // Tạo bảng "password_reset_tokens" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                token VARCHAR(255) NOT NULL,
                expires_at DATETIME NOT NULL,
                FOREIGN KEY (user_id) REFERENCES User(user_id)
            )
        `);
        console.log('Table "password_reset_tokens" created or already exists.');

        // Tạo bảng "Event_Registration" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Event_Registration (
                registration_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                event_id INT,
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('Đăng ký thành công', 'Đã hủy', 'Hiến máu thành công') DEFAULT 'Đăng ký thành công',
                FOREIGN KEY (user_id) REFERENCES User(user_id),
                FOREIGN KEY (event_id) REFERENCES Event(event_id)
            )
        `);
        console.log('Table "Event_Registration" created or already exists.');

        // Tạo bảng "Event_Rating" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Event_Rating (
                rating_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                event_id INT,
                rating INT CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES User(user_id),
                FOREIGN KEY (event_id) REFERENCES Event(event_id)
            )
        `);
        console.log('Table "Event_Rating" created or already exists.');

    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTables();