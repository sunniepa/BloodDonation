class DonorProfile {
    constructor(profileId, userId, weight, height, bloodPressure, hemoglobinLevel, medicalHistory, lastDonationDate, isEligible, profilePicture, createdAt, updatedAt) {
        this.profileId = profileId; // ID của hồ sơ người hiến máu
        this.userId = userId; // ID của người hiến máu
        this.weight = weight; // Cân nặng
        this.height = height; // Chiều cao
        this.bloodPressure = bloodPressure; // Huyết áp
        this.hemoglobinLevel = hemoglobinLevel; // Mức hemoglobin
        this.medicalHistory = medicalHistory; // Tiền sử bệnh
        this.lastDonationDate = lastDonationDate; // Ngày hiến máu gần nhất
        this.isEligible = isEligible; // Có đủ điều kiện hiến máu không
        this.profilePicture = profilePicture; // Hình ảnh đại diện
        this.createdAt = createdAt; // Thời gian tạo
        this.updatedAt = updatedAt; // Thời gian cập nhật
    }
}

export default DonorProfile;