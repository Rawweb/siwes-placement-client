import api from './axios.js';

// Coordinator: overview stat counts.
export const getStats = () => api.get('/coordinator/stats');

// Coordinator: employers awaiting verification.
export const getUnverifiedEmployers = () => api.get('/coordinator/employers/unverified');

// Coordinator: verify one employer.
export const verifyEmployer = (id) => api.patch(`/coordinator/employers/${id}/verify`);

// Coordinator: placement records for every student.
export const getPlacements = () => api.get('/coordinator/placements');
