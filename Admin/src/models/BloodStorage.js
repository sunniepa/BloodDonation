class BloodStorage {
    constructor(id, hospitalId, bloodType, quantity, expiryDate, createdAt, updatedAt) {
        this.id = id; // ID của kho máu
        this.hospitalId = hospitalId; // ID của bệnh viện
        this.bloodType = bloodType; // Nhóm máu
        this.quantity = quantity; // Số lượng máu
        this.expiryDate = expiryDate; // Ngày hết hạn
        this.createdAt = createdAt; // Thời gian tạo
        this.updatedAt = updatedAt; // Thời gian cập nhật
    }
}

export default BloodStorage;