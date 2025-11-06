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

  const handleMouseEffect = (e, scale) => {
    e.currentTarget.style.transform = `scale(${scale})`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "28rem" }}>
        <div
          style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "1.5rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            padding: "2rem",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                marginBottom: "1rem",
              }}
            >
              <Sparkles color="white" size={32} />
            </div>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: "700",
                background: "linear-gradient(to right, #9333ea, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </h2>
            <p style={{ color: "#4b5563", marginTop: "0.5rem" }}>Sign in to your profile</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.5)", border: "1px solid #e5e7eb", outline: "none" }}
                  placeholder="Enter your phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.5)", border: "1px solid #e5e7eb", outline: "none" }}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  background: "linear-gradient(to right, #9333ea, #ec4899)",
                  color: "white",
                  fontWeight: "600",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => !loading && handleMouseEffect(e, 1.05)}
                onMouseLeave={(e) => !loading && handleMouseEffect(e, 1)}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <button
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              border: "2px solid #d1d5db",
              backgroundColor: "transparent",
              color: "#374151",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => (window.location.href = "/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;