import React from 'react';
import { format } from 'date-fns';
import { FiTrash2, FiUser, FiCalendar, FiBriefcase } from 'react-icons/fi';

const SERVER_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5001';

const JobCard = ({ job, showActions = false, onDelete, className = '' }) => {
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'PP'); // e.g., "Jul 23, 2023"
        } catch (error) {
            return 'Invalid date';
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        return `${SERVER_URL}/${path.replace(/^\/+/, '')}`;
    };

    const imageUrl = job?.imageUrl ? getImageUrl(job.imageUrl) : null;

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete?.(job._id, job.heading);
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md flex flex-col h-full ${className}`}>
            {/* Image Section */}
            {imageUrl && (
                <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                    <img 
                        src={imageUrl} 
                        alt={job.heading}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement.classList.add('bg-gradient-to-br', 'from-blue-50', 'to-gray-100');
                        }}
                    />
                    {showActions && onDelete && (
                        <button
                            onClick={handleDeleteClick}
                            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 rounded-full p-2 shadow-sm transition-all hover:scale-110"
                            title="Delete job"
                        >
                            <FiTrash2 size={14} />
                        </button>
                    )}
                </div>
            )}

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-start gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <FiBriefcase className="text-blue-600" size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 leading-snug mt-1">
                        {job.heading}
                    </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {job.details}
                </p>
                
                {/* Footer with metadata */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1 text-xs text-gray-500">
                            {job.postedBy && (
                                <span className="flex items-center gap-2">
                                    <FiUser size={12} className="text-gray-400" />
                                    <span>{job.postedBy.name || 'Unknown'}</span>
                                </span>
                            )}
                            
                            {job.createdAt && (
                                <span className="flex items-center gap-2">
                                    <FiCalendar size={12} className="text-gray-400" />
                                    <span>{formatDate(job.createdAt)}</span>
                                </span>
                            )}
                        </div>
                        
                        {!imageUrl && showActions && onDelete && (
                            <button 
                                onClick={handleDeleteClick}
                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                title="Delete job"
                            >
                                <FiTrash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCard;