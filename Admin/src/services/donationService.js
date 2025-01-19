import axiosClient from '../apis/axiosClient';

const donationService = {
    getAllDonations: async () => {
        const response = await axiosClient.get('/donations');
        return response;
    },
    getDonationById: async (donationId) => {
        const response = await axiosClient.get(`/donations/${donationId}`);
        return response;
    },
    createDonation: async (donationData) => {
        const response = await axiosClient.post('/donations', donationData);
        return response;
    },
    updateDonation: async (donationId, donationData) => {
        const response = await axiosClient.put(`/donations/${donationId}`, donationData);
        return response;
    },
    deleteDonation: async (donationId) => {
        const response = await axiosClient.delete(`/donations/${donationId}`);
        return response;
    },
};

export default donationService;