import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addJob } from '../../services/jobService';
import InputField from '../../components/common/InputField';
import FileInputField from '../../components/common/FileInputField';
import { FiPlus, FiX, FiUpload, FiLoader } from 'react-icons/fi';

function SAddJobPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        heading: '',
        details: ''
    });
    const [jobImage, setJobImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setJobImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setJobImage(null);
        setPreviewUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.heading.trim() || !formData.details.trim()) {
            setError('Job title and details are required');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const jobFormData = new FormData();
            jobFormData.append('heading', formData.heading);
            jobFormData.append('details', formData.details);
            if (jobImage) jobFormData.append('jobImage', jobImage);

            await addJob(jobFormData);
            
            setSuccess('Job posted successfully!');
            setTimeout(() => navigate('/sarpanch-dashboard/view-jobs'), 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to post job. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Post New Job</h1>
                            <p className="text-gray-600">Fill in the details to create a new job posting</p>
                        </div>
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FiX className="mr-1" /> Cancel
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg flex items-center">
                            <FiPlus className="mr-2 text-green-600" />
                            <p>{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                        <InputField 
                            id="heading"
                            label="Job Title"
                            type="text"
                            value={formData.heading}
                            onChange={handleChange}
                            required={true}
                            disabled={isLoading}
                            placeholder="e.g., Village Development Officer"
                        />
                        
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>
                            <textarea
                                id="details"
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={formData.details}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                placeholder="Describe the job responsibilities, requirements, and benefits..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Image (Optional)
                            </label>
                            {previewUrl ? (
                                <div className="relative group">
                                    <img
                                        src={previewUrl}
                                        alt="Job preview"
                                        className="h-48 w-full object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        disabled={isLoading}
                                    >
                                        <FiX size={14} />
                                    </button>
                                </div>
                            ) : (
                                <FileInputField
                                    id="jobImage"
                                    name="jobImage"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    disabled={isLoading}
                                />
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Recommended size: 1200×630px. Max 5MB. Formats: JPG, PNG, WEBP
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
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
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FiLoader className="animate-spin mr-2" size={16} />
                                        Posting Job...
                                    </>
                                ) : (
                                    'Post Job Opportunity'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SAddJobPage;