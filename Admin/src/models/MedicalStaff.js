class MedicalStaff {
    constructor(staffId, accountId, fullName, hospitalId, phoneNumber, role, profilePicture, createdAt, updatedAt) {
        this.staffId = staffId; // ID của nhân viên y tế
        this.accountId = accountId; // ID của tài khoản
        this.fullName = fullName; // Họ và tên
        this.hospitalId = hospitalId; // ID của bệnh viện
        this.phoneNumber = phoneNumber; // Số điện thoại
        this.role = role; // Vai trò
        this.profilePicture = profilePicture; // Hình ảnh đại diện
        this.createdAt = createdAt; // Thời gian tạo
        this.updatedAt = updatedAt; // Thời gian cập nhật
    }
}

export default MedicalStaff;