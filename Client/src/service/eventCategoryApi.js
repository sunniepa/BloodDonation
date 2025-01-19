import axiosClient from '../apis/axiosClient';

const eventCategoryService = {
    createCategory: async (data) => {
        const response = await axiosClient.post('/event-categories', data);
        return response;
    },
    getAllCategories: async () => {
        const response = await axiosClient.get('/event-categories');
        return response;
    },
    getCategoryById: async (id) => {
        const response = await axiosClient.get(`/event-categories/${id}`);
        return response;
    },
    updateCategory: async (id, data) => {
        const response = await axiosClient.put(`/event-categories/${id}`, data);
        return response;
    },
    deleteCategory: async (id) => {
        const response = await axiosClient.delete(`/event-categories/${id}`);
        return response;
    },
    searchCategories: async (params) => {
        const response = await axiosClient.get('/event-categories/search', { params });
        return response;
    },
};

export default eventCategoryService;