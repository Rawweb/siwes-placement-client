import api from './axios.js';

// Fetches openings for the student, optionally filtered.
// filters is an object like { discipline, state, city }; only the
// keys with values get sent as query parameters.
export const browseOpportunities = (filters = {}) => api.get('/opportunities', { params: filters });
