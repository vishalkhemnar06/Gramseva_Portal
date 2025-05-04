import React from 'react';
import { format } from 'date-fns';
import { FiTrash2, FiUser, FiCalendar, FiHardDrive } from 'react-icons/fi';

const WorkDoneCard = ({
    workRecord,
    showActions = false,
    onDelete,
    className = '',
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try { 
            return format(new Date(dateString), 'PP'); // e.g., "Jul 23, 2023"
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete?.(workRecord._id, `Work from ${workRecord.year}`);
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col h-full ${className}`}>
            <div className="p-5 flex flex-col flex-grow">
                {/* Header with icon and title */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <FiHardDrive className="text-green-600" size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                            {workRecord.year} Work Report
                        </h3>
                    </div>
                    {showActions && onDelete && (
                        <button 
                            onClick={handleDeleteClick}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Delete record"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    )}
                </div>
                
                {/* Work details */}
                <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">
                    {workRecord.details}
                </p>
                
                {/* Footer with metadata */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1 text-xs text-gray-500">
                            <span className="flex items-center gap-2">
                                <FiUser size={12} className="text-gray-400" />
                                <span>{workRecord.addedBy?.name || 'Admin'}</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <FiCalendar size={12} className="text-gray-400" />
                                <span>{formatDate(workRecord.addedAt || workRecord.createdAt)}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkDoneCard;