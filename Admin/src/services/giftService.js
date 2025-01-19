import axiosClient from '../apis/axiosClient';

const giftService = {
    getAllGifts: async () => {
        const response = await axiosClient.get('/gifts');
        return response;
    },
    getGiftById: async (giftId) => {
        const response = await axiosClient.get(`/gifts/${giftId}`);
        return response;
    },
    createGift: async (giftData) => {
        const response = await axiosClient.post('/gifts', giftData);
        return response;
    },
    updateGift: async (giftId, giftData) => {
        const response = await axiosClient.put(`/gifts/${giftId}`, giftData);
        return response;
    },
    deleteGift: async (giftId) => {
        const response = await axiosClient.delete(`/gifts/${giftId}`);
        return response;
    },
};

export default giftService;