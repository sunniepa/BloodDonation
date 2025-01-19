import axiosClient from './axiosClient';

const medicalStaffService = {
    // Lấy tất cả nhân viên y tế
    getAllMedicalStaff: async () => {
        const response = await axiosClient.get('/medical-staff');
        return response;
    },

    // Tạo nhân viên y tế mới
    createMedicalStaff: async (staffData) => {
        const response = await axiosClient.post('/medical-staff', staffData);
        return response;
    },

    // Cập nhật thông tin nhân viên y tế
    updateMedicalStaff: async (staffId, staffData) => {
        const response = await axiosClient.put(`/medical-staff/${staffId}`, staffData);
        return response;
    },

    // Xóa nhân viên y tế
    deleteMedicalStaff: async (staffId) => {
        const response = await axiosClient.delete(`/medical-staff/${staffId}`);
        return response;
    },

    // Lấy thông tin nhân viên y tế theo ID
    getMedicalStaffById: async (staffId) => {
        const response = await axiosClient.get(`/medical-staff/${staffId}`);
        return response;
    },

    // Tìm kiếm nhân viên y tế
    searchMedicalStaff: async (searchTerm) => {
        const response = await axiosClient.get('/medical-staff/search', { params: { full_name: searchTerm } });
        return response;
    },
};

export default medicalStaffService; 