import axiosClient from './axiosClient';

const usersV2Service = {
    // Lấy tất cả người dùng
    getAllUsers: async () => {
        const response = await axiosClient.get('/users-v2');
        return response;
    },

    // Lấy thông tin người dùng theo ID
    getUserById: async (userId) => {
        const response = await axiosClient.get(`/users-v2/${userId}`);
        return response;
    },

    // Tạo người dùng mới
    createUser: async (userData) => {
        const response = await axiosClient.post('/users-v2', userData);
        return response;
    },

    // Cập nhật thông tin người dùng
    updateUser: async (userId, userData) => {
        const response = await axiosClient.put(`/users-v2/${userId}`, userData);
        return response;
    },

    // Xóa người dùng
    deleteUser: async (userId) => {
        const response = await axiosClient.delete(`/users-v2/${userId}`);
        return response;
    },

    // Tìm kiếm người dùng
    searchUsers: async (searchTerm) => {
        const response = await axiosClient.get('/users-v2/search', { params: { username: searchTerm } });
        return response;
    },
};

export default usersV2Service; 