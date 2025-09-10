import React, { useState } from "react";
import { usersApi } from "../Services/api";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import "./Signup.css";

interface GoogleProfile {
  email: string;
  name: string;
  picture: string;
}

const Signup: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    else if (form.username.length < 3) newErrors.username = "Username must be at least 3 characters";

    if (form.username.trim()) {
      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email address";

      if (!form.password) newErrors.password = "Password is required";
      else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

      if (form.password !== form.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await usersApi.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast("✅ Account created successfully! You can now log in.");
      navigate("/signin");
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      alert(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
  const token = credentialResponse?.credential;
  if (token) {
    try {
      const profile: GoogleProfile = jwtDecode(token);
      alert(`✅ Welcome ${profile.name}!`);
      navigate("/");
    } catch {
      alert("❌ Failed to process Google authentication");
    }
  }
};


  // Show email/password only when username has input
  const showEmailAndPassword = form.username.trim().length > 0;

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-content">
          <div className="signup-header">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join our community of students</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-container">
                <User className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  className={`form-input ${errors.username ? "form-input-error" : ""}`}
                  required
                />
              </div>
              {errors.username && (
                <p className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email & Password */}
            {showEmailAndPassword && (
              <>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-container">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? "form-input-error" : ""}`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="error-message">
                      <AlertCircle className="error-icon" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-container">
                    <Lock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className={`form-input ${errors.password ? "form-input-error" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="error-message">
                      <AlertCircle className="error-icon" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="input-container">
                    <Lock className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`form-input ${errors.confirmPassword ? "form-input-error" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="error-message">
                      <AlertCircle className="error-icon" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="spinner"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-text">
              <span>Or continue with</span>
            </div>
          </div>

          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("❌ Google Sign Up Failed")}
              theme="filled_blue"
              size="large"
              text="signup_with"
              shape="rectangular"
              width="100%"
            />
          </div>

          <div className="signup-footer">
            <p className="footer-text">
              Already have an account?{" "}
              <Link to="/signin" className="footer-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
