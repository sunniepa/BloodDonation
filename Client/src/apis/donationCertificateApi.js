import axiosClient from './axiosClient';

const donationCertificateApi = {
    // Tạo giấy chứng nhận mới
    createCertificate: async (data) => {
        const response = await axiosClient.post('/donation-certificates', data);
        return response;
    },

    // Lấy tất cả giấy chứng nhận
    getAllCertificates: async () => {
        const response = await axiosClient.get('/donation-certificates');
        return response;
    },

    // Lấy giấy chứng nhận theo ID
    getCertificateById: async (id) => {
        const response = await axiosClient.get(`/donation-certificates/${id}`);
        return response;
    },

    // Cập nhật giấy chứng nhận
    updateCertificate: async (id, data) => {
        const response = await axiosClient.put(`/donation-certificates/${id}`, data);
        return response;
    },

    // Xóa giấy chứng nhận
    deleteCertificate: async (id) => {
        const response = await axiosClient.delete(`/donation-certificates/${id}`);
        return response;
    },

    // Tìm kiếm giấy chứng nhận
    searchCertificates: async (params) => {
        const response = await axiosClient.get('/donation-certificates/search', { params });
        return response;
    },
};

export default donationCertificateApi; 