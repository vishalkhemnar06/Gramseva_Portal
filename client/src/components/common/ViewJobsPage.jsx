import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getJobs, deleteJob } from '../../services/jobService';
import JobCard from '../../components/jobs/JobCard';
import PaginationControls from '../../components/common/PaginationControls';
import { FiBriefcase, FiAlertTriangle, FiLoader } from 'react-icons/fi';

function ViewJobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [actionError, setActionError] = useState(null);
    const isSarpanch = user?.role === 'sarpanch';

    const fetchJobs = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getJobs(page);
            setJobs(response.data.jobs);
            setTotalPages(response.data.totalPages);
            setTotalCount(response.data.totalCount);
        } catch (err) {
            setError(err.message || 'Failed to load job listings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs(currentPage);
    }, [currentPage, fetchJobs]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = async (jobId, jobHeading) => {
        if (!window.confirm(`Are you sure you want to delete the job "${jobHeading}"?`)) {
            return;
        }

        setActionError(null);
        try {
            await deleteJob(jobId);
            fetchJobs(currentPage);
        } catch (err) {
            setActionError(err.message || 'Failed to delete job. Please try again.');
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">Job Opportunities</h1>
                            <p className="text-gray-600">Browse available job postings in the village</p>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg mt-4 md:mt-0">
                            <FiBriefcase className="text-blue-600" />
                            <span className="font-medium text-gray-800">{totalCount}</span>
                            <span className="text-gray-600 hidden sm:inline">Total Jobs</span>
                        </div>
                    </div>

                    {/* Error Messages */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start">
                            <FiAlertTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {actionError && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start">
                            <FiAlertTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                            <p>{actionError}</p>
                        </div>
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <FiLoader className="animate-spin text-blue-500" size={24} />
                        </div>
                    )}

                    {/* No Results Message */}
                    {!isLoading && !error && jobs.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No job opportunities</h3>
                            <p className="mt-1 text-gray-500">Check back later for new postings</p>
                        </div>
                    )}

                    {/* Job Cards Grid */}
                    {!isLoading && !error && jobs.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    showActions={isSarpanch}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8">
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewJobsPage;