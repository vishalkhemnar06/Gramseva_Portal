import React from 'react';
import { format } from 'date-fns';
import { FiTrash2, FiUser, FiCalendar } from 'react-icons/fi';

const NoticeCard = ({
    notice,
    showActions = false,
    onDelete,
    className = '',
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try { 
            return format(new Date(dateString), 'PP'); // e.g., Jul 23, 2024
        } catch (error) { 
            return 'Invalid Date'; 
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (onDelete && notice?._id) {
            onDelete(notice._id, notice.heading);
        }
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}>
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2" title={notice.heading}>
                        {notice.heading}
                    </h3>
                    {showActions && onDelete && (
                        <button
                            onClick={handleDeleteClick}
                            className="text-red-500 hover:text-red-700 p-1 -m-1 transition-colors"
                            title="Delete Notice"
                            aria-label="Delete Notice"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">
                    {notice.details}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                        <FiUser className="mr-1.5 text-gray-400" size={14} />
                        <span className="truncate max-w-[120px]">
                            {notice.createdBy?.name || 'Admin'}
                        </span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                        <FiCalendar className="mr-1.5 text-gray-400" size={14} />
                        <span>
                            {formatDate(notice.publishedAt || notice.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeCard;