import api from './axios.js';

// Student applies to one opening.
export const applyToOpportunity = (opportunityId) => api.post('/applications', { opportunityId });

// Student fetches their own applications with statuses.
export const getMyApplications = () => api.get('/applications/mine');

// Employer fetches applications to their own openings.
export const getReceivedApplications = () => api.get("/applications/received");

// Employer decides an application: Under Review, Accepted, or Declined.
export const decideApplication = (id, status) =>
  api.patch(`/applications/${id}/decide`, { status });

// Coordinator: all applications across the platform (activity feed).
export const getAllApplications = () => api.get("/applications/all");