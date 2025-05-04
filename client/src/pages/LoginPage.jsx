import React from 'react';
import LoginForm from '../components/auth/LoginForm'; // Import the form

function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Optionally add a background or container styling */}
      <div className="flex justify-center">
        <LoginForm /> {/* Render the form component */}
      </div>
    </div>
  );
}

export default LoginPage;