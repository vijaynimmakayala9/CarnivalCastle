// components/MyProfile/ProfileCard.jsx
import React from "react";
import { User, Mail, Phone } from "lucide-react";

const ProfileCard = ({ user }) => {
  return (
    <div
      style={{
        backdropFilter: "blur(18px)",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        borderRadius: "1.5rem",
        boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
        padding: "1.5rem 2rem",
        marginBottom: "2rem",
        border: "1px solid rgba(255,255,255,0.3)",
      }}
    >
      {/* Premium Heading */}
      <h3
        style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          textAlign: "center",
          marginBottom: "1.4rem",
          background: "linear-gradient(to right, #9333ea, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.5px",
        }}
      >
        My Profile
      </h3>

      {/* Stylish Underline */}
      <div
        style={{
          width: "80px",
          height: "4px",
          borderRadius: "2px",
          background: "linear-gradient(to right, #9333ea, #ec4899)",
          margin: "0 auto 1.8rem auto",
          boxShadow: "0 3px 10px rgba(147, 51, 234, 0.5)",
        }}
      ></div>

      {/* Details Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "1rem",
          fontWeight: "600",
        }}
      >
        {/* Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <User size={18} color="#9333ea" />
          <span style={{ color: "#111827" }}>{user.name}</span>
        </div>

        {/* Email */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Mail size={18} color="#9333ea" />
          <span style={{ color: "#111827" }}>{user.email}</span>
        </div>

        {/* Phone */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Phone size={18} color="#9333ea" />
          <span style={{ color: "#111827" }}>{user.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
