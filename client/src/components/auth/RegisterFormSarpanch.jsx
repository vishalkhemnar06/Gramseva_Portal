// client/src/components/auth/RegisterFormSarpanch.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { registerSarpanch } from '../../services/authService.js';
import InputField from '../common/InputField.jsx'; // Import helper
import FileInputField from '../common/FileInputField.jsx'; // Import helper

function RegisterFormSarpanch({ onToggleForm }) {
  const initialFormData = { name: '', villageName: '', mobile: '', email: '', gender: '', age: '', password: '', confirmPassword: '' };
  const [formData, setFormData] = useState(initialFormData);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({}); // Store validation errors per field
  const [submitError, setSubmitError] = useState(null); // General submit error
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  // Clear errors when form data changes
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
    // Basic mobile format check (can be improved)
    else if (!/^\d{10}$/.test(formData.mobile)) formErrors.mobile = 'Mobile must be 10 digits.';
    if (!formData.email.trim()) formErrors.email = 'Email is required.';
    // Basic email format check
    else if (!/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = 'Email address is invalid.';
    if (!formData.gender) formErrors.gender = 'Gender is required.';
    if (!formData.age) formErrors.age = 'Age is required.';
    else if (isNaN(formData.age) || formData.age < 21) formErrors.age = 'Age must be 21 or older.';
    if (!formData.password) formErrors.password = 'Password is required.';
    else if (formData.password.length < 6) formErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = 'Passwords do not match.';
    if (!profilePhotoFile) formErrors.profilePhoto = 'Profile Photo is required.';
    // Add more specific validations as needed

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return; // Stop submission if validation fails
    }

    setIsLoading(true);
    const dataToSubmit = new FormData();
    // Append text fields (excluding confirmPassword)
    Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword') {
            dataToSubmit.append(key, formData[key]);
        }
    });
    // Append file
    dataToSubmit.append('profilePhoto', profilePhotoFile);

    try {
      const { token: newToken, user: newUser } = await registerSarpanch(dataToSubmit);
      console.log('Sarpanch Registration successful:', newUser);
      setToken(newToken);
      setUser(newUser);
      navigate('/'); // Redirect after success
    } catch (err) {
      console.error("Sarpanch Registration failed:", err);
      setSubmitError(err.message || 'Registration failed. Please check your input or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8 mb-8">
      <form onSubmit={handleSubmit} noValidate encType="multipart/form-data" className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register as Sarpanch / Gramsevak
        </h2>

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <InputField id="name_s" name="name" label="Full Name" value={formData.name} onChange={handleChange} error={errors.name} required disabled={isLoading} />
          <InputField id="villageName_s" name="villageName" label="Village Name (Unique)" value={formData.villageName} onChange={handleChange} error={errors.villageName} required disabled={isLoading} />
          <InputField id="mobile_s" name="mobile" type="tel" label="Mobile No." value={formData.mobile} onChange={handleChange} error={errors.mobile} required disabled={isLoading} maxLength={10} />
          <InputField id="email_s" name="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} error={errors.email} required disabled={isLoading} />
          <div> {/* Select needs custom styling or wrapper */}
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender_s">Gender <span className="text-red-500">*</span></label>
             <select className={`input-style ${errors.gender ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`} id="gender_s" name="gender" value={formData.gender} onChange={handleChange} required disabled={isLoading}>
               <option value="">Select Gender</option>
               <option value="Male">Male</option>
               <option value="Female">Female</option>
               <option value="Other">Other</option>
             </select>
              {errors.gender && <p className="text-red-500 text-xs italic mt-1">{errors.gender}</p>}
          </div>
          <InputField id="age_s" name="age" type="number" label="Age (21+)" value={formData.age} onChange={handleChange} error={errors.age} min="21" required disabled={isLoading} />
          <InputField id="password_s" name="password" type="password" label="Password (min 6 chars)" value={formData.password} onChange={handleChange} error={errors.password} required disabled={isLoading} />
          <InputField id="confirmPassword_s" name="confirmPassword" type="password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required disabled={isLoading} />

          <FileInputField
            id="profilePhoto_s"
            name="profilePhoto"
            label="Profile Photo"
            fileName={fileName}
            onChange={handleFileChange}
            required
            disabled={isLoading}
            error={errors.profilePhoto}
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
            className="md:col-span-2" // Span across columns
          />
        </div>

        <div className="mt-6">
          <button className={`w-full btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Sarpanch'}
          </button>
        </div>
        <div className="text-center mt-4">
          <button type="button" onClick={onToggleForm} className="font-bold text-sm text-green-600 hover:text-green-800">
            Or Register as Village Member
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

export default RegisterFormSarpanch;