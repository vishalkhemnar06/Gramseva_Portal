import React, { useState, useEffect } from 'react';
import { getMyComplaints } from '../../services/complaintService';
import ComplaintItem from '../../components/complaints/ComplaintItem';
import { FiAlertTriangle, FiInbox, FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

function PMyComplaintsPage() {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const fetchComplaints = async (page = 1) => {
        const loading = page === 1 ? setIsLoading : setRefreshing;
        loading(true);
        setError(null);
        try {
            const data = await getMyComplaints({ page: page, limit: 10 });
            setComplaints(data.complaints || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.pages || 0);
            setTotalCount(data.totalCount || 0);
        } catch (err) {
            setError(err.message || 'Failed to fetch your complaints.');
            setComplaints([]);
        } finally {
            loading(false);
        }
    };

    useEffect(() => {
        fetchComplaints(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleRefresh = () => {
        fetchComplaints(currentPage);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center">
                            <FiAlertTriangle className="mr-3" />
                            My Submitted Complaints
                        </h1>
                        <p className="text-blue-100 mt-1">
                            {totalCount} {totalCount === 1 ? 'complaint' : 'complaints'} total
                        </p>
                    </div>
                    <button 
                        onClick={handleRefresh}
                        disabled={isLoading || refreshing}
                        className={`p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all ${(isLoading || refreshing) ? 'animate-spin' : ''}`}
                    >
                        <FiRefreshCw />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-600">Loading your complaints...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <motion.div 
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded"
                    >
                        <div className="flex items-center">
                            <FiAlertTriangle className="text-red-500 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                        <button 
                            onClick={() => fetchComplaints(currentPage)}
                            className="mt-2 text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}

                {/* Empty State */}
                {!isLoading && !error && complaints.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 text-gray-500"
                    >
                        <FiInbox className="text-4xl mb-3 opacity-60" />
                        <p className="text-lg">No complaints submitted yet</p>
                        <p className="text-sm mt-1">Your submitted complaints will appear here</p>
                    </motion.div>
                )}

                {/* Complaints List */}
                {!isLoading && !error && complaints.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {complaints.map((complaint) => (
                            <ComplaintItem 
                                key={complaint._id} 
                                complaint={complaint}
                                className="hover:shadow-md transition-shadow"
                            />
                        ))}
                    </motion.div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mt-8 flex items-center justify-between"
                    >
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1 || isLoading}
                            className="flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <FiChevronLeft className="mr-1" />
                            Previous
                        </button>
                        
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages || isLoading}
                            className="flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <FiChevronRight className="ml-1" />
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default PMyComplaintsPage;