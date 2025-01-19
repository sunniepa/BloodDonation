class DonationCer {
    constructor(id, userId, donationId, certificateDate, certificateNumber, createdAt, updatedAt) {
        this.id = id; // ID của chứng nhận quyên góp
        this.userId = userId; // ID của người quyên góp
        this.donationId = donationId; // ID của lịch sử quyên góp
        this.certificateDate = certificateDate; // Ngày cấp chứng nhận
        this.certificateNumber = certificateNumber; // Số chứng nhận
        this.createdAt = createdAt; // Thời gian tạo
        this.updatedAt = updatedAt; // Thời gian cập nhật
    }
}

export default DonationCer;