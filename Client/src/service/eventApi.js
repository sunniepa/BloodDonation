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
    deleteEvent: async (id) => {
        const response = await axiosClient.delete(`/events/${id}`);
        return response;
    },
    searchEvents: async (searchTerm) => {
        const response = await axiosClient.get('/events/search',  { params: { title: searchTerm } });
        return response;
    },
    getEventsByCategoryId: async (category_id) => {
        const response = await axiosClient.get(`/events/category/${category_id}`);
        return response;
    },
    createEventRating: async (event_id, data) => {
        const response = await axiosClient.post(`/events/ratings/${event_id}`, data);
        return response;
    },
    getEventRatings: async (event_id) => {
        const response = await axiosClient.get(`/events/ratings/${event_id}`);
        return response;
    },
};

export default eventService;