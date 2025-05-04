import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getWorkDone, deleteWorkDone } from '../../services/workService';
import WorkDoneCard from '../../components/workdone/WorkDoneCard';
import PaginationControls from '../../components/common/PaginationControls';
import { FiCalendar, FiAlertTriangle, FiInfo, FiLoader } from 'react-icons/fi';

function ViewWorkDonePage() {
    const { user } = useAuth();
    const [workRecords, setWorkRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [actionError, setActionError] = useState(null);
    const [selectedYear, setSelectedYear] = useState('');

    const isSarpanch = user?.role === 'sarpanch';
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 11 }, (_, i) => currentYear + 1 - i);

    const fetchWorkRecords = useCallback(async (page = 1, year = '') => {
        setIsLoading(true);
        setError(null);
        setActionError(null);
        try {
            const data = await getWorkDone({ page, limit: 5, year });
            setWorkRecords(data.workRecords || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.pages || 0);
            setTotalCount(data.totalCount || 0);
        } catch (err) {
            setError(err.message || 'Failed to fetch work records.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkRecords(currentPage, selectedYear);
    }, [currentPage, selectedYear, fetchWorkRecords]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
        setCurrentPage(1);
    };

    const handleDelete = async (recordId, recordYear) => {
        if (!isSarpanch) return;
        setActionError(null);
        if (window.confirm(`Are you sure you want to delete the work record from ${recordYear}?`)) {
            setIsLoading(true);
            try {
                await deleteWorkDone(recordId);
                alert('Work record deleted successfully.');
                if (workRecords.length === 1 && currentPage > 1) {
                    handlePageChange(currentPage - 1);
                } else {
                    fetchWorkRecords(currentPage, selectedYear);
                }
            } catch (err) {
                setActionError(err.message || 'Failed to delete record.');
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
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">Gram Panchayat Work Records</h1>
                            <p className="text-gray-600">View development work completed by the village</p>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg mt-4 md:mt-0">
                            <FiInfo className="text-blue-600" />
                            <span className="font-medium text-gray-800">{totalCount}</span>
                            <span className="text-gray-600 hidden sm:inline">Total Records</span>
                        </div>
                    </div>

                    {/* Year Filter */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <FiCalendar className="text-gray-500" />
                                <label htmlFor="yearFilter" className="font-medium text-gray-700 whitespace-nowrap">
                                    Filter by Year:
                                </label>
                                <select
                                    id="yearFilter"
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none w-full sm:w-auto"
                                    disabled={isLoading}
                                >
                                    <option value="">All Years</option>
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
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
                            <FiLoader className="animate-spin text-blue-500" size={24} />
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && workRecords.length === 0 && (
                        <div className="text-center py-12">
                            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No work records found</h3>
                            <p className="mt-1 text-gray-500">
                                {selectedYear ? `No records for ${selectedYear}` : 'No work records available yet'}
                            </p>
                        </div>
                    )}

                    {/* Work Records List */}
                    {!isLoading && !error && workRecords.length > 0 && (
                        <div className="space-y-4">
                            {workRecords.map((record) => (
                                <WorkDoneCard
                                    key={record._id}
                                    workRecord={record}
                                    showActions={isSarpanch}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && totalPages > 1 && (
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

export default ViewWorkDonePage;