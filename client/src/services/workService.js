// client/src/services/workService.js
import api from './api'; // Your configured axios instance

const API_ENDPOINT = '/works';

/**
 * Adds a new work done record (TEXT ONLY).
 * @param {object} workData - Object containing { year, details }.
 * @returns {Promise<object>} - Promise resolving with the created work record object.
 */
export const addWorkDone = async (workData) => {
    try {
        // Prepare only the text data
        const dataToSend = {
            year: workData.year,
            details: workData.details
            // No imageUrls field sent
        };
        console.log("workService: Attempting POST /works (JSON - Text Only)", dataToSend);

        // Sending standard application/json
        const response = await api.post(API_ENDPOINT, dataToSend); // No special headers needed

        console.log("workService: Add work response", response.data);
        if (response.data?.success && response.data?.workRecord) {
            return response.data.workRecord;
        } else {
            throw new Error(response.data?.error || 'Failed to add work record - invalid response.');
        }
    } catch (error) {
        console.error("workService: Error adding work record", error.response || error);
        const message = error.response?.data?.error || error.message || 'An error occurred while adding the work record.';
        throw new Error(message);
    }
};

/**
 * Gets work done records for the user's village with pagination and year filter.
 * @param {object} params - Object containing page, limit, year.
 */
export const getWorkDone = async ({ page = 1, limit = 10, year = '' } = {}) => {
     try {
         const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
         if (year) queryParams.append('year', String(year));
         const url = `${API_ENDPOINT}?${queryParams.toString()}`;
         console.log(`workService: Calling GET ${url}`);
         const response = await api.get(url);
         console.log(`workService: Response for GET ${url}`, response.data);
         if (response.data?.success && Array.isArray(response.data.workRecords)) {
             return response.data;
         } else if (response.data?.success && !response.data?.workRecords) {
             console.warn("workService: getWorkDone received success but missing workRecords array.");
             return { ...response.data, workRecords: [], count:0, totalCount:0, pages:0 };
         } else {
            throw new Error(response.data?.error || 'Failed to fetch work records - invalid response.');
         }
     } catch (error) {
         console.error("workService: Error fetching work records", error.response || error);
         const message = error.response?.data?.error || error.message || 'Error fetching work records.';
         throw new Error(message);
     }
};

/**
 * Deletes a work done record by ID (for Sarpanch).
 */
export const deleteWorkDone = async (workRecordId) => {
    if (!workRecordId) throw new Error("Work Record ID required.");
     try {
         const url = `${API_ENDPOINT}/${workRecordId}`;
         console.log(`workService: Calling DELETE ${url}`);
         const response = await api.delete(url);
         console.log(`workService: Response for DELETE ${url}`, response.data);
         if (response.data?.success) {
             return response.data;
         } else {
            throw new Error(response.data?.error || 'Failed to delete work record.');
         }
     } catch (error) {
          console.error(`workService: Error deleting work record ${workRecordId}`, error.response || error);
         const message = error.response?.data?.error || error.message || 'Error deleting work record.';
         throw new Error(message);
     }
};