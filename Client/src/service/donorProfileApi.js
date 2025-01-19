import axiosClient from './axiosClient';

const donorProfileService = {
    // Lấy tất cả hồ sơ người hiến máu
    getAllDonorProfiles: async () => {
        const response = await axiosClient.get('/donors');
        return response;
    },

    // Tạo hồ sơ người hiến máu mới
    createDonorProfile: async (donorProfileData) => {
        const response = await axiosClient.post('/donors', donorProfileData);
        return response;
    },

    // Cập nhật thông tin hồ sơ người hiến máu
    updateDonorProfile: async (donorProfileId, donorProfileData) => {
        const response = await axiosClient.put(`/donors/${donorProfileId}`, donorProfileData);
        return response;
    },

    // Xóa hồ sơ người hiến máu
    deleteDonorProfile: async (donorProfileId) => {
        const response = await axiosClient.delete(`/donors/${donorProfileId}`);
        return response;
    },

    // Lấy thông tin hồ sơ người hiến máu theo ID
    getDonorProfileById: async (donorProfileId) => {
        const response = await axiosClient.get(`/donors/${donorProfileId}`);
        return response;
    },

    // Lấy thông tin hồ sơ người hiến máu theo user_id
    getDonorProfileByUserId: async (user) => {
        const response = await axiosClient.get(`/donors/user/${user.additionalInfo.user_id}`);
        return response;
    },
};

export default donorProfileService; 