// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
// Make sure getMe is imported from your service
import { loginUser, getMe } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    // Start true: we need to check if a token exists and fetch user data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true); // Indicate loading during check
            setError(null);   // Clear previous errors
            console.log("AuthContext: useEffect triggered. Token:", token);

            if (token) {
                try {
                    // Ensure token is in storage (might be redundant if already there)
                    localStorage.setItem('authToken', token);

                    // *** CALL getMe() TO FETCH USER DATA ***
                    // The token will be added automatically by the Axios interceptor
                    console.log("AuthContext: Token found, attempting getMe()...");
                    const userData = await getMe(); // Calls GET /api/auth/me
                    console.log("AuthContext: getMe() successful, user data:", userData);
                    setUser(userData); // Update user state

                } catch (err) {
                    // This block catches errors from getMe() - likely invalid/expired token
                    console.error("AuthContext: getMe() failed. Clearing token/user.", err);
                    localStorage.removeItem('authToken'); // Remove the invalid token
                    setToken(null);                       // Clear token state
                    setUser(null);                        // Clear user state
                    // You might want to set an error message here too
                    // setError("Session expired or invalid. Please log in.");
                }
            } else {
                // No token found case
                console.log("AuthContext: No token found.");
                localStorage.removeItem('authToken'); // Ensure storage is clean
                setUser(null); // Ensure user state is null
                // No need to clear token state, it's already null/falsy
            }
            // Finished loading attempt
            setLoading(false);
        };

        loadUser();
        // This effect depends only on the token state changing
    }, [token]);

    const login = async (email, password) => {
        setError(null);
        try {
            const { token: newToken, user: loggedInUser } = await loginUser(email, password);
            console.log("AuthContext: Login successful");
            // Set token state FIRST - this will trigger the useEffect above
            setToken(newToken);
            // Set user state immediately for responsiveness
            setUser(loggedInUser);
            return true;
        } catch (err) {
            console.error("AuthContext: Login failed", err);
            setError(err.message || 'Login failed.');
            // Clear auth state on failure
            setUser(null);
            setToken(null);
            localStorage.removeItem('authToken');
            return false;
        }
    };

    const logout = () => {
        console.log("AuthContext: Logging out");
        setUser(null);
        setToken(null); // Setting token to null triggers useEffect to clean up
        localStorage.removeItem('authToken');
        setError(null);
    };

    // Value provided to consuming components
    const value = {
        user, token, isLoggedIn: !!user, loading, error,
        login, logout, setToken, setUser, setError
    };

    // Render children immediately - components can check loading state
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined || context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};