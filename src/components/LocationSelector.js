// src/components/LocationSelector.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaBirthdayCake, FaCar, FaPhone, FaMapMarkerAlt, FaChevronDown, FaStar, FaUtensils } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LocationSelector = () => {
  const [addresses, setAddresses] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const BaseUrl = "https://api.carnivalcastle.com/";

  useEffect(() => { fetchAddresses(); }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/address/alladdress"
      );
      if (res.data?.success) {
        const data = res.data.data;
        const cleanedCities = [...new Set(data.map((item) => (item.city || "Hyderabad").trim()))];
        setAddresses(data);
        setCities(cleanedCities);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => { setSelectedCity(e.target.value); setSelectedLocation(null); };
  const handleBranchChange = (e) => {
    const selected = addresses.find((a) => a._id === e.target.value) || null;
    setSelectedLocation(selected);

    if (selected) {
      const slug = selected.name.toLowerCase().replace(/\s+/g, "-");
      sessionStorage.setItem("selectedAddress", JSON.stringify(selected));
      navigate(`/theaters/${slug}`, { state: { address: selected } });
    }
  };
  const handleBookNow = (address) => {
    const slug = address.name.toLowerCase().replace(/\s+/g, "-");
    sessionStorage.setItem("selectedAddress", JSON.stringify(address));
    navigate(`/theaters/${slug}`, { state: { address } });
  };

  const filteredAddresses = addresses.filter((a) => a.city.trim() === selectedCity);

  return (
    <>
      <div className="home-page indexsix">
        <Header />
        <main className="main-wrapper position-relative light-back">
          <div style={{ position: "relative", zIndex: 2 }}>

            {/* HERO */}
            <section
              className="slider-area breadcrumb-area d-flex align-items-center justify-content-center"
              style={{ minHeight: "110px" }}
            >
              <div className="text-center pt-1 pb-3">
                <h1 className="text-white fw-bold mb-1" style={{ fontSize: "clamp(20px, 4vw, 32px)" }}>
                  Choose Your Nearest Location
                </h1>
                <p className="text-white mb-0" style={{ opacity: 0.85, fontSize: "14px" }}>
                  <i>We've got the vibe, you bring the party.</i>
                </p>
              </div>
            </section>

            {/* ── SELECTOR CARD ── */}
            <section className="py-4">
              <div className="container">
                <div className="mx-auto" style={{ maxWidth: "480px" }}>
                  <div style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "24px 28px 22px",
                    border: "1px solid rgba(124,58,237,0.10)",
                    boxShadow: "0 8px 32px rgba(124,58,237,0.18), 0 2px 8px rgba(124,58,237,0.10), 0 1px 2px rgba(0,0,0,0.04)",
                  }}>

                    {/* TOP ACCENT STRIP inside card, fully rounded */}
                    <div style={{
                      height: "4px",
                      background: "linear-gradient(90deg,#6d28d9,#a855f7,#c084fc,#a855f7,#6d28d9)",
                      borderRadius: "999px",
                      marginBottom: "18px",
                    }} />

                    {/* heading */}
                    <div className="text-center mb-3">
                      <p style={{
                        fontWeight: 800, fontSize: "16px",
                        background: "linear-gradient(135deg,#6d28d9,#a855f7)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "2px", letterSpacing: "0.2px",
                      }}>
                        Find Your Theatre
                      </p>
                      <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>
                        Pick a city, then your nearest branch
                      </p>
                    </div>

                    {/* CITY */}
                    <div className="mb-3">
                      <label style={labelStyle}>📍 City</label>
                      <div style={{ position: "relative" }}>
                        <select className="loc-select" value={selectedCity} onChange={handleCityChange} style={selectStyle}>
                          <option value="">Select a city...</option>
                          {cities.map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                        <FaChevronDown style={chevronStyle} />
                      </div>
                    </div>

                    {/* BRANCH */}
                    <div>
                      <label style={labelStyle}>🏢 Branch</label>
                      <div style={{ position: "relative" }}>
                        <select
                          className="loc-select"
                          value={selectedLocation?._id || ""}
                          onChange={handleBranchChange}
                          disabled={!selectedCity}
                          style={{
                            ...selectStyle,
                            opacity: !selectedCity ? 0.4 : 1,
                            cursor: !selectedCity ? "not-allowed" : "pointer",
                          }}
                        >
                          <option value="">Select Nearest branch...</option>
                          {filteredAddresses.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                        </select>
                        <FaChevronDown style={chevronStyle} />
                      </div>
                    </div>

                    {/* step hint */}
                    <p style={{ fontSize: "11px", color: "#ccc", textAlign: "center", marginTop: "14px", marginBottom: 0 }}>
                      {!selectedCity
                        ? "Start by selecting a city ↑"
                        : !selectedLocation
                          ? "Now pick a branch ↑"
                          : "✓ Location selected — see details below"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── LOCATION CARD ── */}
            {/* {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-light" role="status" />
              </div>
            ) : selectedLocation ? (
              <section className="pb-5">
                <div className="container">
                  <div
                    className="mx-auto"
                    style={{
                      maxWidth: "720px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      background: "#fff",
                      animation: "fadeSlideUp 0.3s ease",
                      boxShadow: "0 8px 32px rgba(124,58,237,0.18), 0 2px 8px rgba(124,58,237,0.10), 0 1px 2px rgba(0,0,0,0.04)",
                      border: "1px solid rgba(124,58,237,0.10)",
                    }}
                  >
                    <div className="row g-0">
             
                      <div className="col-12 col-md-4 position-relative">
                        <img
                          src={BaseUrl + selectedLocation.image}
                          alt={selectedLocation.name}
                          className="w-100"
                          style={{
                            objectFit: "cover",
                            height: "100%",
                            minHeight: "220px",
                            display: "block",
                          }}
                        />
                        <span style={{
                          position: "absolute", top: "10px", left: "10px",
                          background: "#000000",
                          color: "#ffffff", borderRadius: "999px",
                          padding: "3px 11px", fontSize: "11px", fontWeight: 700,
                          boxShadow: "0 2px 8px rgba(109,40,217,0.4)",
                        }}>
                          4.9 <FaStar color="#fff703" />
                        </span>
                      </div>

                 
                      <div className="col-12 col-md-8">
                        <div style={{ padding: "20px 24px", height: "100%", display: "flex", flexDirection: "column" }}>

                  
                          <div style={{
                            height: "4px",
                            background: "linear-gradient(90deg,#6d28d9,#a855f7,#c084fc,#a855f7,#6d28d9)",
                            borderRadius: "999px",
                            marginBottom: "14px",
                          }} />

                          <h5 style={{ fontWeight: 800, color: "#1a1a2e", marginBottom: "4px", fontSize: "17px" }}>
                            {selectedLocation.name}
                          </h5>

                       <div className="d-flex align-items-start gap-2 mb-2" style={{ fontSize: "13px", color: "#555" }}>
                            <FaMapMarkerAlt color="#a855f7" style={{ marginTop: "2px", flexShrink: 0 }} />
                            <span><strong>Address:</strong> {selectedLocation.addressLine1}</span>
                          </div> 
                          <div className="d-flex align-items-start gap-2 mb-3" style={{ fontSize: "13px", color: "#555" }}>
                            <span style={{ color: "#a855f7", flexShrink: 0 }}>🏁</span>
                            <span><strong>Landmark:</strong> {selectedLocation.landmark}</span>
                          </div>

                          <div className="d-flex gap-2 flex-wrap mb-3">
                            {[
                              { icon: <FaBirthdayCake size={10} />, label: "Cakes" },
                              { icon: <FaCar size={10} />, label: "Parking" },
                              { icon: <FaUtensils size={10} />, label: "food" },
                            ].map(({ icon, label }) => (
                              <span key={label} style={{
                                display: "inline-flex", alignItems: "center", gap: "5px",
                                background: "#f5f0ff", color: "#6d28d9",
                                border: "1px solid #e5d9ff", borderRadius: "999px",
                                padding: "3px 10px", fontSize: "11px", fontWeight: 600,
                              }}>
                                {icon} {label}
                              </span>
                            ))}
                          </div>

                          <div style={{ height: "1px", background: "#f3eeff", marginBottom: "14px" }} />

                          <div className="mt-auto d-flex gap-2">
                            <button
                              onClick={() => handleBookNow(selectedLocation)}
                              style={{
                                flex: 1,
                                background: "linear-gradient(135deg,#6d28d9,#a855f7)",
                                border: "none", borderRadius: "999px",
                                padding: "10px", color: "#fff",
                                fontWeight: 700, fontSize: "13px", cursor: "pointer",
                                boxShadow: "0 4px 14px rgba(109,40,217,0.35)",
                                transition: "transform 0.2s, box-shadow 0.2s",
                              }}
                              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(109,40,217,0.4)"; }}
                              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(109,40,217,0.35)"; }}
                            >
                              Proceed
                            </button>
                            <a
                              href={`tel:+91${selectedLocation.phone}`}
                              style={{
                                flex: 1, border: "2px solid #6d28d9", color: "#6d28d9",
                                borderRadius: "999px", padding: "10px",
                                fontWeight: 600, fontSize: "13px",
                                textDecoration: "none",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#6d28d9"; e.currentTarget.style.color = "#fff"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6d28d9"; }}
                            >
                              <FaPhone size={11} /> Call
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="pb-5">
                <div className="container text-center">
                  <div className="mx-auto py-4 px-4" style={{
                    maxWidth: "360px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "16px",
                    border: "1px dashed rgba(255,255,255,0.18)",
                  }}>
                    <div style={{ fontSize: "38px", marginBottom: "10px" }}>🎭</div>
                    <p className="text-white mb-0" style={{ fontSize: "14px", opacity: 0.7 }}>
                      Select a city and branch above to see details
                    </p>
                  </div>
                </div>
              </section>
            )} */}

          </div>
        </main>
      </div>
      <Footer />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .loc-select { appearance:none !important; -webkit-appearance:none !important; }
        .loc-select:focus {
          outline: none !important;
          border-color: #a855f7 !important;
          box-shadow: 0 0 0 3px rgba(168,85,247,0.18) !important;
        }
      `}</style>
    </>
  );
};

const labelStyle = {
  fontSize: "11px", fontWeight: 700, color: "#666",
  marginBottom: "6px", display: "block",
  letterSpacing: "0.6px", textTransform: "uppercase",
};

const selectStyle = {
  width: "100%",
  border: "1.5px solid #ede5ff",
  borderRadius: "10px",
  padding: "10px 38px 10px 14px",
  fontSize: "14px", color: "#1a1a2e",
  background: "#faf7ff", cursor: "pointer",
  boxShadow: "inset 0 1px 3px rgba(124,58,237,0.06)",
  transition: "border-color 0.2s",
};

const chevronStyle = {
  position: "absolute", right: "13px", top: "50%",
  transform: "translateY(-50%)", color: "#a855f7",
  pointerEvents: "none", fontSize: "11px",
};

export default LocationSelector;