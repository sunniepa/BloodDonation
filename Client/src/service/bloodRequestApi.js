import axiosClient from '../apis/axiosClient';

const bloodRequestService = {
    createBloodRequest: async (data) => {
        const response = await axiosClient.post('/blood-requests', data);
        return response;
    },
    getAllBloodRequests: async () => {
        const response = await axiosClient.get('/blood-requests');
        return response;
    },
    getBloodRequestById: async (id) => {
        const response = await axiosClient.get(`/blood-requests/${id}`);
        return response;
    },
    updateBloodRequest: async (id, data) => {
        const response = await axiosClient.put(`/blood-requests/${id}`, data);
        return response;
    },
    updateBloodRequestStatus: async (id, status) => {
        const response = await axiosClient.put(`/blood-requests/status/${id}`, { status });
        return response;
    },
    deleteBloodRequest: async (id) => {
        const response = await axiosClient.delete(`/blood-requests/${id}`);
        return response;
    },
    searchBloodRequests: async (blood_type) => {
        const response = await axiosClient.get(`/blood-requests/search?blood_type=${blood_type}`);
        return response;
    },
};

export default bloodRequestService;