import axiosClient from '../apis/axiosClient';

export const createGiftHistory = (data) => {
    return axiosClient.post('/gift-histories', data);
};

export const getAllGiftHistories = () => {
    return axiosClient.get('/gift-histories');
};

export const getGiftHistoryById = (id) => {
    return axiosClient.get(`/gift-histories/${id}`);
};

export const updateGiftHistory = (id, data) => {
    return axiosClient.put(`/gift-histories/${id}`, data);
};

export const deleteGiftHistory = (id) => {
    return axiosClient.delete(`/gift-histories/${id}`);
};

export const searchGiftHistories = (params) => {
    return axiosClient.get('/gift-histories/search', { params });
}; 