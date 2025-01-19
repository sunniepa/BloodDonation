class GiftHistory {
    constructor(id, donationId, giftType, giftDescription, giftValue, giftDate, createdAt, updatedAt) {
        this.id = id; // ID của lịch sử quà tặng
        this.donationId = donationId; // ID của lịch sử quyên góp
        this.giftType = giftType; // Loại quà tặng
        this.giftDescription = giftDescription; // Mô tả quà tặng
        this.giftValue = giftValue; // Giá trị quà tặng
        this.giftDate = giftDate; // Ngày tặng quà
        this.createdAt = createdAt; // Thời gian tạo
        this.updatedAt = updatedAt; // Thời gian cập nhật
    }
}

export default GiftHistory;