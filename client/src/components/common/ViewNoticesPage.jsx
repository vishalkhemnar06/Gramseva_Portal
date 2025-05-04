import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getNotices, deleteNotice } from '../../services/noticeService';
import NoticeCard from '../../components/notices/NoticeCard';
import PaginationControls from '../../components/common/PaginationControls';
import { FiAlertTriangle, FiInfo } from 'react-icons/fi';

function ViewNoticesPage() {
    const { user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [actionError, setActionError] = useState(null);

    const isSarpanch = user?.role === 'sarpanch';

    const fetchNotices = useCallback(async (page = 1) => {
        setIsLoading(true); 
        setError(null); 
        setActionError(null);
        try {
            const data = await getNotices({ page: page, limit: 5 });
            setNotices(data.notices || []);
            setCurrentPage(data.page || 1); 
            setTotalPages(data.pages || 0); 
            setTotalCount(data.totalCount || 0);
        } catch (err) { 
            setError(err.message || 'Failed to fetch notices.');
        } finally { 
            setIsLoading(false); 
        }
    }, []);

    useEffect(() => { 
        fetchNotices(currentPage); 
    }, [currentPage, fetchNotices]);

    const handlePageChange = (newPage) => { 
        if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage); 
    };

    const handleDelete = async (noticeId, noticeHeading) => {
        if (!isSarpanch) return;
        setActionError(null);
        if (window.confirm(`Are you sure you want to delete the notice "${noticeHeading}"? This action cannot be undone.`)) {
            setIsLoading(true);
            try {
                await deleteNotice(noticeId);
                alert('Notice deleted successfully.');
                if (notices.length === 1 && currentPage > 1) {
                    handlePageChange(currentPage - 1);
                } else {
                    fetchNotices(currentPage);
                }
            } catch (err) { 
                setActionError(err.message || 'Failed to delete notice.'); 
                alert(`Error: ${err.message}`); 
                setIsLoading(false); 
            }
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">Village Notices</h1>
                            <p className="text-gray-600">Stay updated with the latest announcements</p>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg mt-4 md:mt-0">
                            <FiInfo className="text-blue-600" />
                            <span className="font-medium text-gray-800">{totalCount}</span>
                            <span className="text-gray-600 hidden sm:inline">Total Notices</span>
                        </div>
                    </div>

                    {/* Error Messages */}
                    {actionError && !isLoading && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start">
                            <FiAlertTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                            <p>{actionError}</p>
                        </div>
                    )}
                    {error && !isLoading && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start">
                            <FiAlertTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && notices.length === 0 && (
                        <div className="text-center py-12">
                            <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No notices posted yet</h3>
                            <p className="mt-1 text-gray-500">Check back later for updates</p>
                        </div>
                    )}

                    {/* Notices List */}
                    {!isLoading && !error && notices.length > 0 && (
                        <div className="space-y-4">
                            {notices.map((notice) => (
                                <NoticeCard
                                    key={notice._id}
                                    notice={notice}
                                    showActions={isSarpanch}
                                    onDelete={handleDelete}
                                    showViewCount={false}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && totalPages > 1 && (
                        <div className="mt-6">
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

export default ViewNoticesPage;