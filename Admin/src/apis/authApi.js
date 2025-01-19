import axiosClient from '../apis/axiosClient';

export const registerUser = (data) => {
    return axiosClient.post('/auth/register', data);
};

export const login = (data) => {
    return axiosClient.post('/auth/login', data);
};

export const forgotPassword = (data) => {
    return axiosClient.post('/auth/forgot-password', data);
};

export const resetPassword = (data) => {
    return axiosClient.post('/auth/reset-password', data);
}; 