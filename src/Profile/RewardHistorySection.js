// components/MyProfile/RewardHistorySection.jsx
import React, { useState } from "react";
import { CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const RewardHistorySection = ({ rewardData, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280", marginBottom: "2rem" }}>
        Loading your rewards...
      </div>
    );
  }

  if (!rewardData) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444", marginBottom: "2rem" }}>
        Unable to load rewards.
      </div>
    );
  }

  const totalBookings = rewardData.rewardHistory.length;
  const totalPages = Math.ceil(totalBookings / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const currentBookings = rewardData.rewardHistory.slice(startIndex, startIndex + bookingsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: "1.5rem",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        padding: "1.5rem",
        marginBottom: "2rem",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937", marginBottom: "1rem" }}>
        🎁 Your Reward History ({totalBookings} bookings)
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div
          style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            background: "linear-gradient(to right, #9333ea, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {rewardData.totalRewardPoints}
        </div>
        <div>
          <p style={{ margin: 0, color: "#374151" }}>Total Reward Points</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {currentBookings.length > 0 ? (
          currentBookings.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.75rem",
                backgroundColor: "#f9fafb",
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
              }}
            >
              <div>
                <div style={{ fontWeight: "600", color: "#1f2937" }}>Booking #{item.bookingId}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#4b5563", marginTop: "0.25rem" }}>
                  {item.status === "completed" ? <CheckCircle color="#10b981" size={14} /> : <Clock color="#f59e0b" size={14} />}
                  {new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "600", color: "#1f2937" }}>+{item.pointsEarned} pts</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>₹{item.totalPrice.toLocaleString("en-IN")}</div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#6b7280", textAlign: "center" }}>No bookings yet.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              backgroundColor: currentPage === 1 ? "#f3f4f6" : "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              color: currentPage === 1 ? "#9ca3af" : "#374151",
            }}
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                backgroundColor: currentPage === i + 1 ? "#9333ea" : "white",
                color: currentPage === i + 1 ? "white" : "#374151",
                fontWeight: currentPage === i + 1 ? "600" : "normal",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              backgroundColor: currentPage === totalPages ? "#f3f4f6" : "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              color: currentPage === totalPages ? "#9ca3af" : "#374151",
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RewardHistorySection;