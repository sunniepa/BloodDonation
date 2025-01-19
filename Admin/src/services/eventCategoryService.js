import axiosClient from '../apis/axiosClient';

const eventCategoryService = {
    // Thêm danh mục sự kiện
    createCategory: async (categoryData) => {
        const response = await axiosClient.post('/event-categories', categoryData);
        return response;
    },

    // Lấy tất cả danh mục sự kiện
    getAllCategories: async () => {
        const response = await axiosClient.get('/event-categories');
        return response;
    },

    // Lấy danh mục sự kiện theo ID
    getCategoryById: async (id) => {
        const response = await axiosClient.get(`/event-categories/${id}`);
        return response;
    },

    // Cập nhật danh mục sự kiện
    updateCategory: async (id, categoryData) => {
        const response = await axiosClient.put(`/event-categories/${id}`, categoryData);
        return response;
    },

    // Xóa danh mục sự kiện
    deleteCategory: async (id) => {
        const response = await axiosClient.delete(`/event-categories/${id}`);
        return response;
    },

    // Tìm kiếm danh mục sự kiện
    searchCategories: async (searchTerm) => {
        const response = await axiosClient.get('/event-categories/search', { params: { category_name: searchTerm } });
        return response;
    },
};

export default eventCategoryService;