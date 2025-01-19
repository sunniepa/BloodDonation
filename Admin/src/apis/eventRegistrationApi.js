import axiosClient from '../apis/axiosClient';

const API_URL = '/registrations';

const eventRegistrationApi = {
    // Tạo đăng ký sự kiện
    createRegistration: async (registrationData) => {
        const response = await axiosClient.post(API_URL, registrationData);
        return response;
    },

    // Lấy đăng ký theo ID
    getRegistrationById: async (registrationId) => {
        const response = await axiosClient.get(`${API_URL}/${registrationId}`);
        return response.data;
    },

    // Cập nhật đăng ký
    updateRegistration: async (registrationId, registrationData) => {
        const response = await axiosClient.put(`${API_URL}/${registrationId}`, registrationData);
        return response.data;
    },

    // Lấy tất cả đăng ký
    getAllRegistrations: async () => {
        const response = await axiosClient.get(API_URL);
        return response.data;
    },

    // Lấy đăng ký theo event_id
    getRegistrationsByEventId: async (eventId) => {
        const response = await axiosClient.get(`${API_URL}/event/${eventId}`);
        return response.data;
    },

    // Lấy đăng ký theo event_id với đầy đủ thông tin
    getRegistrationsWithDetailsByEventId: async (eventId) => {
        const response = await axiosClient.get(`${API_URL}/event/details/${eventId}`);
        return response.data;
    },

    // Lấy đăng ký theo user_id
    getRegistrationsByUserId: async (userId) => {
        const response = await axiosClient.get(`${API_URL}/user/${userId}`);
        return response.data;
    },

    // Xóa đăng ký
    deleteRegistration: async (registrationId) => {
        const response = await axiosClient.delete(`${API_URL}/${registrationId}`);
        return response.data;
    },

     // Cập nhật trạng thái đăng ký
     updateStatus: async (registrationId, status) => {
        const response = await axiosClient.put(`${API_URL}/status/${registrationId}`, { status });
        return response.data;
    },
};

export default eventRegistrationApi; 