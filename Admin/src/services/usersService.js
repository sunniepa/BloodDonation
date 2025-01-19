import axiosClient from '../apis/axiosClient';

const usersService = {
    getAllUsers: async () => {
        const response = await axiosClient.get('/users');
        return response;
    },
    getUserById: async (userId) => {
        const response = await axiosClient.get(`/users/${userId}`);
        return response;
    },
    createUser: async (userData) => {
        const response = await axiosClient.post('/users', userData);
        return response;
    },
    updateUser: async (userId, userData) => {
        const response = await axiosClient.put(`/users/${userId}`, userData);
        return response;
    },
    deleteUser: async (userId) => {
        const response = await axiosClient.delete(`/users/${userId}`);
        return response;
    },
    
    getAllMedicalStaff: async () => {
        const response = await axiosClient.get('/medical-staff');
        return response;
    },
    getAllAdmins: async () => {
        const response = await axiosClient.get('/admins');
        return response;
    },
    getAllHospitals: async () => {
        const response = await axiosClient.get('/hospitals');
        return response;
    },
    searchUsers: async (searchQuery) => {
        const response = await axiosClient.get(`/users/search?query=${searchQuery}`);
        return response;
    },
};

export default usersService;