import React, { useState, useEffect } from "react";
import { Copy, Facebook, MessageCircle, Send } from "lucide-react";

const MyProfile = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [user, setUser] = useState(null);
  const [purchase, setPurchase] = useState("");
  const [referrals] = useState([
    { name: "Emily Micheal", date: "April 10, 2025", points: 500 },
    { name: "Michael Brown", date: "April 12, 2025", points: 500 },
    { name: "Sophia Taylor", date: "April 14, 2025", points: 500 },
    { name: "Liam Johnson", date: "April 15, 2025", points: 500 },
    { name: "Olivia Smith", date: "April 16, 2025", points: 500 },
  ]);

  useEffect(() => {
    const stored = sessionStorage.getItem("userProfile");
    if (stored) {
      setUser(JSON.parse(stored));
      setStep(2);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      const fakeUser = {
        name: "John Doe",
        email: formData.email,
        referralCode: "CELEBRATE50",
        points: 1250,
      };
      setUser(fakeUser);
      sessionStorage.setItem("userProfile", JSON.stringify(fakeUser));
      setStep(2);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userProfile");
    setUser(null);
    setStep(1);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    alert("Referral code copied!");
  };

  const potentialPoints = Math.floor(purchase / 10);
  const discountValue = Math.floor(purchase / 20);

  return (
    <div className="gradientright text-dark min-vh-100">
      {step === 1 && (
        <div className="d-flex justify-content-center align-items-center vh-100 px-3 lightest-back">
          <div
            className="card shadow-lg border-0 p-4 gradient135 rounded-4"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <h2 className="text-center fw-bold dark-text mb-4">
              Login to My Profile
            </h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold light-text">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="form-control border-0 shadow-sm"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold light-text">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="form-control border-0 shadow-sm"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="btn dark-back text-white w-100 mb-3">
                Continue
              </button>
            </form>
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => (window.location.href = "/")}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      )}

      {step === 2 && user && (
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold dark-text">Refer a Friend</h1>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm fw-semibold"
            >
              Logout
            </button>
          </div>

          <p className="text-center light-text mb-5 fs-5">
            Share the joy celebrations with friends and earn{" "}
            <b>500 points</b> for each successful referral!
          </p>

          <div className="row g-4">
            {/* Points Section */}
            <div className="col-lg-6">
              <div className="card shadow-lg h-100 text-center p-4 gradient135 border-0">
                <div
                  className="rounded-circle border border-5 light-back mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: "120px", height: "120px" }}
                >
                  <span className="fs-3 fw-bold light-text">
                    {user.points}
                  </span>
                </div>
                <p className="fw-semibold">
                  Next milestone: <b>2,000 Points</b>
                </p>

                <ul className="list-unstyled text-start mt-3 small">
                  <li>🏅 500 Points — For each successful referral</li>
                  <li>💰 100 Points — For every ₹1000 purchase</li>
                  <li>🎉 50% Redemption — Use points for next celebrations</li>
                </ul>

                <button className="btn dark-back text-white mt-3">
                  Redeem Points
                </button>
              </div>
            </div>

            {/* Invite Friends */}
            <div className="col-lg-6">
              <div className="card shadow-lg h-100 p-4 gradient135 border-0">
                <h3 className="fw-bold dark-text mb-3">
                  Invite Friends & Earn
                </h3>
                <div className="lightest-back p-3 rounded mb-3 small">
                  <p>💎 Share your unique code with friends.</p>
                  <p>💰 You get 500 points per successful referral.</p>
                  <p>🎁 Your friend gets 200 points on first purchase.</p>
                  <p>♾ No limit on how many friends you can refer!</p>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text fw-monospace bg-light">
                    {user.referralCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="btn light-back text-white"
                  >
                    <Copy size={18} />
                  </button>
                </div>

                <p className="small mb-2 fw-semibold light-text">
                  Share your referral link:
                </p>
                <div className="d-flex gap-2 mb-3">
                  <button className="btn btn-success d-flex align-items-center gap-1">
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                  <button className="btn btn-primary d-flex align-items-center gap-1">
                    <Facebook size={16} /> Facebook
                  </button>
                  <button
                    className="btn text-white d-flex align-items-center gap-1"
                    style={{ backgroundColor: "#9D4DFF" }}
                  >
                    <Send size={16} /> More
                  </button>
                </div>

                <button className="btn dark-back text-white w-100">
                  Invite Friend Now
                </button>
              </div>
            </div>
          </div>

          {/* Points Calculator & Referrals */}
          <div className="row g-4 mt-4">
            {/* Calculator */}
            <div className="col-lg-6">
              <div className="card shadow-lg h-100 p-4 gradient135 border-0">
                <h5 className="dark-text fw-bold mb-3">Points Calculator</h5>
                <input
                  type="number"
                  placeholder="Purchase Amount (₹)"
                  value={purchase}
                  onChange={(e) => setPurchase(e.target.value)}
                  className="form-control mb-3 shadow-sm border-0"
                />
                <p>Potential Points: <b>{potentialPoints}</b></p>
                <p>Discount Value: ₹{discountValue}</p>
              </div>
            </div>

            {/* Referrals List */}
            <div className="col-lg-6">
              <div className="card shadow-lg h-100 p-4 gradient135 border-0">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="dark-text fw-bold mb-0">Your Referrals</h5>
                  <span className="small text-muted">Show all</span>
                </div>

                {referrals.map((r, i) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between align-items-center lightest-back p-2 rounded mb-2"
                  >
                    <div>
                      <p className="mb-0 fw-semibold">{r.name}</p>
                      <small className="text-muted">Joined on {r.date}</small>
                    </div>
                    <p className="mb-0 fw-semibold light-text">
                      +{r.points} Points
                    </p>
                  </div>
                ))}

                <button className="btn btn-link p-0 mt-2 light-text fw-semibold">
                  View all Referrals →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
