import axiosClient from '../apis/axiosClient';

const bloodRequestService = {
    getAllBloodRequests: async () => {
        const response = await axiosClient.get('/blood-requests');
        return response;
    },
    getBloodRequestById: async (requestId) => {
        const response = await axiosClient.get(`/blood-requests/${requestId}`);
        return response;
    },
    createBloodRequest: async (requestData) => {
        const response = await axiosClient.post('/blood-requests', requestData);
        return response;
    },
    updateBloodRequest: async (requestId, requestData) => {
        const response = await axiosClient.put(`/blood-requests/${requestId}`, requestData);
        return response;
    },
    deleteBloodRequest: async (requestId) => {
        const response = await axiosClient.delete(`/blood-requests/${requestId}`);
        return response;
    },
};

export default bloodRequestService;