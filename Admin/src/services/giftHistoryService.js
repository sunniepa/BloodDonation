import axiosClient from '../apis/axiosClient';

const giftHistoryService = {
    getAllGiftHistories: async () => {
        const response = await axiosClient.get('/gift-histories');
        return response;
    },
    getGiftHistoryById: async (historyId) => {
        const response = await axiosClient.get(`/gift-histories/${historyId}`);
        return response;
    },
    createGiftHistory: async (historyData) => {
        const response = await axiosClient.post('/gift-histories', historyData);
        return response;
    },
    updateGiftHistory: async (historyId, historyData) => {
        const response = await axiosClient.put(`/gift-histories/${historyId}`, historyData);
        return response;
    },
    deleteGiftHistory: async (historyId) => {
        const response = await axiosClient.delete(`/gift-histories/${historyId}`);
        return response;
    },
};

export default giftHistoryService;