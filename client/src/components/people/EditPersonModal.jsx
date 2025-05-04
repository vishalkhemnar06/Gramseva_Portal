// client/src/components/people/EditPersonModal.jsx
import React, { useState, useEffect } from 'react';
import InputField from '../common/InputField.jsx'; // Assuming InputField exists
import { updatePersonBySarpanch } from '../../services/userService';

// Get the server base URL for potential image previews if needed later
const SERVER_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5001';

const EditPersonModal = ({ personData, onClose, onUpdateSuccess }) => {
    // Function to safely initialize form data
    const getInitialData = (data) => ({
        name: data?.name || '',
        age: data?.age || '',
        gender: data?.gender || '',
        occupation: data?.occupation || '',
        maritalStatus: data?.maritalStatus || '',
        // Format DOB correctly for input type="date" or leave empty string
        dob: data?.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
        // Add any additional fields here as needed
    });

    const [formData, setFormData] = useState(() => getInitialData(personData));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(
        personData?.profilePhoto ? `${SERVER_URL}/${personData.profilePhoto}` : null
    );

    // Reset form state when the personData prop changes
    useEffect(() => {
        console.log("Edit Modal useEffect: Received personData prop:", personData); // Debug
        setFormData(getInitialData(personData));
        setImagePreview(personData?.profilePhoto ? `${SERVER_URL}/${personData.profilePhoto}` : null);
        setError(''); // Clear errors when modal opens/person changes
    }, [personData]); // Dependency array includes personData

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        setError(''); // Clear error on input change
    };

    // Basic client-side validation
    const validateForm = () => {
        if (!formData.name.trim()) return 'Name cannot be empty.';
        if (formData.age && (isNaN(formData.age) || Number(formData.age) < 18)) return 'Valid age (18+) is required.'; // Changed to Number() for comparison
        if (!formData.gender) return 'Gender selection is required.';
        // Other fields are optional for update
        return ''; // No error
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Prepare only the fields allowed for update
            // Backend controller should ideally handle null/undefined gracefully
            const updateData = {
                name: formData.name.trim(),
                // Send age as number if present, otherwise let backend handle it (or send null/undefined)
                age: formData.age ? Number(formData.age) : undefined,
                gender: formData.gender,
                // Send occupation/maritalStatus/dob only if they have a value, otherwise let backend ignore
                occupation: formData.occupation.trim() || undefined,
                maritalStatus: formData.maritalStatus || undefined,
                dob: formData.dob || undefined, // HTML date input provides "" if empty
            };

            // Optional: Remove undefined keys before sending if preferred
            Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

            console.log("Submitting update data to API:", updateData);

            const response = await updatePersonBySarpanch(personData._id, updateData); // Call the service function
            
            console.log("Update response:", response);
            
            // Show success message
            alert(response.message || 'Member details updated successfully');

            onUpdateSuccess(); // Notify parent to refresh the list
            onClose(); // Close the modal

        } catch (err) {
            console.error("Update failed:", err);
            // Display the error message from the service/backend
            setError(err.message || 'Failed to update details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Prevent modal close on background click while loading
    const handleOverlayClick = (e) => {
       if (e.target === e.currentTarget && !isLoading) {
         onClose();
       }
    };

    // Get fallback image if profile photo fails to load
    const getFallbackImage = () => {
        return `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" /></svg>')}`;
    };

    // Don't render anything if personData isn't ready
    if (!personData) return null;

    return (
        // Modal Overlay
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[100] p-4 transition-opacity duration-300" // High z-index
            onClick={handleOverlayClick}
        >
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up max-h-[90vh] flex flex-col"> {/* Flex column layout */}
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Member Details</h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-700 text-2xl font-bold disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Body */}
                <div className='p-6 flex-grow overflow-y-auto'> {/* Scrollable Body */}
                    <div className="flex items-center mb-4">
                        {/* Profile Image Preview */}
                        <div className="mr-4">
                            <img 
                                src={imagePreview || getFallbackImage()} 
                                alt={personData.name} 
                                className="w-16 h-16 rounded-full object-cover bg-gray-200"
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = getFallbackImage(); 
                                }}
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Updating profile for: <span className='font-medium'>{personData.name}</span>
                            </p>
                            <p className="text-xs text-gray-500">{personData.email}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate id="editPersonForm"> {/* Add ID for button outside form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 ">
                            {/* Editable Fields */}
                            <InputField className="mb-4" id="edit_name" name="name" label="Full Name" value={formData.name} onChange={handleChange} required disabled={isLoading} />
                            <InputField className="mb-4" id="edit_age" name="age" type="number" label="Age (18+)" value={formData.age} onChange={handleChange} min="18" required disabled={isLoading} />
                            {/* Gender Select */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit_gender">Gender <span className="text-red-500">*</span></label>
                                <select
                                    className={`input-style w-full ${!formData.gender && error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                                    id="edit_gender" name="gender" value={formData.gender} onChange={handleChange} required disabled={isLoading}
                                >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                </select>
                                {!formData.gender && error === 'Gender is required.' && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
                            </div>
                            <InputField className="mb-4" id="edit_dob" name="dob" type="date" label="Date of Birth" value={formData.dob} onChange={handleChange} disabled={isLoading} />
                             {/* Marital Status Select */}
                             <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit_maritalStatus">Marital Status</label>
                                <select className="input-style w-full border-gray-300" id="edit_maritalStatus" name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange} disabled={isLoading}>
                                <option value="">Select Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                            <InputField className="mb-4" id="edit_occupation" name="occupation" label="Occupation" value={formData.occupation} onChange={handleChange} placeholder="e.g., Farmer, Teacher" disabled={isLoading} />

                            {/* Display non-editable fields */}
                            <div className="md:col-span-2 mt-4 pt-4 border-t">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Read Only Information</h4>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Mobile:</span> {personData.mobile}</p>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Email:</span> {personData.email}</p>
                                <p className="text-sm text-gray-600"><span className="font-medium">Aadhaar:</span> {personData.aadhaarNo}</p>
                            </div>
                        </div>
                    </form>
                </div>

                 {/* Modal Footer */}
                 <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50 rounded-b-lg">
                     <button
                         type="button"
                         onClick={onClose}
                         disabled={isLoading}
                         className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-150 disabled:opacity-50"
                     >
                         Cancel
                     </button>
                     <button
                         type="submit" // This button triggers the form submission
                         form="editPersonForm" // Associate with the form ID
                         disabled={isLoading}
                         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         {isLoading ? 'Saving...' : 'Save Changes'}
                     </button>
                 </div>
            </div>
            {/* Styles */}
             <style jsx global>{`
                 .input-style { @apply shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent; }
                 @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(10px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
                 .animate-fade-in-up { animation: fade-in-up 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default EditPersonModal;