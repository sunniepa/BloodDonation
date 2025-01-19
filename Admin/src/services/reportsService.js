import axiosClient from '../apis/axiosClient';

const reportsService = {
    getAllReports: async () => {
        const response = await axiosClient.get('/reports');
        return response;
    },
    getReportById: async (reportId) => {
        const response = await axiosClient.get(`/reports/${reportId}`);
        return response;
    },
    createReport: async (reportData) => {
        const response = await axiosClient.post('/reports', reportData);
        return response;
    },
    updateReport: async (reportId, reportData) => {
        const response = await axiosClient.put(`/reports/${reportId}`, reportData);
        return response;
    },
    deleteReport: async (reportId) => {
        const response = await axiosClient.delete(`/reports/${reportId}`);
        return response;
    },
};

export default reportsService;