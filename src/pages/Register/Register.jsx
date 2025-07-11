import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../features/auth/authSlice";
import {
  FaTelegramPlane,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaCity,
  FaMapMarkedAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import "./Register.scss";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading: registerLoading, error: registerErrorFromRedux } = useSelector(
    (state) => state.auth
  );
  const { locations } = useSelector((state) => state.realestate);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    city: "Damascus",
    district: "",
    phone_no: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [customError, setCustomError] = useState(null); // لحفظ الخطأ المخصص

  useEffect(() => {
    if (locations && locations.data) {
      const damascusDistricts = locations.data
        .filter((loc) => loc.city === "دمشق")
        .map((loc) => loc.district);
      setDistricts(damascusDistricts);
    }
  }, [locations]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format.";
    if (!formData.password) errors.password = "Password is required.";
    if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    if (!formData.confirmPassword)
      errors.confirmPassword = "Confirm password is required.";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match!";
    if (!formData.username.trim())
      errors.username = "Telegram username is required.";
    if (!formData.phone_no.trim())
      errors.phone_no = "Phone number is required.";
    if (!/^\+?\d{10,15}$/.test(formData.phone_no))
      errors.phone_no = "Invalid phone number format. E.g., +963XXXXXXXXX";
    if (!formData.city) errors.city = "City is required.";
    if (!formData.district) errors.district = "District is required.";

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
    setSubmissionSuccess(null);
    setCustomError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionSuccess(null);
    setCustomError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const response = await dispatch(register(formData)).unwrap();

      setSubmissionSuccess("Registration successful! Redirecting...");
      setFormErrors({});
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      if (
        err?.message?.includes("Duplicate entry") &&
        err?.message?.includes("users_email_unique")
      ) {
        setCustomError("هذا البريد الإلكتروني مستخدم مسبقًا. يرجى استخدام بريد آخر.");
      } else {
        setCustomError(
          err?.message ||
            "Registration failed. Please check your details and try again."
        );
      }
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-box">
          <h1 className="register-title">Create Account</h1>

          {submissionSuccess && (
            <p className="status-message success-message">
              <FaCheckCircle /> {submissionSuccess}
            </p>
          )}
          {(customError || registerErrorFromRedux) && (
            <p className="status-message error-message">
              <FaExclamationCircle />{" "}
              {customError ||
                registerErrorFromRedux?.message ||
                "Registration failed. Please check your details and try again."}
            </p>
          )}

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? "name_error" : undefined}
                />
              </div>
              {formErrors.name && (
                <p id="name_error" className="validation-error">
                  <FaExclamationCircle /> {formErrors.name}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  aria-invalid={!!formErrors.email}
                  aria-describedby={formErrors.email ? "email_error" : undefined}
                />
              </div>
              {formErrors.email && (
                <p id="email_error" className="validation-error">
                  <FaExclamationCircle /> {formErrors.email}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  aria-invalid={!!formErrors.password}
                  aria-describedby={
                    formErrors.password ? "password_error" : undefined
                  }
                />
              </div>
              {formErrors.password && (
                <p id="password_error" className="validation-error">
                  <FaExclamationCircle /> {formErrors.password}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  aria-invalid={!!formErrors.confirmPassword}
                  aria-describedby={
                    formErrors.confirmPassword ? "confirmPassword_error" : undefined
                  }
                />
              </div>
              {formErrors.confirmPassword && (
                <p id="confirmPassword_error" className="validation-error">
                  <FaExclamationCircle /> {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="username">Telegram Username</label>
              <div className="input-with-icon">
                <FaTelegramPlane className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="@username"
                  aria-invalid={!!formErrors.username}
                  aria-describedby={
                    formErrors.username ? "username_error" : undefined
                  }
                />
              </div>
              {formErrors.username && (
                <p id="username_error" className="validation-error">
                  <FaExclamationCircle /> {formErrors.username}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone_no">Phone Number</label>
              <div className="input-with-icon">
                <FaPhoneAlt className="input-icon" />
                <input
                  type="tel"
                  id="phone_no"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleChange}
                  placeholder="+963"
                  inputMode="numeric"
                  aria-invalid={!!formErrors.phone_no}
                  aria-describedby={
                    formErrors.phone_no ? "phone_no_error" : undefined
                  }
                />
              </div>
              {formErrors.phone_no && (
                <p id="phone_no_error" className="validation-error">
                  <FaExclamationCircle /> {formErrors.phone_no}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <div className="input-with-icon">
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled
                  aria-invalid={!!formErrors.city}
                  aria-describedby={formErrors.city ? "city_error" : undefined}
                >
                  <option value="Damascus">Damascus</option>
                </select>
              </div>
              {formErrors.city && (
                <p id="city_error" className="validation-error">
                  <FaExclamationCircle /> {formErrors.city}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="district">District</label>
              <div className="input-with-icon">
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  aria-invalid={!!formErrors.district}
                  aria-describedby={
                    formErrors.district ? "district_error" : undefined
                  }
                >
                  <option value="">Select District</option>
                  {districts.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              {formErrors.district && (
                <p id="district_error" className="validation-error">
                  <FaExclamationCircle /> {formErrors.district}
                </p>
              )}
            </div>

            <div className="form-buttons">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="back-btn"
              >
                <FaArrowLeft /> Back
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={registerLoading}
              >
                {registerLoading ? <FaSpinner className="spinner" /> : null}
                {registerLoading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
