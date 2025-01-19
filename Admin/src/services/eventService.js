import axiosClient from '../apis/axiosClient';

const eventService = {
    getAllEvents: async () => {
        const response = await axiosClient.get('/events');
        return response;
    },
    getEventById: async (eventId) => {
        const response = await axiosClient.get(`/events/${eventId}`);
        return response;
    },
    createEvent: async (eventData) => {
        const response = await axiosClient.post('/events', eventData);
        return response;
    },
    updateEvent: async (eventId, eventData) => {
        const response = await axiosClient.put(`/events/${eventId}`, eventData);
        return response;
    },
    deleteEvent: async (eventId) => {
        const response = await axiosClient.delete(`/events/${eventId}`);
        return response;
    },
};

export default eventService;