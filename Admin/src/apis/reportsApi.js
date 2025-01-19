import axiosClient from './axiosClient';

const reportsService = {
    // Tạo báo cáo mới
    createReport: async (data) => {
        const response = await axiosClient.post('/reports', data);
        return response;
    },

    // Lấy tất cả báo cáo
    getAllReports: async () => {
        const response = await axiosClient.get('/reports');
        return response;
    },

    // Lấy báo cáo theo ID
    getReportById: async (id) => {
        const response = await axiosClient.get(`/reports/${id}`);
        return response;
    },

    // Cập nhật báo cáo
    updateReport: async (id, data) => {
        const response = await axiosClient.put(`/reports/${id}`, data);
        return response;
    },

    // Xóa báo cáo
    deleteReport: async (id) => {
        const response = await axiosClient.delete(`/reports/${id}`);
        return response;
    },

    // Tìm kiếm báo cáo
    searchReports: async (params) => {
        const response = await axiosClient.get('/reports/search', { params });
        return response;
    },
};

export default reportsService;