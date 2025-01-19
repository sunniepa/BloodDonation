import axiosClient from '../apis/axiosClient';

const donationHistoryService = {
    getAllDonationHistories: async () => {
        const response = await axiosClient.get('/donation-histories');
        return response;
    },
    getDonationHistoryById: async (historyId) => {
        const response = await axiosClient.get(`/donation-histories/${historyId}`);
        return response;
    },
    createDonationHistory: async (historyData) => {
        const response = await axiosClient.post('/donation-histories', historyData);
        return response;
    },
    updateDonationHistory: async (historyId, historyData) => {
        const response = await axiosClient.put(`/donation-histories/${historyId}`, historyData);
        return response;
    },
    deleteDonationHistory: async (historyId) => {
        const response = await axiosClient.delete(`/donation-histories/${historyId}`);
        return response;
    },
};

export default donationHistoryService;