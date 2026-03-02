// components/MyProfile/LoginForm.jsx
import React, { useState } from "react";
import { Sparkles } from "lucide-react";

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await onLogin({
      phone: formData.phone.trim(),
      password: formData.password,
    });
    if (!success) setLoading(false);
  };

  return (
    <div className="light-wrapper">
      <div className="light-card">

        {/* ICON */}
        <div className="icon-wrapper">
          <Sparkles size={30} />
        </div>

        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="form-area">

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="text"
              required
              placeholder="Enter your phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <small className="password-note">
              Hint: Use your phone number as password.
            </small>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <button
          className="back-btn"
          onClick={() => (window.location.href = "/")}
        >
          ← Back to Home
        </button>

      </div>

      <style jsx>{`
        .light-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
        }

        .light-card {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          border-radius: 1.8rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
          text-align: center;
        }

        .icon-wrapper {
          width: 65px;
          height: 65px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #9D4DFF, #EC4899);
          color: white;
          box-shadow: 0 8px 20px rgba(157, 77, 255, 0.3);
        }

        .title {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(to right, #9D4DFF, #EC4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }

        .form-area {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          text-align: left;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          display: block;
          color: #374151;
        }

        .input-group input {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 0.9rem;
          border: 1px solid #e5e7eb;
          background: white;
          font-size: 0.9rem;
          outline: none;
          transition: 0.3s;
        }

        .input-group input:focus {
          border-color: #9D4DFF;
          box-shadow: 0 0 0 3px rgba(157, 77, 255, 0.2);
        }

        .password-note {
          font-size: 0.7rem;
          color: #6b7280;
          margin-top: 0.4rem;
          display: block;
        }

        .login-btn {
          padding: 0.9rem;
          border-radius: 0.9rem;
          border: none;
          background: linear-gradient(90deg, #9D4DFF, #EC4899);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(157, 77, 255, 0.4);
        }

        .back-btn {
          margin-top: 1.5rem;
          padding: 0.8rem;
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid #d1d5db;
          background: transparent;
          color: #374151;
          cursor: pointer;
          transition: 0.3s;
        }

        .back-btn:hover {
          background: #f3f4f6;
        }

        @media (max-width: 480px) {
          .light-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;