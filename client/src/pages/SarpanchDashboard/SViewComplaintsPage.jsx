import React, { useState, useEffect } from 'react';
import { getComplaintsForVillage, replyToComplaint } from '../../services/complaintService';
import ComplaintItem from '../../components/complaints/ComplaintItem';
import PaginationControls from '../../components/common/PaginationControls';
import ReplyModal from '../../components/complaints/ReplyModal';
import { FiAlertCircle, FiFilter, FiMessageSquare, FiRefreshCw } from 'react-icons/fi';

function SViewComplaintsPage() {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [filterStatus, setFilterStatus] = useState('');

    // Reply modal state
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const fetchComplaints = async (page = 1, status = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getComplaintsForVillage({ status, page, limit: 10 });
            setComplaints(data.complaints || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.pages || 0);
            setTotalCount(data.totalCount || 0);
        } catch (err) {
            setError(err.message || 'Failed to fetch complaints.');
            setComplaints([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints(currentPage, filterStatus);
    }, [currentPage, filterStatus]);

    const handleOpenReplyModal = (complaint) => {
        setSelectedComplaint(complaint);
        setShowReplyModal(true);
    };

    const handleCloseReplyModal = () => {
        setShowReplyModal(false);
        setSelectedComplaint(null);
    };

    const handleReplySubmit = async (replyText) => {
        if (!selectedComplaint || !replyText) return false;
        try {
            await replyToComplaint(selectedComplaint._id, replyText);
            handleCloseReplyModal();
            fetchComplaints(currentPage, filterStatus);
            return true;
        } catch (err) {
            alert(`Failed to submit reply: ${err.message}`);
            return false;
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        fetchComplaints(currentPage, filterStatus);
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">Village Complaints</h1>
                            <p className="text-gray-600">Manage and respond to villager complaints</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            <button
                                onClick={handleRefresh}
                                className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                                disabled={isLoading}
                            >
                                <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <FiFilter className="text-gray-500" />
                                <label htmlFor="statusFilter" className="font-medium text-gray-700 whitespace-nowrap">
                                    Filter by Status:
                                </label>
                                <select
                                    id="statusFilter"
                                    value={filterStatus}
                                    onChange={handleFilterChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none w-full sm:w-auto"
                                    disabled={isLoading}
                                >
                                    <option value="">All Complaints</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Viewed">Viewed</option>
                                    <option value="Replied">Replied</option>
                                </select>
                            </div>
                            <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-md border border-gray-200">
                                Total: {totalCount} complaints
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start">
                            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <FiRefreshCw className="animate-spin text-blue-500" size={24} />
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && complaints.length === 0 && (
                        <div className="text-center py-12">
                            <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No complaints found</h3>
                            <p className="mt-1 text-gray-500">
                                {filterStatus ? `No ${filterStatus.toLowerCase()} complaints` : 'No complaints submitted yet'}
                            </p>
                        </div>
                    )}

                    {/* Complaints List */}
                    {!isLoading && !error && complaints.length > 0 && (
                        <div className="space-y-4">
                            {complaints.map((complaint) => (
                                <div key={complaint._id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <ComplaintItem complaint={complaint} isSarpanchView={true} />
                                    {complaint.status !== 'Replied' && (
                                        <div className="bg-gray-50 px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleOpenReplyModal(complaint)}
                                                className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                            >
                                                <FiMessageSquare size={14} />
                                                Reply to Complaint
                                            </button>
                                        </div>
                                    )}
                                </div>
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

            {/* Reply Modal */}
            {showReplyModal && selectedComplaint && (
                <ReplyModal
                    complaint={selectedComplaint}
                    onClose={handleCloseReplyModal}
                    onSubmitReply={handleReplySubmit}
                />
            )}
        </div>
    );
}

export default SViewComplaintsPage;