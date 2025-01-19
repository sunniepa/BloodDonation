class BloodInventoryTransaction {
    constructor(transactionId, hospitalId, bloodType, transactionType, quantity, transactionDate, requestId, createdAt, updatedAt) {
        this.transactionId = transactionId; // ID của giao dịch kho máu
        this.hospitalId = hospitalId; // ID của bệnh viện
        this.bloodType = bloodType; // Nhóm máu
        this.transactionType = transactionType; // Loại giao dịch (Nhập kho/Xuất kho)
        this.quantity = quantity; // Số lượng
        this.transactionDate = transactionDate; // Ngày giao dịch
        this.requestId = requestId; // ID của yêu cầu máu
        this.createdAt = createdAt; // Thời gian tạo
        this.updatedAt = updatedAt; // Thời gian cập nhật
    }
}

export default BloodInventoryTransaction;