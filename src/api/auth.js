import api from './axios.js';

// Sends login details to the backend, returns its response data.
export const loginRequest = (email, password) => api.post('/auth/login', { email, password });

// Sends registration details to the backend.
export const registerRequest = (data) => api.post('/auth/register', data);

// Updates the logged-in user's own profile.
export const updateMyProfile = (data) => api.patch("/auth/me", data);

// Fetches the logged-in user's own full profile.
export const getMe = () => api.get("/auth/me");