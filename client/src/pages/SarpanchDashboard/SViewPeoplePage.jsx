// client/src/pages/SarpanchDashboard/SViewPeoplePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getPeopleForSarpanch, deletePersonBySarpanch } from '../../services/userService';
import PaginationControls from '../../components/common/PaginationControls';
import { FiSearch, FiEdit, FiTrash2, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import EditPersonModal from '../../components/people/EditPersonModal';

const SERVER_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5001';

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function SViewPeoplePage() {
    // State declarations
    const [peopleList, setPeopleList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [actionError, setActionError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const debouncedSetSearch = useCallback(debounce(setDebouncedSearchTerm, 500), []);

    const fetchPeople = useCallback(async (page = 1, search = '') => {
        setIsLoading(true);
        setError(null);
        setActionError(null);
        try {
            const data = await getPeopleForSarpanch(search, page, 10);
            if (data && data.success && Array.isArray(data.people)) {
                 setPeopleList(data.people);
                 setCurrentPage(data.page || 1);
                 setTotalPages(data.pages || 0);
                 setTotalCount(data.totalCount || 0);
            } else {
                setError(data?.error || 'Received invalid data format from server.');
                setPeopleList([]);
                setTotalCount(0);
                setTotalPages(0);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch people list.');
            setPeopleList([]);
            setTotalCount(0);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
       debouncedSetSearch(searchTerm);
    }, [searchTerm, debouncedSetSearch]);

    useEffect(() => {
       fetchPeople(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm, fetchPeople]);

    const handleSearchChange = (e) => {
        if (currentPage !== 1) {
             setCurrentPage(1);
        }
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    const handleUpdate = (personId) => {
        setActionError(null);
        const person = peopleList.find(p => p._id === personId);
        if (person) {
            setSelectedPerson(person);
            setShowEditModal(true);
        } else {
            setActionError('Could not find user details for editing.');
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setSelectedPerson(null);
    };

    const handleUpdateSuccess = () => {
        fetchPeople(currentPage, debouncedSearchTerm);
    };

    const handleDelete = async (personId, personName) => {
        setActionError(null);
        if (window.confirm(`Are you sure you want to delete ${personName}'s record? This action cannot be undone.`)) {
            setIsLoading(true);
            try {
                const result = await deletePersonBySarpanch(personId);
                alert(result.message || `${personName} deleted successfully.`);
                fetchPeople(currentPage, debouncedSearchTerm);
            } catch (err) {
                const errorMsg = err.message || 'Failed to delete person.';
                setActionError(errorMsg);
                alert(`Error deleting ${personName}: ${errorMsg}`);
                setIsLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'PP');
        } catch (error) { return 'Invalid Date'; }
    };

    const getProfileImageUrl = (photoPath) => {
        const defaultIcon = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" /></svg>')}`;
        if (!photoPath || photoPath === 'no-photo.jpg') {
            return defaultIcon;
        }
        return `${SERVER_URL}/${photoPath}`;
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Village Members</h1>
                    <p className="text-gray-600">Manage all registered members of your village</p>
                </div>

                {/* Search and Stats Bar */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                type="search"
                                placeholder="Search by name, mobile, or Aadhaar..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-lg">
                            <FiUser className="text-green-600" size={20} />
                            <span className="font-semibold text-gray-800">{totalCount}</span>
                            <span className="text-gray-600 hidden sm:inline">Total Members</span>
                        </div>
                    </div>
                </div>

                {/* Error Messages */}
                {actionError && !isLoading && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                        <p>{actionError}</p>
                    </div>
                )}
                {error && !isLoading && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12 bg-white rounded-xl shadow-sm">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                )}

                {/* No Results Message */}
                {!isLoading && !error && peopleList.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No members found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search criteria</p>
                    </div>
                )}

                {/* People Table */}
                {!isLoading && !error && peopleList.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhaar</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {peopleList.map((person) => (
                                        <tr key={person._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img 
                                                            className="h-10 w-10 rounded-full border-2 border-white shadow-sm" 
                                                            src={getProfileImageUrl(person.profilePhoto)} 
                                                            alt={person.name}
                                                            onError={(e) => { e.target.onerror = null; e.target.src = getProfileImageUrl(null); }}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                                                        <div className="text-sm text-gray-500 truncate max-w-[180px]">{person.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{person.mobile}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{person.aadhaarNo}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{formatDate(person.registeredAt || person.createdAt)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        title="Edit Member"
                                                        onClick={() => handleUpdate(person._id)}
                                                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                                                        disabled={isLoading}
                                                    >
                                                        <FiEdit size={18} />
                                                    </button>
                                                    <button
                                                        title="Delete Member"
                                                        onClick={() => handleDelete(person._id, person.name)}
                                                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                        disabled={isLoading}
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </div>

            {/* Edit Person Modal */}
            {showEditModal && selectedPerson && (
                <EditPersonModal
                    personData={selectedPerson}
                    onClose={handleCloseModal}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
}

export default SViewPeoplePage;