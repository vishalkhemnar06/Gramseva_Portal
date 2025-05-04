// client/src/services/complaintService.js
import api from './api';

// Fetches village complaints for Sarpanch (supports pagination/status filter)
export const getComplaintsForVillage = async ({ status = '', page = 1, limit = 10 } = {}) => {
    try {
        const params = new URLSearchParams();
        if (status) params.append('status', status); // Allow filtering by 'Pending', 'Viewed', 'Replied'
        if (page > 0) params.append('page', page);
        params.append('limit', limit); // Allow setting page size

        // Endpoint protected by protect & authorize('sarpanch') on backend
        const response = await api.get(`/complaints/village?${params.toString()}`);

        if (response.data && response.data.success) {
            return response.data; // Returns { complaints, page, pages, totalCount, ... }
        } else {
            throw new Error(response.data?.error || 'Failed to fetch village complaints.');
        }
    } catch (error) {
        console.error("complaintService: Error fetching village complaints", error.response || error);
        throw new Error(error.response?.data?.error || error.message || 'An error occurred while fetching village complaints.');
    }
};

// Fetches complaints submitted by the logged-in user (People)
export const getMyComplaints = async ({ page = 1, limit = 10 } = {}) => {
    try {
        const params = new URLSearchParams();
        if (page > 0) params.append('page', page);
        params.append('limit', limit);

         // Endpoint protected by protect & authorize('people') on backend
        const response = await api.get(`/complaints/my-complaints?${params.toString()}`);

         if (response.data && response.data.success) {
            return response.data; // Returns { complaints, page, pages, totalCount, ... }
        } else {
            throw new Error(response.data?.error || 'Failed to fetch your complaints.');
        }
    } catch (error) {
         console.error("complaintService: Error fetching my complaints", error.response || error);
        throw new Error(error.response?.data?.error || error.message || 'An error occurred while fetching your complaints.');
    }
};

// Function to submit a reply (for Sarpanch)
export const replyToComplaint = async (complaintId, replyText) => {
     try {
         // Endpoint protected by protect & authorize('sarpanch') on backend
         const response = await api.put(`/complaints/reply/${complaintId}`, { reply: replyText });

         if (response.data && response.data.success) {
            return response.data.complaint; // Return the updated complaint
        } else {
            throw new Error(response.data?.error || 'Failed to submit reply.');
        }
     } catch (error) {
          console.error("complaintService: Error replying to complaint", error.response || error);
         throw new Error(error.response?.data?.error || error.message || 'An error occurred while submitting the reply.');
     }
};

// Add submitComplaint function if not already present from previous steps
export const submitComplaint = async (complaintData) => {
    try {
         // Endpoint protected by protect & authorize('people') on backend
        const response = await api.post('/complaints', complaintData);
         if (response.data && response.data.success) {
            return response.data.complaint; // Return the created complaint
        } else {
            throw new Error(response.data?.error || 'Failed to submit complaint.');
        }
    } catch (error) {
         console.error("complaintService: Error submitting complaint", error.response || error);
        throw new Error(error.response?.data?.error || error.message || 'An error occurred while submitting the complaint.');
    }
};


// Add other service functions if needed (delete, getById, markAsViewed)