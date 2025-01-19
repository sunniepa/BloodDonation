import axiosClient from '../apis/axiosClient';

export const createDonationHistory = (data) => {
    return axiosClient.post('/donations', data);
};

export const getAllDonationHistories = () => {
    return axiosClient.get('/donations');
};

export const getDonationHistoryById = (id) => {
    return axiosClient.get(`/donations/${id}`);
};

export const updateDonationHistory = (id, data) => {
    return axiosClient.put(`/donations/${id}`, data);
};

export const deleteDonationHistory = (id) => {
    return axiosClient.delete(`/donations/${id}`);
};

export const searchDonationHistories = (params) => {
    return axiosClient.get('/donations/search', { params });
}; 