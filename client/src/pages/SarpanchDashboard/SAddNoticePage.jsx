// client/src/pages/SarpanchDashboard/SAddNoticePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNotice } from '../../services/noticeService';
import InputField from '../../components/common/InputField';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

function SAddNoticePage() {
    const [formData, setFormData] = useState({ heading: '', details: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => { 
        setError(null); 
        setSuccess(''); 
    }, [formData]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.heading.trim() || !formData.details.trim()) {
            setError("Heading and Details are required."); 
            return;
        }
        setIsLoading(true); 
        setError(null); 
        setSuccess('');

        const dataToSubmit = {
            heading: formData.heading.trim(),
            details: formData.details.trim(),
        };

        try {
            await addNotice(dataToSubmit);
            setSuccess('Notice added successfully! Redirecting...');
            setFormData({ heading: '', details: '' });
            setTimeout(() => navigate('/sarpanch-dashboard/view-notices'), 1500);
        } catch (err) {
            setError(err.message || 'Failed to add notice.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Create New Notice</h1>
                        <div className="w-8"></div> {/* Spacer for alignment */}
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg flex items-center">
                            <FiCheckCircle className="mr-2 text-green-600" />
                            <p>{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField 
                            id="heading" 
                            name="heading" 
                            label="Notice Heading" 
                            value={formData.heading} 
                            onChange={handleChange} 
                            required 
                            disabled={isLoading} 
                            maxLength={150} 
                            placeholder="Enter a clear and concise heading"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="details">
                                Notice Details <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                id="details" 
                                name="details" 
                                rows={8}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Provide all the important details here..."
                                value={formData.details}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Write clearly and include all necessary information
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding...
                                    </>
                                ) : (
                                    'Publish Notice'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SAddNoticePage;