import React, { useState } from 'react';
import RegisterFormSarpanch from '../components/auth/RegisterFormSarpanch';
import RegisterFormPeople from '../components/auth/RegisterFormPeople';
import { Link } from 'react-router-dom';

function RegisterPage() {
  // State to control which registration form is shown
  const [showSarpanchForm, setShowSarpanchForm] = useState(false); // Start with people form? Or selection?

  const toggleForm = () => {
    setShowSarpanchForm(!showSarpanchForm);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        {showSarpanchForm ? (
          <RegisterFormSarpanch onToggleForm={toggleForm} />
        ) : (
          <RegisterFormPeople onToggleForm={toggleForm} />
        )}
      </div>
       <div className="text-center mt-[-2rem] mb-6"> {/* Adjust margin as needed */}
           <p className="text-gray-600 text-sm">
               Already have an account?{' '}
               <Link to="/login" className="font-bold text-green-600 hover:text-green-800">
                   Login Here
                </Link>
            </p>
        </div>
    </div>
  );
}

export default RegisterPage;