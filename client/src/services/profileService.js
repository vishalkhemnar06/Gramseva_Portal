// client/src/services/profileService.js
import api from './api'; // Your configured axios instance

const API_ENDPOINT = '/profile'; // Base endpoint for profile actions

/**
 * Fetches the profile data of the currently logged-in user.
 * Assumes token is automatically added by interceptor.
 * @returns {Promise<object>} - Promise resolving with the user object (excluding password).
 */
export const getMyProfileData = async () => {
    try {
        console.log("profileService: Calling GET /profile/me");
        // Using /profile/me instead of /auth/me for dedicated profile actions
        const response = await api.get(`${API_ENDPOINT}/me`);
        console.log("profileService: Get profile response", response.data);
        if (response.data?.success && response.data?.user) {
            return response.data.user;
        } else {
            throw new Error(response.data?.error || 'Failed to fetch profile data.');
        }
    } catch (error) {
        console.error("profileService: Error fetching profile", error.response || error);
        const message = error.response?.data?.error || error.message || 'Error fetching profile.';
        throw new Error(message);
    }
};

/**
 * Updates the profile data for the currently logged-in user.
 * @param {object} updatedData - Object containing allowed fields to update (e.g., { name, age, gender }).
 * @returns {Promise<object>} - Promise resolving with the updated user object.
 */
export const updateMyProfileData = async (updatedData) => {
     try {
        console.log("profileService: Calling PUT /profile/me with data:", updatedData);
         // Using /profile/me instead of /auth/me
        const response = await api.put(`${API_ENDPOINT}/me`, updatedData);
         console.log("profileService: Update profile response", response.data);
         if (response.data?.success && response.data?.user) {
             return response.data.user;
         } else {
             throw new Error(response.data?.error || 'Failed to update profile.');
         }
     } catch (error) {
         console.error("profileService: Error updating profile", error.response || error);
         const message = error.response?.data?.error || error.message || 'Error updating profile.';
         throw new Error(message);
     }
};

// Optional: Add change password service function here if implementing
// export const changeMyPassword = async (passwordData) => { ... api.put('/profile/change-password', passwordData) ... };