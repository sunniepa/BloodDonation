import axiosClient from '../apis/axiosClient';

export const createDonationCertificate = (data) => {
    return axiosClient.post('/donation-certificates', data);
};

export const getAllDonationCertificates = () => {
    return axiosClient.get('/donation-certificates');
};

export const getDonationCertificateById = (id) => {
    return axiosClient.get(`/donation-certificates/${id}`);
};

export const updateDonationCertificate = (id, data) => {
    return axiosClient.put(`/donation-certificates/${id}`, data);
};

export const deleteDonationCertificate = (id) => {
    return axiosClient.delete(`/donation-certificates/${id}`);
};

export const searchDonationCertificates = (params) => {
    return axiosClient.get('/donation-certificates/search', { params });
}; 