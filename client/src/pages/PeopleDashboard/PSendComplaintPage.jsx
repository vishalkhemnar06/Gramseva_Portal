import React from 'react';
import SendComplaintForm from '../../components/complaints/SendComplaintForm';
import { FiAlertTriangle } from 'react-icons/fi';

function PSendComplaintPage() {
    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <FiAlertTriangle className="text-red-500" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Submit a Complaint</h1>
                            <p className="text-gray-600">Report issues to your Gram Panchayat</p>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                        <SendComplaintForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PSendComplaintPage;