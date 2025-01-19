import axiosClient from '../apis/axiosClient';

const authorService = {
    getAllAuthors: async () => {
        const response = await axiosClient.get('/authors');
        return response;
    },
    getAuthorById: async (authorId) => {
        const response = await axiosClient.get(`/authors/${authorId}`);
        return response;
    },
    createAuthor: async (authorData) => {
        const response = await axiosClient.post('/authors', authorData);
        return response;
    },
    updateAuthor: async (authorId, authorData) => {
        const response = await axiosClient.put(`/authors/${authorId}`, authorData);
        return response;
    },
    deleteAuthor: async (authorId) => {
        const response = await axiosClient.delete(`/authors/${authorId}`);
        return response;
    },
};

export default authorService;