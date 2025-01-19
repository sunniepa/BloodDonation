import axiosClient from '../apis/axiosClient';

const bloodStorageService = {
    getAllBloodStorages: async () => {
        const response = await axiosClient.get('/blood-storages');
        return response;
    },
    getBloodStorageById: async (storageId) => {
        const response = await axiosClient.get(`/blood-storages/${storageId}`);
        return response;
    },
    createBloodStorage: async (storageData) => {
        const response = await axiosClient.post('/blood-storages', storageData);
        return response;
    },
    updateBloodStorage: async (storageId, storageData) => {
        const response = await axiosClient.put(`/blood-storages/${storageId}`, storageData);
        return response;
    },
    deleteBloodStorage: async (storageId) => {
        const response = await axiosClient.delete(`/blood-storages/${storageId}`);
        return response;
    },
};

export default bloodStorageService;