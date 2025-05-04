// client/src/services/noticeService.js
import api from './api'; // Your configured axios instance

const API_ENDPOINT = '/notices';

/**
 * Adds a new notice (text only).
 * @param {object} noticeData - Object containing { heading, details }.
 * @returns {Promise<object>} - Promise resolving with the created notice object.
 */
export const addNotice = async (noticeData) => {
    try {
        console.log("noticeService: Attempting POST /notices (JSON)", noticeData);
        // Sending JSON data
        const response = await api.post(API_ENDPOINT, noticeData);
        console.log("noticeService: Add notice response", response.data);
        if (response.data?.success) {
            return response.data.notice;
        } else {
            throw new Error(response.data?.error || 'Failed to add notice.');
        }
    } catch (error) {
        console.error("noticeService: Error adding notice", error.response || error);
        const message = error.response?.data?.error || error.message || 'An error occurred while adding the notice.';
        throw new Error(message);
    }
};

/**
 * Gets notices for the user's village with pagination.
 * @param {object} params - Object containing page and limit.
 */
export const getNotices = async ({ page = 1, limit = 10 } = {}) => {
     try {
         const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
         const url = `${API_ENDPOINT}?${queryParams.toString()}`;
         console.log(`noticeService: Calling GET ${url}`);
         const response = await api.get(url);
         console.log(`noticeService: Response for GET ${url}`, response.data);
         if (response.data?.success) {
             response.data.notices = response.data.notices || []; // Ensure array exists
             return response.data; // { notices, page, pages, totalCount, count }
         } else {
            throw new Error(response.data?.error || 'Failed to fetch notices.');
         }
     } catch (error) {
         console.error("noticeService: Error fetching notices", error.response || error);
         const message = error.response?.data?.error || error.message || 'Error fetching notices.';
         throw new Error(message);
     }
};

/**
 * Deletes a notice by ID (for Sarpanch).
 */
export const deleteNotice = async (noticeId) => {
    if (!noticeId) throw new Error("Notice ID required.");
     try {
         const url = `${API_ENDPOINT}/${noticeId}`;
         console.log(`noticeService: Calling DELETE ${url}`);
         const response = await api.delete(url);
         console.log(`noticeService: Response for DELETE ${url}`, response.data);
         if (response.data?.success) {
             return response.data; // { success: true, message: ... }
         } else {
            throw new Error(response.data?.error || 'Failed to delete notice.');
         }
     } catch (error) {
          console.error(`noticeService: Error deleting notice ${noticeId}`, error.response || error);
         const message = error.response?.data?.error || error.message || 'Error deleting notice.';
         throw new Error(message);
     }
};

// NOTE: getNoticeDetail (for view count increment) is removed as the corresponding
// backend route GET /api/notices/:id is commented out in your provided noticeRoutes.js