// client/src/components/complaints/ComplaintItem.jsx
import React from 'react';
import { format } from 'date-fns'; // For formatting dates npm install date-fns

const ComplaintItem = ({ complaint, isSarpanchView = false }) => {
    // Determine badge color based on status
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Viewed': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Replied': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Safely format dates, provide fallback
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'PPpp'); // Format like: Jul 22, 2024, 1:30:45 PM
        } catch (error) {
            console.error("Error formatting date:", dateString, error);
            return 'Invalid Date';
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 mr-4">{complaint.subject}</h3>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getStatusBadgeColor(complaint.status)}`}>
                    {complaint.status}
                </span>
            </div>

            {/* Show submitter info only for Sarpanch view */}
            {isSarpanchView && complaint.submittedBy && (
                <div className="text-xs text-gray-500 mb-2">
                    <span>Submitted by: <span className="font-medium">{complaint.submittedBy.name || 'N/A'}</span></span>
                    {complaint.submittedBy.mobile && <span className="ml-2"> | Mobile: {complaint.submittedBy.mobile}</span>}
                    {/* {complaint.submittedBy.email && <span className="ml-2"> | Email: {complaint.submittedBy.email}</span>} */}
                </div>
             )}

            <p className="text-sm text-gray-600 mb-3">{complaint.details}</p>

            <div className="text-xs text-gray-500 border-t pt-2 mt-2">
                <p>Submitted On: {formatDate(complaint.submittedAt || complaint.createdAt)}</p>
                {complaint.status === 'Replied' && (
                    <>
                        <p className="mt-2 font-semibold text-green-700">Reply:</p>
                        <p className="text-sm text-gray-700 bg-green-50 p-2 rounded mt-1">{complaint.reply}</p>
                        <p className="mt-1">Replied By: {complaint.repliedBy?.name || 'Sarpanch'} on {formatDate(complaint.repliedAt)}</p>
                    </>
                )}
                 {/* Optionally show viewedAt if implemented/needed */}
                 {/* {complaint.status === 'Viewed' && complaint.viewedAt && (
                     <p className="mt-1 text-blue-600">Viewed on: {formatDate(complaint.viewedAt)}</p>
                 )} */}
            </div>

            {/* Add Reply Button/Area for Sarpanch View Later */}
            {/* {isSarpanchView && complaint.status !== 'Replied' && ( ... Reply Button ... )} */}

        </div>
    );
};

export default ComplaintItem;