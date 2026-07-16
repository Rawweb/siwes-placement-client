import api from './axios.js';

// Student applies to one opening.
export const applyToOpportunity = (opportunityId) => api.post('/applications', { opportunityId });

// Student fetches their own applications with statuses.
export const getMyApplications = () => api.get('/applications/mine');
