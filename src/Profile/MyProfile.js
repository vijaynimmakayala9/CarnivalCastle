// components/MyProfile/MyProfile.jsx
import React, { useState, useEffect } from "react";
import LoginForm from "./Login";
import ProfileCard from "./ProfileCard";
import RewardHistorySection from "./RewardHistorySection";
import FeatureCards from "./FeaturesCard";
import RedeemPointsCard from "./RedeemPointCard";
import ReferralCard from "./ReferralCard";

const MyProfile = () => {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [rewardData, setRewardData] = useState(null);
  const [rewardLoading, setRewardLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("userProfile");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        setStep(2);
        fetchRewardData(parsedUser._id);
      } catch (e) {
        sessionStorage.removeItem("userProfile");
      }
    }
  }, []);

  const fetchRewardData = async (userId) => {
    setRewardLoading(true);
    try {
      const res = await fetch(
        `https://api.carnivalcastle.com/v1/carnivalApi/web/booking/rewards/${userId}`
      );
      const data = await res.json();
      if (data.success && data.data) {
        const sorted = [...data.data.rewardHistory].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setRewardData({ ...data.data, rewardHistory: sorted });
      }
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
    } finally {
      setRewardLoading(false);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const res = await fetch(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (data.success && data.user) {
        sessionStorage.setItem("userProfile", JSON.stringify(data.user));
        setUser(data.user);
        setStep(2);
        fetchRewardData(data.user._id);
        return true;
      } else {
        alert(data.message || "Login failed");
        return false;
      }
    } catch (err) {
      alert("Network error.");
      return false;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userProfile");
    setUser(null);
    setStep(1);
    setRewardData(null);
  };

  if (step === 1) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3e7f5 0%, #fce4ec 50%, #e3f2fd 100%)",
        maxWidth: "80rem",
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: "700",
              background: "linear-gradient(to right, #9333ea, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome back, {user.name}!
          </h1>
          <p style={{ color: "#4b5563", marginTop: "0.25rem", fontSize: "1rem" }}>
            Manage your rewards, referrals & profile
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.75rem",
            backgroundColor: "#ef4444",
            color: "white",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
          }}
        >
          <LogOutIcon />
          Logout
        </button>
      </div>

      {/* PROFILE CARD */}
      <ProfileCard user={user} />

      {/* FEATURES SECTION */}
      <div style={{ marginTop: "2.5rem" }}>
        <FeatureCards />
      </div>


      {/* GRID: Redeem Points + Referral */}
      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <RedeemPointsCard totalPoints={rewardData?.totalRewardPoints || 0} />
        <RewardHistorySection
          rewardData={rewardData}
          loading={rewardLoading}
        />
        
      </div>


      {/* REWARD HISTORY */}
      <div style={{ marginTop: "2.5rem" }}>
        <ReferralCard user={user} />
      </div>
    </div>
  );
};

// Logout Icon
const LogOutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default MyProfile;
