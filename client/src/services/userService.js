// client/src/services/userService.js
import api from './api';

// Fetches list of people for the Sarpanch's village.
export const getPeopleForSarpanch = async (searchTerm = '', page = 1, limit = 10) => {
    try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (page > 0) params.append('page', page);
        if (limit > 0) params.append('limit', limit);
        const url = `/users/people?${params.toString()}`;
        console.log(`userService: Calling GET ${url}`);
        const response = await api.get(url);
        console.log(`userService: Response for ${url}`, response.data);
        if (response.data && response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data?.error || 'Failed to fetch people list.');
        }
    } catch (error) {
        console.error("userService: Error fetching people", error.response || error);
        throw new Error(error.response?.data?.error || error.message || 'An error occurred while fetching people.');
    }
};

// Updates details for a specific person (by Sarpanch).
export const updatePersonBySarpanch = async (personId, updatedData) => {
    try {
        const response = await api.put(`/users/people/${personId}`, updatedData);
        if (response.data && response.data.success) {
            return response.data.person; // Return updated person
        } else {
            throw new Error(response.data?.error || 'Failed to update person details.');
        }
    } catch (error) {
        console.error(`userService: Error updating person ${personId}`, error.response || error);
        throw new Error(error.response?.data?.error || error.message || 'An error occurred while updating person details.');
    }
};

// Deletes a specific person's record (by Sarpanch).
export const deletePersonBySarpanch = async (personId) => {
    try {
        const response = await api.delete(`/users/people/${personId}`);
        if (response.data && response.data.success) {
            return response.data; // Return success message/data
        } else {
            throw new Error(response.data?.error || 'Failed to delete person.');
        }
    } catch (error) {
        console.error(`userService: Error deleting person ${personId}`, error.response || error);
        throw new Error(error.response?.data?.error || error.message || 'An error occurred while deleting person.');
    }
};

// Optional: Get specific person details (if needed for Edit Modal pre-fetch)
// export const getPersonByIdForSarpanch = async (personId) => { ... };