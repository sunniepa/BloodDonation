class Reports {
    constructor(id, totalDonors, successfulDonations, failedDonations, urgentResponses, bloodTypeDistribution, healthStatusDistribution, createdAt) {
        this.id = id; // ID của báo cáo
        this.totalDonors = totalDonors; // Tổng số người quyên góp
        this.successfulDonations = successfulDonations; // Số lượng quyên góp thành công
        this.failedDonations = failedDonations; // Số lượng quyên góp thất bại
        this.urgentResponses = urgentResponses; // Số lượng phản hồi khẩn cấp
        this.bloodTypeDistribution = bloodTypeDistribution; // Phân phối nhóm máu
        this.healthStatusDistribution = healthStatusDistribution; // Phân phối tình trạng sức khỏe
        this.createdAt = createdAt; // Thời gian tạo
    }
}

export default Reports;