// client/src/services/jobService.js
import api from './api';
const API_ENDPOINT = '/jobs';

// ADD Job (Handles Optional FormData)
export const addJob = async (formData) => { // Expects FormData
    try {
        console.log("jobService: Attempting POST /jobs (FormData)");
        const response = await api.post(API_ENDPOINT, formData, {
            headers: { 
                // Let browser set correct Content-Type for multipart/form-data
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("jobService: Add job response", response.data);
        if (response.data?.success) return response.data.job;
        throw new Error(response.data?.message || 'Failed to add job posting.');
    } catch (error) {
        console.error("jobService: Error adding job", error.response || error);
        const message = error.response?.data?.message || error.message || 'An error occurred while adding the job posting.';
        throw new Error(message);
    }
};

// GET Jobs (Pagination)
export const getJobs = async (page = 1, limit = 9) => {
    try {
        const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
        const url = `${API_ENDPOINT}?${queryParams.toString()}`;
        console.log("jobService: Fetching jobs from:", url);
        const response = await api.get(url);
        
        console.log("jobService: Get jobs response:", response.data);
        if (response.data?.success) {
            return {
                data: {
                    jobs: response.data.jobs || [],
                    totalPages: response.data.pages || 0,
                    totalCount: response.data.totalCount || 0,
                    page: response.data.page || 1
                }
            };
        } else {
            throw new Error(response.data?.message || 'Failed to fetch job postings.');
        }
    } catch (error) {
        console.error("jobService: Error fetching jobs", error.response || error);
        const message = error.response?.data?.message || error.message || 'An error occurred while fetching job postings.';
        throw new Error(message);
    }
};

// DELETE Job
export const deleteJob = async (jobId) => {
    if (!jobId) throw new Error("Job ID required.");
    try {
        const url = `${API_ENDPOINT}/${jobId}`;
        console.log("jobService: Deleting job:", url);
        const response = await api.delete(url);
        if (response.data?.success) {
            return response.data;
        } else {
            throw new Error(response.data?.message || 'Failed to delete job posting.');
        }
    } catch (error) {
        console.error("jobService: Error deleting job", error.response || error);
        const message = error.response?.data?.message || error.message || 'An error occurred while deleting the job posting.';
        throw new Error(message);
    }
};