// client/src/components/complaints/SendComplaintForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitComplaint } from '../../services/complaintService';
import InputField from '../common/InputField'; // Reusable component
import { useAuth } from '../../contexts/AuthContext'; // To clear errors maybe

function SendComplaintForm() {
    const [formData, setFormData] = useState({ subject: '', details: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // Form-specific error
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { setError: setAuthError } = useAuth(); // To clear any global auth errors

    useEffect(() => {
        setAuthError(null); // Clear global errors when form mounts
        setError(null); // Clear local errors when data changes
        setSuccessMessage('');
    }, [formData, setAuthError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.subject.trim()) {
            setError('Subject is required.');
            return false;
        }
        if (!formData.details.trim()) {
            setError('Complaint details are required.');
            return false;
        }
        setError(null); // Clear error if validation passes
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const newComplaint = await submitComplaint(formData);
            console.log('Complaint submitted:', newComplaint);
            setSuccessMessage('Your complaint has been submitted successfully!');
            // Reset form after successful submission
            setFormData({ subject: '', details: '' });
            // Optionally navigate away after a short delay
            // setTimeout(() => navigate('/people-dashboard/my-complaints'), 2000);

        } catch (err) {
            console.error("Failed to submit complaint:", err);
            setError(err.message || 'Failed to submit complaint. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <form onSubmit={handleSubmit} noValidate className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-200">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Submit a New Complaint
                </h2>

                {/* Submission Error */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        {error}
                    </div>
                )}
                {/* Success Message */}
                {successMessage && (
                     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        {successMessage}
                    </div>
                )}

                <InputField
                    id="subject"
                    name="subject"
                    label="Subject / Title"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Briefly describe the issue"
                    required
                    disabled={isLoading}
                    maxLength={200}
                    className="mb-4"
                />

                <div className="mb-6">
                     <label htmlFor="details" className="block text-gray-700 text-sm font-bold mb-2">
                        Complaint Details <span className="text-red-500">*</span>
                     </label>
                     <textarea
                        id="details"
                        name="details"
                        rows="5"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error && !formData.details.trim() ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                        placeholder="Provide details about the complaint, including location, date/time if relevant, etc."
                        value={formData.details}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                     ></textarea>
                     {error && !formData.details.trim() && <p className="text-red-500 text-xs italic mt-1">Complaint details are required.</p>}
                </div>

                <div className="flex items-center justify-center">
                    <button
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </div>
            </form>
             {/* Shared input style definition */}
             <style jsx global>{`
                 .input-style { @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
                /* Using primary button style from other forms for consistency, adjust if needed */
                 .btn-primary { @apply bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200; }
            `}</style>
        </div>
    );
}

export default SendComplaintForm;