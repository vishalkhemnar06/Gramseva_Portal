import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addScheme } from '../../services/schemeService';
import InputField from '../../components/common/InputField';
import { FiArrowLeft, FiCheckCircle, FiLoader } from 'react-icons/fi';

function SAddSchemePage() {
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
            setError("Scheme heading and details are required");
            return;
        }
        setIsLoading(true); 
        setError(null); 
        setSuccess('');

        try {
            await addScheme({
                heading: formData.heading.trim(),
                details: formData.details.trim()
            });
            setSuccess('Scheme added successfully!');
            setFormData({ heading: '', details: '' });
            setTimeout(() => navigate('/sarpanch-dashboard/view-schemes'), 1500);
        } catch (err) { 
            setError(err.message || 'Failed to add scheme. Please try again.');
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
                        <h1 className="text-2xl font-bold text-gray-800">Add New Scheme</h1>
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
                            label="Scheme Name"
                            value={formData.heading}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            placeholder="Enter the scheme name (e.g., PM Awas Yojana)"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="details">
                                Scheme Details <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="details"
                                name="details"
                                rows={8}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Describe the scheme benefits, eligibility criteria, application process..."
                                value={formData.details}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Provide clear and complete information for villagers
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
                                        Adding Scheme...
                                    </>
                                ) : (
                                    'Add Scheme'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SAddSchemePage;