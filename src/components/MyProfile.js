import React, { useState, useEffect } from "react";
import {
  Copy,
  Gift,
  Star,
  Users,
  LogOut,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MyProfile = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareInfo, setShareInfo] = useState("");
  const [copied, setCopied] = useState(false);

  // Reward data & pagination
  const [rewardData, setRewardData] = useState(null);
  const [rewardLoading, setRewardLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  useEffect(() => {
    const stored = sessionStorage.getItem("userProfile");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        setStep(2);
        fetchRewardData(parsedUser._id);
      } catch (e) {
        console.error("Invalid user data in session");
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
        // Ensure history is sorted by date (newest first)
        const sortedHistory = [...data.data.rewardHistory].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setRewardData({ ...data.data, rewardHistory: sortedHistory });
      } else {
        console.warn("No reward data:", data.message || "Unknown error");
      }
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
    } finally {
      setRewardLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) {
      alert("Please enter all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: formData.phone.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (data.success && data.user) {
        const userData = data.user;
        sessionStorage.setItem("userProfile", JSON.stringify(userData));
        setUser(userData);
        setStep(2);
        fetchRewardData(userData._id);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error or invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userProfile");
    setUser(null);
    setStep(1);
    setRewardData(null);
    setCurrentPage(1);
  };

  const copyCode = () => {
    if (user?._id) {
      navigator.clipboard.writeText(user._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareReferral = async () => {
    if (!user?._id || !user?.name) return;

    const message = `${user.name} is celebrating at Carnival Castle 🎉 and invites you to celebrate too! Use their referral ID: ${user._id}`;
    const shareData = {
      title: "Carnival Castle Invitation",
      text: message,
      url: "https://carnivalcastle.com",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareInfo("Invitation sent successfully! 🎉");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${message}\n${shareData.url}`);
        setShareInfo("Referral link copied to clipboard! 📋");
      } else {
        alert("Sharing not supported. Please copy manually.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setShareInfo("Something went wrong while sharing.");
      }
    }
    setTimeout(() => setShareInfo(""), 3000);
  };

  const handleMouseEnter = (e, transform) => {
    e.currentTarget.style.transform = transform;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  // Pagination logic
  const totalBookings = rewardData?.rewardHistory.length || 0;
  const totalPages = Math.ceil(totalBookings / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const currentBookings = rewardData?.rewardHistory.slice(
    startIndex,
    startIndex + bookingsPerPage
  ) || [];

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f3e7f5 0%, #fce4ec 50%, #e3f2fd 100%)",
      }}
    >
      {step === 1 && (
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
                    background:
                      "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
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
                <p style={{ color: "#4b5563", marginTop: "0.5rem" }}>
                  Sign in to your profile
                </p>
              </div>

              <form onSubmit={handleLogin}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.75rem",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        border: "1px solid #e5e7eb",
                        outline: "none",
                      }}
                      placeholder="Enter your phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.75rem",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        border: "1px solid #e5e7eb",
                        outline: "none",
                      }}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
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
                      transform: "scale(1)",
                    }}
                    onMouseEnter={(e) =>
                      !loading && handleMouseEnter(e, "scale(1.05)")
                    }
                    onMouseLeave={(e) => !loading && handleMouseLeave(e)}
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
      )}

      {step === 2 && user && (
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "2rem 1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "700",
                  background: "linear-gradient(to right, #9333ea, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Welcome back, {user.name}! 👋
              </h1>
              <p style={{ color: "#4b5563", marginTop: "0.25rem" }}>
                Manage your rewards and referrals
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
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Profile Details */}
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
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "1rem",
              }}
            >
              Profile Details
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>Name:</span>
                  <span style={{ color: "#111827", fontWeight: "600" }}>{user.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>Phone:</span>
                  <span style={{ color: "#111827", fontWeight: "600" }}>{user.phone}</span>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>Email:</span>
                  <span style={{ color: "#111827", fontWeight: "600" }}>{user.email}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "#4b5563", fontWeight: "500" }}>User ID:</span>
                  <span
                    style={{
                      color: "#111827",
                      fontWeight: "600",
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                    }}
                  >
                    {user._id}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={copyCode}
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1.25rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(to right, #9333ea, #ec4899)",
                color: "white",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Copy size={16} />
              {copied ? "Copied!" : "Copy User ID"}
            </button>
          </div>

          {/* Rewards Section */}
          {rewardLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#6b7280",
                marginBottom: "2rem",
              }}
            >
              Loading your rewards...
            </div>
          ) : rewardData ? (
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
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "1rem",
                }}
              >
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

              {/* Booking List */}
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
                        <div style={{ fontWeight: "600", color: "#1f2937" }}>
                          Booking #{item.bookingId}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.875rem",
                            color: "#4b5563",
                            marginTop: "0.25rem",
                          }}
                        >
                          {item.status === "completed" ? (
                            <CheckCircle color="#10b981" size={14} />
                          ) : (
                            <Clock color="#f59e0b" size={14} />
                          )}
                          {new Date(item.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "600", color: "#1f2937" }}>
                          +{item.pointsEarned} pts
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                          ₹{item.totalPrice.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#6b7280", textAlign: "center" }}>No bookings yet.</p>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginTop: "1.5rem",
                  }}
                >
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
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#ef4444",
                marginBottom: "2rem",
              }}
            >
              Unable to load rewards.
            </div>
          )}

          {/* Feature Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                backdropFilter: "blur(20px)",
                background:
                  "linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 146, 60, 0.2))",
                borderRadius: "1.5rem",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "transform 0.3s",
                cursor: "pointer",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => handleMouseEnter(e, "scale(1.05)")}
              onMouseLeave={handleMouseLeave}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "1rem",
                    backgroundColor: "rgba(245, 158, 11, 0.2)",
                  }}
                >
                  <Gift size={40} color="#d97706" />
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
                Reward Points
              </h4>
              <p
                style={{
                  color: "#374151",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                Earn <span style={{ fontWeight: "700", color: "#b45309" }}>10% reward points</span> on every
                booking of ₹5000/- or more.
              </p>
            </div>

            <div
              style={{
                backdropFilter: "blur(20px)",
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))",
                borderRadius: "1.5rem",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "transform 0.3s",
                cursor: "pointer",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => handleMouseEnter(e, "scale(1.05)")}
              onMouseLeave={handleMouseLeave}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "1rem",
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <Users size={40} color="#2563eb" />
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
                Referral Points
              </h4>
              <p
                style={{
                  color: "#374151",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                Each referral earns <span style={{ fontWeight: "700", color: "#1d4ed8" }}>500 points</span>.
                Usable after 2nd, 3rd, then 100%.
              </p>
            </div>

            <div
              style={{
                backdropFilter: "blur(20px)",
                background:
                  "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2))",
                borderRadius: "1.5rem",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "transform 0.3s",
                cursor: "pointer",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => handleMouseEnter(e, "scale(1.05)")}
              onMouseLeave={handleMouseLeave}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "1rem",
                    backgroundColor: "rgba(34, 197, 94, 0.2)",
                  }}
                >
                  <Star size={40} color="#16a34a" />
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
                Loyalty Tiers
              </h4>
              <p
                style={{
                  color: "#374151",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                Unlock exclusive rewards as you reach new milestones.
              </p>
            </div>
          </div>

          {/* Bottom Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "1.5rem",
            }}
          >
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
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "8rem",
                    height: "8rem",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: "700",
                      color: "white",
                    }}
                  >
                    {rewardData?.totalRewardPoints || 0}
                  </span>
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>Next milestone</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937" }}>2,000 Points</p>
                  <div
                    style={{
                      marginTop: "0.75rem",
                      width: "100%",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "9999px",
                      height: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(to right, #9333ea, #ec4899)",
                        height: "0.75rem",
                        borderRadius: "9999px",
                        width: `${Math.min(100, (rewardData?.totalRewardPoints || 0) / 20)}%`,
                        transition: "width 1s ease-in-out",
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  style={{
                    background: "linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)",
                    borderRadius: "1rem",
                    padding: "1.25rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#374151" }}>
                      <span style={{ fontSize: "1.5rem" }}>🏅</span>
                      <span>
                        <span style={{ fontWeight: "700" }}>500 Points</span> — For each referral
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#374151" }}>
                      <span style={{ fontSize: "1.5rem" }}>💰</span>
                      <span>
                        <span style={{ fontWeight: "700" }}>10% of bookings</span> — As reward points
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#374151" }}>
                      <span style={{ fontSize: "1.5rem" }}>🎉</span>
                      <span>
                        <span style={{ fontWeight: "700" }}>50%-100% usable</span> — On next bookings
                      </span>
                    </div>
                  </div>
                </div>
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
                  }}
                >
                  Redeem Points
                </button>
              </div>
            </div>

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
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <TrendingUp color="#9333ea" />
                Invite Friends & Earn
              </h3>
              <div
                style={{
                  background: "linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)",
                  borderRadius: "1rem",
                  padding: "1.25rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "#374151" }}>
                    <span style={{ fontSize: "1.25rem" }}>💎</span>
                    <span>Share your referral ID with friends</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "#374151" }}>
                    <span style={{ fontSize: "1.25rem" }}>💰</span>
                    <span>
                      Earn <span style={{ fontWeight: "700" }}>500 points</span> per referral
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", color: "#374151" }}>
                    <span style={{ fontSize: "1.25rem" }}>🎁</span>
                    <span>
                      They get <span style={{ fontWeight: "700" }}>200 points</span> on first booking!
                    </span>
                  </div>
                </div>
              </div>

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
                    fontSize: "0.875rem",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user._id}
                </code>
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
              </div>

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

              {shareInfo && (
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
                    {shareInfo}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;