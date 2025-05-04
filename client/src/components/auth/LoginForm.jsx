import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx'; // Use the custom hook
import { useNavigate, Link } from 'react-router-dom'; // For redirection after login

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Local loading state for the form
  const { login, error: authError } = useAuth(); // Get login function and auth error from context
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    authError && console.log("Clearing previous auth error"); // Clear previous context error implicitly on new attempt

    // Call the login function from AuthContext
    const success = await login(email, password); // login now returns true/false

    setIsLoading(false); // Stop loading indicator

    if (success) {
      console.log('Login successful, navigating...');
      // TODO: Navigate based on user role after login provides user data reliably
      // For now, just navigate to a generic dashboard placeholder or home
      // const user = await getMe(); // Or get user from login response if reliable
      // if(user.role === 'sarpanch') navigate('/sarpanch-dashboard'); else navigate('/people-dashboard');
      navigate('/'); // Redirect to home page for now
    } else {
      // Error message is now handled by the authError state from context
      console.log('Login failed.');
      // Optionally clear password field on failure
      setPassword('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        {/* Display Authentication Error from Context */}
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{authError}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {/* Optional: Add forgot password link */}
          {/* <a className="inline-block align-baseline font-bold text-sm text-green-600 hover:text-green-800" href="#">
            Forgot Password?
          </a> */}
        </div>
        <div className="flex items-center justify-between">
          <button
            className={`w-full ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Sign In'}
          </button>
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-green-600 hover:text-green-800">
              Register Here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;