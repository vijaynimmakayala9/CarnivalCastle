// components/MyProfile/RedeemPointsCard.jsx

const RedeemPointsCard = ({ totalPoints }) => (
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
    <div style={{ textAlign: "center" }}>
      {/* Points Display */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "8rem",
          height: "8rem",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          marginBottom: "1.5rem",
        }}
      >
        <span
          style={{
            fontSize: "2.4rem",
            fontWeight: "700",
            color: "white",
          }}
        >
          {totalPoints}
        </span>
      </div>

      {/* Heading */}
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          background: "linear-gradient(to right, #9333ea, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem",
        }}
      >
        Your Reward Points
      </h3>

      {/* Instructions */}
      <div
        style={{
          background: "linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)",
          borderRadius: "1rem",
          padding: "1.25rem",
          textAlign: "left",
          marginBottom: "1.5rem",
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Instruction
          icon="💰"
          text="Earn 10% reward points on every booking above ₹5000."
        />
        <Instruction
          icon="🔁"
          text="Points can be used during your next booking."
        />
        <Instruction
          icon="✨"
          text="On your 1st booking: 50% of your points can be used."
        />
        <Instruction
          icon="🚀"
          text="On 2nd booking: 70% of your points can be used."
        />
        <Instruction
          icon="🏆"
          text="From 3rd booking onwards: 100% of points can be used."
        />
      </div>

      {/* Redeem Button */}
      <button
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "0.75rem",
          background: "linear-gradient(to right, #9333ea, #ec4899)",
          color: "white",
          fontWeight: "600",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 10px 20px rgba(147, 51, 234, 0.25)",
        }}
      >
        Redeem Points
      </button>
    </div>
  </div>
);

// Instruction Component
const Instruction = ({ icon, text }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      marginBottom: "0.5rem",
      fontSize: "1rem",
      color: "#374151",
      fontWeight: "500",
    }}
  >
    <span style={{ fontSize: "1.5rem" }}>{icon}</span>
    <span>{text}</span>
  </div>
);

export default RedeemPointsCard;
