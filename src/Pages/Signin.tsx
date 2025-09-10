import React, { useState } from "react";
import { usersApi } from "../Services/api";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode"; // ✅ correct import
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { AuthResult } from "../types/auth";
import { User } from "../types/types";

interface GoogleProfile {
  email: string;
  name: string;
  picture: string;
  sub: string
}

const Signin: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Step 1: login, get token
    const authResult: AuthResult = await usersApi.login(form);

    if (authResult.success && authResult.token) {
      // ✅ Store token and userId in Zustand
      setUser(authResult, undefined); // user info will be added after fetch

      // Step 2: fetch current user info using /me
      const response = await fetch("https://localhost:44390/api/users/me", {
        headers: {
          Authorization: `Bearer ${authResult.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userInfo: User = await response.json();

      // Step 3: update Zustand store with full user info
      setUser(authResult, {
        id: userInfo.id,
        username: userInfo.username || form.email.split("@")[0],
        email: userInfo.email,
        avatarUrl: userInfo.avatarUrl || "",
      });

      // Optional: also persist token in localStorage if you want session to survive refresh
      localStorage.setItem("token", authResult.token);

      // Step 4: navigate to profile
      navigate("/profile");
    } else {
      setError(authResult.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    setError("Invalid email or password.");
  } finally {
    setLoading(false);
  }
};





   const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        // Use jwtDecode (not jwt_decode) with proper casing
        const profile = jwtDecode<GoogleProfile>(credentialResponse.credential);
        
        // Create a proper AuthResult object
        const authResult: AuthResult = {
          success: true,
          token: credentialResponse.credential,
          userId: profile.sub, // Use Google's user ID instead of Date.now()
        };
        
        setUser(authResult);
        navigate("/profile");
      } catch (error) {
        console.error('Failed to decode JWT:', error);
        // Handle error appropriately
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-content">
          <div className="signup-header">
            <h2 className="signup-title">Sign In</h2>
            <p className="signup-subtitle">
              Welcome back! Please enter your credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-container">
                <span className="input-icon"><FaEnvelope size={16} /></span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`form-input ${error ? "form-input-error" : ""}`}
                  placeholder="johnDoe@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-container">
                <span className="input-icon"><FaLock size={18} /></span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className={`form-input ${error ? "form-input-error" : ""}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && (
                <div className="error-message">
                  <span className="error-icon">❗</span>
                  {error}
                </div>
              )}
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading &&  <span className="spinner">
              <FaSpinner size={18} />
            </span>}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-text"><span>or</span></div>
          </div>

          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("❌ Google Sign In Failed")}
            />
          </div>

          <div className="signup-footer">
            <p className="footer-text">
              Don’t have an account? <a href="/signup" className="footer-link">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
