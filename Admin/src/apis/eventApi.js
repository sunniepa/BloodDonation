import axiosClient from '../apis/axiosClient';

const eventService = {
    createEvent: async (data) => {
        const response = await axiosClient.post('/events', data);
        return response;
    },
    getAllEvents: async () => {
        const response = await axiosClient.get('/events');
        return response;
    },
    getEventById: async (id) => {
        const response = await axiosClient.get(`/events/${id}`);
        return response;
    },
    updateEvent: async (id, data) => {
        const response = await axiosClient.put(`/events/${id}`, data);
        return response;
    },
    updateEventStatus: async (id, status) => {
        const response = await axiosClient.put(`/events/status/${id}`, { status });
        return response;
    },
    deleteEvent: async (id) => {
        const response = await axiosClient.delete(`/events/${id}`);
        return response;
    },
    searchEvents: async (searchTerm) => {
        const response = await axiosClient.get('/events/search',  { params: { title: searchTerm } });
        return response;
    },
};

export default eventService;