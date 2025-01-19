class Event {
    constructor(id, title, description, location, startTime, endTime, expectedBloodUnits, urgentBloodType, organizerId, categoryId, imageUrl, createdAt, updatedAt) {
        this.id = id; // ID của sự kiện
        this.title = title; // Tiêu đề sự kiện
        this.description = description; // Mô tả sự kiện
        this.location = location; // Địa điểm
        this.startTime = startTime; // Thời gian bắt đầu
        this.endTime = endTime; // Thời gian kết thúc
        this.expectedBloodUnits = expectedBloodUnits; // Số lượng máu dự kiến
        this.urgentBloodType = urgentBloodType; // Nhóm máu khẩn cấp
        this.organizerId = organizerId; // ID của người tổ chức
        this.categoryId = categoryId; // ID của loại sự kiện
        this.imageUrl = imageUrl; // URL hình ảnh
        this.createdAt = createdAt; // Thời gian tạo
        this.updatedAt = updatedAt; // Thời gian cập nhật
    }
}

export default Event;