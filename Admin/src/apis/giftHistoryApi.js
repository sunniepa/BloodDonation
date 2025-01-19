import axiosClient from './axiosClient';

const giftHistoryService = {
    // Tạo lịch sử quà tặng
    createGiftHistory: async (data) => {
        const response = await axiosClient.post('/gift-histories', data);
        return response;
    },

    // Lấy tất cả lịch sử quà tặng
    getAllGiftHistories: async () => {
        const response = await axiosClient.get('/gift-histories');
        return response;
    },

    // Lấy lịch sử quà tặng theo ID
    getGiftHistoryById: async (id) => {
        const response = await axiosClient.get(`/gift-histories/${id}`);
        return response;
    },

    // Cập nhật lịch sử quà tặng
    updateGiftHistory: async (id, data) => {
        const response = await axiosClient.put(`/gift-histories/${id}`, data);
        return response;
    },

    // Xóa lịch sử quà tặng
    deleteGiftHistory: async (id) => {
        const response = await axiosClient.delete(`/gift-histories/${id}`);
        return response;
    },

    // Tìm kiếm lịch sử quà tặng
    searchGiftHistories: async (params) => {
        const response = await axiosClient.get('/gift-histories/search', { params });
        return response;
    },
};

export default giftHistoryService;