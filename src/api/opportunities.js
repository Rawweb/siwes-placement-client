import api from './axios.js';

// Fetches openings for the student, optionally filtered.
// filters is an object like { discipline, state, city }; only the
// keys with values get sent as query parameters.
export const browseOpportunities = (filters = {}) => api.get('/opportunities', { params: filters });

// Employer posts a new opening.
export const createOpportunity = (data) => api.post("/opportunities", data);

// Employer fetches their own openings.
export const getMyOpportunities = () => api.get("/opportunities/mine");