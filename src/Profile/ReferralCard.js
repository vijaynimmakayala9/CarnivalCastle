// components/MyProfile/ReferralCard.jsx
import React, { useState, useEffect } from "react";
import { Gift, Copy, TrendingUp } from "lucide-react";

const ReferralCard = ({ user }) => {
  const [referralCode, setReferralCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  // ✅ Fetch referral code from API
  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const res = await fetch(
          `https://api.carnivalcastle.com/v1/carnivalApi/web/booking/myreffrals/${user._id}`
        );
        const data = await res.json();

        if (data?.success) {
          setReferralCode(data?.data?.referralCode || null);
        }
      } catch (err) {
        console.error("Failed to fetch referral:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchReferral();
  }, [user?._id]);

  // ✅ Copy referral code
  const copyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Share referral details
  const handleShareReferral = async () => {
    if (!referralCode) return;

    const message = `${user.name} is celebrating at Carnival Castle 🎉  
Join the fun and make memories!  
Use their referral code: ${referralCode}  
Book now: https://carnivalcastle.com`;

    const shareData = {
      title: "Carnival Castle Invitation",
      text: message,
      url: "https://carnivalcastle.com",
    };

    try {
      // ✅ Native share API
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage("Invitation shared successfully! 🎉");
      } 
      // ✅ Fallback: Copy to clipboard
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        setShareMessage("Referral message copied to clipboard! 📋");
      } 
      else {
        alert("Sharing not supported on this device.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setShareMessage("Something went wrong!");
      }
    }

    setTimeout(() => setShareMessage(""), 3000);
  };

  return (
    <div
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: "1.5rem",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Heading */}
      <h3
        style={{
          fontSize: "1.6rem",
          fontWeight: "700",
          background: "linear-gradient(to right, #9333ea, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <TrendingUp size={22} /> Referral & Earn
      </h3>

      {/* Benefits Box */}
      <div
        style={{
          background: "linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)",
          borderRadius: "1rem",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        }}
      >
        <ReferralInfo icon="💎" text="Share your referral code with friends" />
        
        <ReferralInfo icon="💰" text="You earn 500 Referral points per referral" />
      </div>

      {/* Referral Code Section */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>Loading...</p>
      ) : (
        <>
          <div
            style={{
              backgroundColor: "#f3f4f6",
              borderRadius: "0.75rem",
              padding: "1rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <code
              style={{
                color: "#1f2937",
                fontFamily: "monospace",
                fontSize: "0.95rem",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {referralCode ? referralCode : "No referral code generated yet"}
            </code>

            {referralCode && (
              <button
                onClick={copyCode}
                style={{
                  marginLeft: "0.75rem",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Copy size={20} color="#9333ea" />
              </button>
            )}
          </div>

          {/* Share Button */}
          {referralCode && (
            <button
              onClick={handleShareReferral}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(to right, #9333ea, #ec4899)",
                color: "white",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Gift size={20} />
              Share Referral Invite
            </button>
          )}
        </>
      )}

      {/* Feedback Message */}
      {shareMessage && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "0.75rem",
            backgroundColor: "#d1fae5",
            border: "1px solid #6ee7b7",
          }}
        >
          <p
            style={{
              color: "#065f46",
              fontWeight: "600",
              textAlign: "center",
              margin: 0,
            }}
          >
            {shareMessage}
          </p>
        </div>
      )}
    </div>
  );
};

const ReferralInfo = ({ icon, text }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      marginBottom: "0.6rem",
      fontSize: "1rem",
      color: "#374151",
    }}
  >
    <span style={{ fontSize: "1.4rem" }}>{icon}</span>
    <span>{text}</span>
  </div>
);

export default ReferralCard;
