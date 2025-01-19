CREATE DATABASE IF NOT EXISTS BloodDonation;
USE BloodDonation;

CREATE TABLE User_Account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('Admin', 'User', 'Medical Staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE User (
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
);

CREATE TABLE Hospital (
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
);

CREATE TABLE Medical_Staff (
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
);

CREATE TABLE Event_Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

CREATE TABLE Event (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES Medical_Staff(staff_id),
    FOREIGN KEY (category_id) REFERENCES Event_Category(category_id)
);

CREATE TABLE Donation_History (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    event_id INT,
    donation_date DATE,
    blood_amount INT,
    status ENUM('Thành công', 'Thất bại', 'Huỷ'),
    feedback TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id)
);

CREATE TABLE Donor_Profile (
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
);

CREATE TABLE Blood_Storage (
    storage_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT,
    blood_type ENUM('A', 'B', 'AB', 'O'),
    quantity INT,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id)
);

CREATE TABLE Blood_Request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT,
    blood_type ENUM('A', 'B', 'AB', 'O'),
    requested_quantity INT,
    status ENUM('Đang xử lý', 'Hoàn thành', 'Bị từ chối'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id)
);

CREATE TABLE Admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES User_Account(account_id)
);

CREATE TABLE Reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    total_donors INT,
    successful_donations INT,
    failed_donations INT,
    urgent_responses INT,
    blood_type_distribution TEXT,
    health_status_distribution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Blood_Inventory_Transaction (
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
);

CREATE TABLE Donation_Certificate (
    certificate_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    donation_id INT,
    certificate_date DATE,
    certificate_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (donation_id) REFERENCES Donation_History(history_id)
);

CREATE TABLE Gift_History (
    gift_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT,
    gift_type ENUM('Tiền mặt', 'Nhu yếu phẩm', 'Khác'),
    gift_description TEXT,
    gift_value DECIMAL(10, 2),
    gift_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES Donation_History(history_id)
);
