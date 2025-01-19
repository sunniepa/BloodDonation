class BloodRequest {
    constructor(id, hospitalId, bloodType, requestedQuantity, status, createdAt, updatedAt) {
        this.id = id; // ID của yêu cầu máu
        this.hospitalId = hospitalId; // ID của bệnh viện
        this.bloodType = bloodType; // Nhóm máu
        this.requestedQuantity = requestedQuantity; // Số lượng yêu cầu
        this.status = status; // Trạng thái yêu cầu
        this.createdAt = createdAt; // Thời gian tạo
        this.updatedAt = updatedAt; // Thời gian cập nhật
    }
}

export default BloodRequest;