// client/src/services/authService.js
import api from './api';

// --- Login ---
export const loginUser = async (email, password) => {
    // ... (previous correct code) ...
    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data && response.data.success) {
            return { token: response.data.token, user: response.data.user };
        } else {
            throw new Error(response.data.error || 'Login failed: Unexpected response structure.');
        }
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message || 'An error occurred during login.');
    }
};

// --- Get Me ---
export const getMe = async () => {
    // ... (previous correct code - assumes interceptor later) ...
    try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.success) {
            return response.data.user;
        } else {
            throw new Error(response.data?.error || 'Failed to fetch user profile.');
        }
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message || 'An error occurred fetching user profile.');
    }
};

// --- Register Sarpanch ---
export const registerSarpanch = async (formData) => { // Expects FormData
    try {
        // Let Axios/browser set Content-Type for FormData
        const response = await api.post('/auth/register/sarpanch', formData, {
            headers: { 'Content-Type': undefined }
        });
        if (response.data && response.data.success) {
            return { token: response.data.token, user: response.data.user };
        } else {
            throw new Error(response.data.error || 'Sarpanch registration failed.');
        }
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message || 'An error occurred during Sarpanch registration.');
    }
};

// --- Register People ---
export const registerPeople = async (formData) => { // Expects FormData
    try {
        // Let Axios/browser set Content-Type for FormData
        const response = await api.post('/auth/register/people', formData, {
             headers: { 'Content-Type': undefined }
        });
        if (response.data && response.data.success) {
            return { token: response.data.token, user: response.data.user };
        } else {
            throw new Error(response.data.error || 'People registration failed.');
        }
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message || 'An error occurred during People registration.');
    }
};