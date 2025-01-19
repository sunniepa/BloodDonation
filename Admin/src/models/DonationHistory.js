class DonationHistory {
    constructor(id, userId, eventId, donationDate, bloodAmount, status, feedback, createdAt, updatedAt) {
        this.id = id; // ID của lịch sử quyên góp
        this.userId = userId; // ID của người quyên góp
        this.eventId = eventId; // ID của sự kiện
        this.donationDate = donationDate; // Ngày quyên góp
        this.bloodAmount = bloodAmount; // Số lượng máu quyên góp
        this.status = status; // Trạng thái quyên góp
        this.feedback = feedback; // Phản hồi
        this.createdAt = createdAt; // Thời gian tạo
        this.updatedAt = updatedAt; // Thời gian cập nhật
    }
}

export default DonationHistory;