import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMyProfileData, updateMyProfileData } from '../../services/profileService';
import InputField from '../../components/common/InputField';
import { format } from 'date-fns';
import { FiUser, FiEdit2, FiSave, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SERVER_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5001';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

function SProfilePage() {
    const { user: contextUser, token, setUser: setContextUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profilePhotoHover, setProfilePhotoHover] = useState(false);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            const data = await getMyProfileData();
            setProfileData(data);
        } catch (err) {
            console.error("Fetch profile error:", err);
            setError(err.message || 'Failed to load profile.');
            setProfileData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setProfileData(contextUser);
        }
        setIsEditing(!isEditing);
        setError('');
        setSuccess('');
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!profileData?.name?.trim()) { 
            setError('Name cannot be empty.'); 
            return; 
        }
        if (!profileData?.age || isNaN(profileData.age) || Number(profileData.age) < 21) { 
            setError('Valid age (21+) is required.'); 
            return; 
        }
        if (!profileData?.gender) { 
            setError('Gender selection is required.'); 
            return; 
        }

        setIsSaving(true);
        setError('');
        setSuccess('');

        const dataToUpdate = {
            name: profileData.name.trim(),
            age: Number(profileData.age),
            gender: profileData.gender,
        };

        try {
            const updatedUser = await updateMyProfileData(dataToUpdate);
            setContextUser(updatedUser);
            setProfileData(updatedUser);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            console.error("Update error:", err);
            setError(err.message || 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const getProfileImageUrl = (photoPath) => {
        const defaultIcon = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4f46e5"><path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" /></svg>')}`;
        if (!photoPath || photoPath === 'no-photo.jpg') return defaultIcon;
        if (photoPath.startsWith('http')) return photoPath;
        return `${SERVER_URL}/${photoPath}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try { return format(new Date(dateString), 'PP'); }
        catch { return 'Invalid Date'; }
    };

    if (isLoading) {
        return (
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="flex justify-center items-center min-h-[300px]"
            >
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your profile...</p>
                </div>
            </motion.div>
        );
    }

    if (error && !profileData) {
        return (
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="bg-red-50 border-l-4 border-red-500 p-4 max-w-2xl mx-auto"
            >
                <div className="flex items-center">
                    <FiAlertCircle className="text-red-500 text-xl mr-2" />
                    <p className="text-red-700">{error}</p>
                </div>
                <button 
                    onClick={fetchProfile}
                    className="mt-3 text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors"
                >
                    Try Again
                </button>
            </motion.div>
        );
    }

    if (!profileData) {
        return (
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-center p-10 text-gray-500 max-w-2xl mx-auto"
            >
                <p className="text-lg mb-4">Could not load profile data.</p>
                <button 
                    onClick={fetchProfile}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                    Reload Profile
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto my-8"
        >
            {/* Profile Header with Gradient Background */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
                    <button
                        onClick={handleEditToggle}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${isEditing ? 'bg-white text-indigo-600 hover:bg-gray-100' : 'bg-indigo-700 hover:bg-indigo-800'} transition-colors`}
                        disabled={isSaving}
                    >
                        {isEditing ? (
                            <>
                                <FiX size={18} />
                                <span>Cancel</span>
                            </>
                        ) : (
                            <>
                                <FiEdit2 size={18} />
                                <span>Edit Profile</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 md:p-8">
                {/* Status Messages */}
                {error && (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={slideUp}
                        className="flex items-center bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200"
                    >
                        <FiAlertCircle className="mr-2 min-w-[20px]" />
                        <p>{error}</p>
                    </motion.div>
                )}
                {success && (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={slideUp}
                        className="flex items-center bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200"
                    >
                        <FiCheckCircle className="mr-2 min-w-[20px]" />
                        <p>{success}</p>
                    </motion.div>
                )}

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center mb-8">
                    <div 
                        className="relative"
                        onMouseEnter={() => setProfilePhotoHover(true)}
                        onMouseLeave={() => setProfilePhotoHover(false)}
                    >
                        <img
                            src={getProfileImageUrl(profileData.profilePhoto)}
                            alt={`${profileData.name}'s profile`}
                            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl transition-all duration-300"
                            style={{
                                transform: profilePhotoHover ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: profilePhotoHover ? '0 10px 25px -5px rgba(79, 70, 229, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            onError={(e) => { e.target.onerror = null; e.target.src = getProfileImageUrl(null); }}
                        />
                        {isEditing && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: profilePhotoHover ? 1 : 0 }}
                                className="absolute inset-0 bg-indigo-600 bg-opacity-70 rounded-full flex items-center justify-center cursor-pointer transition-opacity"
                            >
                                <span className="text-white font-medium text-sm">Change Photo</span>
                            </motion.div>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">{profileData.name}</h2>
                    <p className="text-indigo-600 font-medium">{profileData.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : ''}</p>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSaveProfile} id="profileEditForm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Editable Fields */}
                        <motion.div variants={slideUp}>
                            <InputField 
                                id="profile_name" 
                                name="name" 
                                label="Full Name" 
                                value={profileData.name || ''} 
                                onChange={handleChange} 
                                disabled={!isEditing || isSaving} 
                                required 
                                icon={<FiUser className="text-gray-400" />}
                            />
                        </motion.div>
                        
                        <motion.div variants={slideUp}>
                            <InputField 
                                id="profile_age" 
                                name="age" 
                                type="number" 
                                label="Age" 
                                value={profileData.age || ''} 
                                onChange={handleChange} 
                                disabled={!isEditing || isSaving} 
                                required 
                                min="21"
                            />
                        </motion.div>

                        <motion.div variants={slideUp} className="mb-4 md:mb-0">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="profile_gender">
                                Gender
                            </label>
                            <div className="relative">
                                <select 
                                    className={`appearance-none w-full px-4 py-3 rounded-lg border ${!isEditing ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'} transition-all`} 
                                    id="profile_gender" 
                                    name="gender" 
                                    value={profileData.gender || ''} 
                                    onChange={handleChange} 
                                    required 
                                    disabled={!isEditing || isSaving}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                            </div>
                        </motion.div>

                        {/* Read-only Fields */}
                        <motion.div variants={slideUp}>
                            <InputField 
                                id="profile_email" 
                                name="email" 
                                type="email" 
                                label="Email" 
                                value={profileData.email || ''} 
                                disabled={true} 
                                readOnly 
                            />
                        </motion.div>
                        
                        <motion.div variants={slideUp}>
                            <InputField 
                                id="profile_mobile" 
                                name="mobile" 
                                type="tel" 
                                label="Mobile" 
                                value={profileData.mobile || ''} 
                                disabled={true} 
                                readOnly 
                            />
                        </motion.div>
                        
                        <motion.div variants={slideUp}>
                            <InputField 
                                id="profile_village" 
                                name="villageName" 
                                label="Village" 
                                value={profileData.villageName || ''} 
                                disabled={true} 
                                readOnly 
                            />
                        </motion.div>
                        
                        <motion.div variants={slideUp}>
                            <InputField 
                                id="profile_registered" 
                                name="registeredAt" 
                                label="Member Since" 
                                value={formatDate(profileData.registeredAt || profileData.createdAt)} 
                                disabled={true} 
                                readOnly 
                            />
                        </motion.div>
                    </div>
                </form>

                {/* Save Button */}
                {isEditing && (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={slideUp}
                        className="mt-8 pt-6 border-t border-gray-100 flex justify-end"
                    >
                        <button
                            type="submit"
                            form="profileEditForm"
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors ${isSaving ? 'opacity-70' : ''}`}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </motion.div>
                )}

                {/* Additional Actions */}
                {!isEditing && (
                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap justify-between gap-4">
                        
                        
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default SProfilePage;