import axiosClient from '../apis/axiosClient';

export const createReport = (data) => {
    return axiosClient.post('/reports', data);
};

export const getAllReports = () => {
    return axiosClient.get('/reports');
};

export const getReportById = (id) => {
    return axiosClient.get(`/reports/${id}`);
};

export const updateReport = (id, data) => {
    return axiosClient.put(`/reports/${id}`, data);
};

export const deleteReport = (id) => {
    return axiosClient.delete(`/reports/${id}`);
};

export const searchReports = (params) => {
    return axiosClient.get('/reports/search', { params });
}; 