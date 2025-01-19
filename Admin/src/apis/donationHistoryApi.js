import axiosClient from './axiosClient';

const donationHistoryApi = {
    createDonationHistory: async (data) => {
        const response = await axiosClient.post('/donations', data);
        return response;
    },

    getAllDonationHistories: async () => {
        const response = await axiosClient.get('/donations');
        return response;
    },

    getDonationHistoryById: async (id) => {
        const response = await axiosClient.get(`/donations/${id}`);
        return response;
    },

    updateDonationHistory: async (id, data) => {
        const response = await axiosClient.put(`/donations/${id}`, data);
        return response;
    },

    deleteDonationHistory: async (id) => {
        const response = await axiosClient.delete(`/donations/${id}`);
        return response;
    },

    searchDonationHistories: async (params) => {
        const response = await axiosClient.get('/donations/search', { params });
        return response;
    },
};

export default donationHistoryApi;