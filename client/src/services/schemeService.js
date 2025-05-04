// client/src/services/schemeService.js
import api from './api'; // Your configured axios instance

const API_ENDPOINT = '/schemes';

/**
 * Adds a new scheme (text only).
 * @param {object} schemeData - Object containing { heading, details }. imageUrl is ignored/not sent.
 * @returns {Promise<object>} - Promise resolving with the created scheme object.
 */
export const addScheme = async (schemeData) => {
    try {
        console.log("schemeService: Attempting POST /schemes (JSON)", schemeData);
        // Sending JSON data
        const response = await api.post(API_ENDPOINT, {
            heading: schemeData.heading,
            details: schemeData.details
            // Not sending imageUrl as backend doesn't handle file upload for schemes currently
        });
        console.log("schemeService: Add scheme response", response.data);
        if (response.data?.success) {
            return response.data.scheme;
        } else {
            throw new Error(response.data?.error || 'Failed to add scheme.');
        }
    } catch (error) {
        console.error("schemeService: Error adding scheme", error.response || error);
        const message = error.response?.data?.error || error.message || 'An error occurred while adding the scheme.';
        throw new Error(message);
    }
};

/**
 * Gets schemes for the user's village with pagination.
 */
export const getSchemes = async ({ page = 1, limit = 10 } = {}) => {
     try {
         const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
         const url = `${API_ENDPOINT}?${queryParams.toString()}`;
         console.log(`schemeService: Calling GET ${url}`);
         const response = await api.get(url);
         console.log(`schemeService: Response for GET ${url}`, response.data);
         if (response.data?.success) {
             response.data.schemes = response.data.schemes || []; // Ensure array exists
             return response.data; // { schemes, page, pages, totalCount, count }
         } else {
            throw new Error(response.data?.error || 'Failed to fetch schemes.');
         }
     } catch (error) {
         console.error("schemeService: Error fetching schemes", error.response || error);
         const message = error.response?.data?.error || error.message || 'Error fetching schemes.';
         throw new Error(message);
     }
};

/**
 * Deletes a scheme by ID (for Sarpanch).
 */
export const deleteScheme = async (schemeId) => {
    if (!schemeId) throw new Error("Scheme ID required.");
     try {
         const url = `${API_ENDPOINT}/${schemeId}`;
         console.log(`schemeService: Calling DELETE ${url}`);
         const response = await api.delete(url);
         console.log(`schemeService: Response for DELETE ${url}`, response.data);
         if (response.data?.success) {
             return response.data; // { success: true, message: ... }
         } else {
            throw new Error(response.data?.error || 'Failed to delete scheme.');
         }
     } catch (error) {
          console.error(`schemeService: Error deleting scheme ${schemeId}`, error.response || error);
         const message = error.response?.data?.error || error.message || 'Error deleting scheme.';
         throw new Error(message);
     }
};