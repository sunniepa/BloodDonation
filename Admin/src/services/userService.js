import axiosClient from '../apis/axiosClient';

const userService = {
    register: async (userData) => {
        const response = await axiosClient.post('/auth/register', userData);
        return response;
    },
    login: async (email, password) => {
        const response = await axiosClient.post('/auth/login', { email, password });
        if (response.token) {
            localStorage.setItem('user', JSON.stringify(response));
        }
        return response;
    },
    logout: () => {
        localStorage.removeItem('user');
    },
    forgotPassword: async (email) => {
        const response = await axiosClient.post('/users/forgot-password', { email });
        return response;
    },
    changePassword: async (userId, oldPassword, newPassword) => {
        const response = await axiosClient.post('/users/change-password', { userId, oldPassword, newPassword });
        return response;
    },
    updateUser: async (userData) => {
        const response = await axiosClient.put('/users/update', userData);
        return response;
    },
    getUser: async (userId) => {
        const response = await axiosClient.get(`/users/${userId}`);
        return response;
    },
    getAllUsers: async () => {
        const response = await axiosClient.get('/users');
        return response;
    },
    blockUser: async (userId) => {
        const response = await axiosClient.post('/users/block', { userId });
        return response;
    },
    searchUsers: async (query) => {
        const response = await axiosClient.get('/users/search', { params: { query } });
        return response;
    },
    approveDoctor: async (userId) => {
        const response = await axiosClient.post('/users/approve-doctor', { userId });
        return response;
    },
};

export default userService;