// src/Profile/FeaturesCard.js
import React from "react";
import { Gift, Users } from "lucide-react";

const FeatureCards = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem",
      }}
    >
      {/* ✅ Reward Points */}
      <Card
        title="Reward Points"
        icon={<Gift size={40} color="#d97706" />}
        bg="rgba(245, 158, 11, 0.2)"
        gradient="linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 146, 60, 0.2))"
        color="#b45309"
        text="Earn 10% reward points on every booking of ₹5000/- or more."
      />

      {/* ✅ Referral Points */}
      <Card
        title="Referral Points"
        icon={<Users size={40} color="#2563eb" />}
        bg="rgba(59, 130, 246, 0.2)"
        gradient="linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))"
        color="#1d4ed8"
        text="Earn 500 referral points when your friend books their first event with yopur Referral."
      />
    </div>
  );
};

// ✅ Card Component
const Card = ({ title, icon, bg, gradient, color, text }) => {
  const handleMouseEffect = (e, scale) => {
    e.currentTarget.style.transform = `scale(${scale})`;
  };

  return (
    <div
      style={{
        backdropFilter: "blur(20px)",
        background: gradient,
        borderRadius: "1.5rem",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        padding: "1.5rem",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "transform 0.3s",
        cursor: "pointer",
        transform: "scale(1)",
      }}
      onMouseEnter={(e) => handleMouseEffect(e, 1.05)}
      onMouseLeave={(e) => handleMouseEffect(e, 1)}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <div
          style={{ padding: "1rem", borderRadius: "1rem", backgroundColor: bg }}
        >
          {icon}
        </div>
      </div>

      <h4
        style={{
          fontSize: "1.25rem",
          fontWeight: "700",
          color: "#1f2937",
          textAlign: "center",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h4>

      <p
        style={{
          color: "#374151",
          fontSize: "0.875rem",
          textAlign: "center",
          lineHeight: "1.5",
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default FeatureCards;
