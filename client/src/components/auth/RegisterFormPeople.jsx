// client/src/components/auth/RegisterFormPeople.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { registerPeople } from '../../services/authService.js';
import InputField from '../common/InputField.jsx'; // Import helper
import FileInputField from '../common/FileInputField.jsx'; // Import helper

function RegisterFormPeople({ onToggleForm }) {
  const initialFormData = { name: '', villageName: '', mobile: '', aadhaarNo: '', email: '', gender: '', age: '', password: '', confirmPassword: '' };
  const [formData, setFormData] = useState(initialFormData);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setErrors({});
    setSubmitError(null);
  }, [formData, profilePhotoFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhotoFile(file || null);
    setFileName(file ? file.name : '');
  };

   const validateForm = () => {
    let formErrors = {};
    if (!formData.name.trim()) formErrors.name = 'Full Name is required.';
    if (!formData.villageName.trim()) formErrors.villageName = 'Village Name is required.';
     if (!formData.mobile.trim()) formErrors.mobile = 'Mobile Number is required.';
     else if (!/^\d{10}$/.test(formData.mobile)) formErrors.mobile = 'Mobile must be 10 digits.';
     if (!formData.aadhaarNo.trim()) formErrors.aadhaarNo = 'Aadhaar Number is required.';
     else if (!/^\d{12}$/.test(formData.aadhaarNo)) formErrors.aadhaarNo = 'Aadhaar must be 12 digits.';
    if (!formData.email.trim()) formErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = 'Email address is invalid.';
    if (!formData.gender) formErrors.gender = 'Gender is required.';
    if (!formData.age) formErrors.age = 'Age is required.';
    else if (isNaN(formData.age) || formData.age < 18) formErrors.age = 'Age must be 18 or older.';
    if (!formData.password) formErrors.password = 'Password is required.';
    else if (formData.password.length < 6) formErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = 'Passwords do not match.';
    if (!profilePhotoFile) formErrors.profilePhoto = 'Profile Photo is required.';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    setIsLoading(true);
    const dataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword') {
            dataToSubmit.append(key, formData[key]);
        }
    });
    dataToSubmit.append('profilePhoto', profilePhotoFile);

    try {
      const { token: newToken, user: newUser } = await registerPeople(dataToSubmit);
      console.log('People Registration successful:', newUser);
      setToken(newToken);
      setUser(newUser);
      navigate('/'); // Redirect after success
    } catch (err) {
      console.error("People Registration failed:", err);
      setSubmitError(err.message || 'Registration failed. Please check your input or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <div className="w-full max-w-lg mx-auto mt-8 mb-8">
       <form onSubmit={handleSubmit} noValidate encType="multipart/form-data" className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-200">
         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
           Register as Village Member
         </h2>

         {submitError && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
             {submitError}
           </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <InputField id="name_p" name="name" label="Full Name" value={formData.name} onChange={handleChange} error={errors.name} required disabled={isLoading} />
            <InputField id="villageName_p" name="villageName" label="Village Name" value={formData.villageName} onChange={handleChange} error={errors.villageName} required disabled={isLoading} />
            <InputField id="mobile_p" name="mobile" type="tel" label="Mobile No." value={formData.mobile} onChange={handleChange} error={errors.mobile} required disabled={isLoading} maxLength={10} />
            <InputField id="aadhaarNo_p" name="aadhaarNo" type="text" label="Aadhaar No. (12 Digits)" value={formData.aadhaarNo} onChange={handleChange} error={errors.aadhaarNo} required disabled={isLoading} maxLength={12} />
            <InputField id="email_p" name="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} error={errors.email} required disabled={isLoading} />
             <div> {/* Select needs custom styling or wrapper */}
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender_p">Gender <span className="text-red-500">*</span></label>
                <select className={`input-style ${errors.gender ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`} id="gender_p" name="gender" value={formData.gender} onChange={handleChange} required disabled={isLoading}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                 {errors.gender && <p className="text-red-500 text-xs italic mt-1">{errors.gender}</p>}
             </div>
            <InputField id="age_p" name="age" type="number" label="Age (18+)" value={formData.age} onChange={handleChange} error={errors.age} min="18" required disabled={isLoading} />
            <InputField id="password_p" name="password" type="password" label="Password (min 6 chars)" value={formData.password} onChange={handleChange} error={errors.password} required disabled={isLoading} />
            <InputField id="confirmPassword_p" name="confirmPassword" type="password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required disabled={isLoading} />

            <FileInputField
                id="profilePhoto_p"
                name="profilePhoto"
                label="Profile Photo"
                fileName={fileName}
                onChange={handleFileChange}
                required
                disabled={isLoading}
                error={errors.profilePhoto}
                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                className="md:col-span-2"
             />
         </div>

         <div className="mt-6">
           <button className={`w-full btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} type="submit" disabled={isLoading}>
             {isLoading ? 'Registering...' : 'Register Member'}
           </button>
         </div>
         <div className="text-center mt-4">
           <button type="button" onClick={onToggleForm} className="font-bold text-sm text-green-600 hover:text-green-800">
             Or Register as Sarpanch
           </button>
         </div>
       </form>
        {/* Shared input style definition */}
       <style jsx global>{`
         .input-style { @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent; }
         .btn-primary { @apply bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200; }
       `}</style>
     </div>
  );
}

export default RegisterFormPeople;