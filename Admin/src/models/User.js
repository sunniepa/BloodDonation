class User {
    constructor(id, accountId, fullName, phoneNumber, address, dob, bloodType, isDonor, profilePicture, createdAt, updatedAt) {
        this.id = id; // ID của người dùng
        this.accountId = accountId; // ID của tài khoản
        this.fullName = fullName; // Họ và tên
        this.phoneNumber = phoneNumber; // Số điện thoại
        this.address = address; // Địa chỉ
        this.dob = dob; // Ngày sinh
        this.bloodType = bloodType; // Nhóm máu
        this.isDonor = isDonor; // Có phải là người hiến máu không
        this.profilePicture = profilePicture; // Hình ảnh đại diện
        this.createdAt = createdAt; // Thời gian tạo
        this.updatedAt = updatedAt; // Thời gian cập nhật
    }
}

export default User;