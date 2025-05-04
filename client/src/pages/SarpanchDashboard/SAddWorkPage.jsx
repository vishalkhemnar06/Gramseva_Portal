import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addWorkDone } from '../../services/workService';
import InputField from '../../components/common/InputField';
import { FiCalendar, FiCheckCircle, FiLoader, FiArrowLeft } from 'react-icons/fi';

function SAddWorkPage() {
    const currentYear = new Date().getFullYear();
    const [formData, setFormData] = useState({ 
        year: currentYear, 
        details: '' 
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => { 
        setError(null); 
        setSuccess(''); 
    }, [formData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const yearNum = Number(formData.year);
        
        if (!formData.details.trim() || !formData.year || isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
            setError("Please enter a valid year (1900-" + (currentYear + 1) + ") and work details");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess('');

        try {
            await addWorkDone({
                year: yearNum,
                details: formData.details.trim()
            });
            
            setSuccess('Work record added successfully!');
            setFormData({ year: currentYear, details: '' });
            setTimeout(() => navigate('/sarpanch-dashboard/view-work'), 1500);
        } catch (err) {
            setError(err.message || 'Failed to add work record.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Add Work Record</h1>
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
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <FiCalendar className="text-blue-600" size={18} />
                            </div>
                            <InputField 
                                id="year"
                                name="year"
                                type="number"
                                label="Year of Work"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                min="1900"
                                max={currentYear + 1}
                                className="flex-grow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="details">
                                Work Details <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="details"
                                name="details"
                                rows={8}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Describe the work completed, including location, scope, and impact..."
                                value={formData.details}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Provide clear details about the development work completed
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
                                        <FiLoader className="animate-spin mr-2" size={16} />
                                        Adding...
                                    </>
                                ) : (
                                    'Add Work Record'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SAddWorkPage;