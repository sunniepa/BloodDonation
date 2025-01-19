import axiosClient from '../apis/axiosClient';

const bloodStorageService = {
    createBloodStorage: async (data) => {
        const response = await axiosClient.post('/blood-storage', data);
        return response;
    },
    getAllBloodStorages: async () => {
        const response = await axiosClient.get('/blood-storage');
        return response;
    },
    getBloodStorageById: async (id) => {
        const response = await axiosClient.get(`/blood-storage/${id}`);
        return response;
    },
    updateBloodStorage: async (id, data) => {
        const response = await axiosClient.put(`/blood-storage/${id}`, data);
        return response;
    },
    deleteBloodStorage: async (id) => {
        const response = await axiosClient.delete(`/blood-storage/${id}`);
        return response;
    },
    searchBloodStorages: async (blood_type) => {
        const response = await axiosClient.get('/blood-storage/search', { params: { blood_type } });
        return response;
    },
};

export default bloodStorageService;