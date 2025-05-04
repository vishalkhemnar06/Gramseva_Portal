import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSchemes, deleteScheme } from '../../services/schemeService';
import SchemeCard from '../../components/schemes/SchemeCard';
import PaginationControls from '../../components/common/PaginationControls';
import { FiAlertTriangle, FiInfo, FiLoader } from 'react-icons/fi';

function ViewSchemesPage() {
    const { user } = useAuth();
    const [schemes, setSchemes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [actionError, setActionError] = useState(null);

    const isSarpanch = user?.role === 'sarpanch';

    const fetchSchemes = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        setActionError(null);
        try {
            const data = await getSchemes({ page: page, limit: 6 });
            setSchemes(data.schemes || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.pages || 0);
            setTotalCount(data.totalCount || 0);
        } catch (err) {
            setError(err.message || 'Failed to fetch schemes.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSchemes(currentPage);
    }, [currentPage, fetchSchemes]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
    };

    const handleDelete = async (schemeId, schemeHeading) => {
        if (!isSarpanch) return;
        setActionError(null);
        if (window.confirm(`Are you sure you want to delete the scheme "${schemeHeading}"?`)) {
            setIsLoading(true);
            try {
                await deleteScheme(schemeId);
                alert('Scheme deleted successfully.');
                if (schemes.length === 1 && currentPage > 1) {
                    handlePageChange(currentPage - 1);
                } else {
                    fetchSchemes(currentPage);
                }
            } catch (err) {
                setActionError(err.message || 'Failed to delete scheme.');
                alert(`Error: ${err.message}`);
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">Government Schemes</h1>
                            <p className="text-gray-600">Browse available government schemes for villagers</p>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg mt-4 md:mt-0">
                            <FiInfo className="text-blue-600" />
                            <span className="font-medium text-gray-800">{totalCount}</span>
                            <span className="text-gray-600 hidden sm:inline">Total Schemes</span>
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
                    {!isLoading && !error && schemes.length === 0 && (
                        <div className="text-center py-12">
                            <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No schemes available</h3>
                            <p className="mt-1 text-gray-500">Check back later for new government schemes</p>
                        </div>
                    )}

                    {/* Schemes Grid */}
                    {!isLoading && !error && schemes.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {schemes.map((scheme) => (
                                <SchemeCard
                                    key={scheme._id}
                                    scheme={scheme}
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

export default ViewSchemesPage;