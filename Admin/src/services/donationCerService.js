import axiosClient from '../apis/axiosClient';

const donationCerService = {
    getAllDonationCers: async () => {
        const response = await axiosClient.get('/donation-cers');
        return response;
    },
    getDonationCerById: async (cerId) => {
        const response = await axiosClient.get(`/donation-cers/${cerId}`);
        return response;
    },
    createDonationCer: async (cerData) => {
        const response = await axiosClient.post('/donation-cers', cerData);
        return response;
    },
    updateDonationCer: async (cerId, cerData) => {
        const response = await axiosClient.put(`/donation-cers/${cerId}`, cerData);
        return response;
    },
    deleteDonationCer: async (cerId) => {
        const response = await axiosClient.delete(`/donation-cers/${cerId}`);
        return response;
    },
};

export default donationCerService;