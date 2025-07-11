import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import './Login.scss';
import { FaEnvelope, FaLock, FaSpinner, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'; // Added icons

const Login = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [loginSuccess, setLoginSuccess] = useState(null);
    const [apiError, setApiError] = useState(null); // New state for API errors

    const validateForm = () => {
        const errors = {};
        if (!formData.email.trim()) {
            errors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email address is invalid.';
        }
        if (!formData.password.trim()) {
            errors.password = 'Password is required.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
        setLoginSuccess(null);
        setApiError(null); // Clear API error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginSuccess(null);
        setApiError(null); // Clear previous API errors

        if (!validateForm()) {
            return;
        }

        try {
            const resultAction = await dispatch(login(formData)).unwrap();
            if (resultAction) {
                setLoginSuccess('Login successful! Welcome back.');
                setFormData({ email: '', password: '' });
            }
        } catch (err) {
            console.error("Login failed:", err);
            // Extract the specific error message from the API response
            const errorMessage = err.message || (err.response && err.response.data && err.response.data.message) || 'Login failed. Please check your credentials.';
            setApiError(errorMessage);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                {/* Image Section (Half of the screen) */}
                <div className="login-image-section">
                    {/* يمكنك إضافة نص أو شعار هنا إذا أردت */}
                </div>

                {/* Form Section (Half of the screen) */}
                <div className="login-form-section">
                    <div className="login-box">
                        <h1 className="login-title">Welcome to HomeFinder</h1>
                        <p className="login-subtitle">Sign in to your account</p>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-with-icon">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        aria-invalid={!!formErrors.email}
                                        aria-describedby={formErrors.email ? "email_error" : undefined}
                                    />
                                </div>
                                {formErrors.email && <p id="email_error" className="validation-error"><FaExclamationCircle /> {formErrors.email}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-with-icon">
                                    <FaLock className="input-icon" />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        aria-invalid={!!formErrors.password}
                                        aria-describedby={formErrors.password ? "password_error" : undefined}
                                    />
                                </div>
                                {formErrors.password && <p id="password_error" className="validation-error"><FaExclamationCircle /> {formErrors.password}</p>}
                            </div>

                            {/* تم إزالة "Remember Me" و "Forgot Password" */}
                            {/* <div className="options">
                                <label className="checkbox-container" htmlFor="rememberMe">
                                    <input type="checkbox" id="rememberMe" />
                                    Remember Me
                                </label>
                                <a href="#" className="forgot-password-link">Forgot Password?</a>
                            </div> */}

                            <button type="submit" className="login-button" disabled={loading}>
                                {loading ? (
                                    <>
                                        <FaSpinner className="spinner" /> Logging In...
                                    </>
                                ) : (
                                    'Log In'
                                )}
                            </button>

                            {loginSuccess && (
                                <p className="status-message success-message">
                                    <FaCheckCircle /> {loginSuccess}
                                </p>
                            )}
                            {apiError && (
                                <p className="status-message error-message">
                                    <FaExclamationCircle /> {apiError}
                                </p>
                            )}
                            {error && !apiError && (
                                <p className="status-message error-message">
                                    <FaExclamationCircle /> {typeof error === 'object' && error.message ? error.message : 'An unexpected error occurred.'}
                                </p>
                            )}

                            <div className="register-link-section">
                                <span>Don't have an account?</span>
                                <a href="/register">Register</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;