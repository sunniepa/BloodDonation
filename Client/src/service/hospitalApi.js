import axiosClient from './axiosClient';

const hospitalService = {
    // Lấy tất cả bệnh viện
    getAllHospitals: async () => {
        const response = await axiosClient.get('/hospitals');
        return response;
    },

    // Tìm kiếm bệnh viện theo tên
    searchHospitals: async (hospitalName) => {
        const response = await axiosClient.get(`/hospitals/search?hospital_name=${hospitalName}`);
        return response;
    },

    // Tạo bệnh viện mới
    createHospital: async (hospitalData) => {
        const response = await axiosClient.post('/hospitals', hospitalData);
        return response;
    },

    // Cập nhật thông tin bệnh viện
    updateHospital: async (hospitalId, hospitalData) => {
        const response = await axiosClient.put(`/hospitals/${hospitalId}`, hospitalData);
        return response;
    },

    // Xóa bệnh viện
    deleteHospital: async (hospitalId) => {
        const response = await axiosClient.delete(`/hospitals/${hospitalId}`);
        return response;
    },

    // Lấy thông tin bệnh viện theo ID
    getHospitalById: async (hospitalId) => {
        const response = await axiosClient.get(`/hospitals/${hospitalId}`);
        return response;
    },
};

export default hospitalService; 
