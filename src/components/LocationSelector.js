// src/components/LocationSelector.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaBirthdayCake, FaCar, FaPhone } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LocationSelector = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();
  const BaseUrl = "https://api.carnivalcastle.com/";

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/address/alladdress"
      );
      if (res.data && res.data.success) {
        setAddresses(res.data.data || []);
        setSelectedLocation(res.data.data[1] || null); // select first
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (address) => {
    if (!address?._id) {
      alert("This location is coming soon!");
      return;
    }
    const slug = address.name.toLowerCase().replace(/\s+/g, "-");
    sessionStorage.setItem("selectedAddress", JSON.stringify(address));
    navigate(`/theaters/${slug}`, { state: { address } });
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: "50px" }}>
        <div className="spinner-border text-purple" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="home-page indexsix">
        <Header />

        <main className="main-wrapper" style={{ backgroundImage: "url('/img/bgss.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <section
            className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
            style={{
              minHeight: "200px",
              background: "",
              padding: "20px 0",
            }}
          >
            <div className="container-fluid position-relative">
              <div className="row align-items-center position-relative">
                <div className="col-12 text-center">
                  <div className="pt-5 pb-3">
                    <h1 className="text-white fw-bold mb-2">Choose Your Nearest Location</h1>
                    <p className="text-white mb-0">
                      <i>We've got the vibe, you bring the party.</i>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ---------- Location Tabs Section ---------- */}
          <section>
            <div className="container py-4">
              <div className="d-flex justify-content-center flex-wrap gap-4 pb-3">
                {addresses.map((address, index) => (
                  <button
                    key={index}
                    className="location-tab-button"
                    onClick={() => setSelectedLocation(address)}
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "1.1rem",
                      fontWeight: selectedLocation?._id === address._id ? "700" : "500",
                      color: selectedLocation?._id === address._id ? "#A259FF" : "#fff",
                      borderBottom:
                        selectedLocation?._id === address._id
                          ? "3px solid #A259FF"
                          : "3px solid transparent",
                      paddingBottom: "6px",
                      cursor: "pointer",
                    }}
                  >
                    {address.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ---------- Selected Location Card ---------- */}
          {selectedLocation && (
            <section className="pb-5">
              <div className="container pb-5">

                {/* Image Above */}
                <div className="text-center pb-4">
                  <img
                    src={BaseUrl + selectedLocation.image}
                    alt={selectedLocation.city}
                    className="img-fluid"
                    style={{
                      width: "100%",
                      maxWidth: "900px",
                      height: "330px",
                      objectFit: "cover",
                      borderRadius: "18px",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                    }}
                  />
                </div>

                {/* Card */}
                <div
                  className="card shadow-lg mx-auto"
                  style={{
                    backgroundColor: "#E9DCFF",
                    borderRadius: "1rem",
                    width: "100%",
                    maxWidth: "700px",
                    border: "2px solid #E9DCFF",
                  }}
                >
                  <div className="card-body p-4">

                    <h4 className="fw-bold text-dark mb-2">
                      {selectedLocation.name}, {selectedLocation.city}
                    </h4>

                    {selectedLocation.landmark && (
                      <p className="mb-2 text-dark">
                        <strong>Landmark:</strong> {selectedLocation.landmark}
                      </p>
                    )}

                    <div className="mt-3 d-flex gap-3 flex-wrap">
                      <span className="badge bg-light text-dark p-2 d-flex align-items-center gap-2">
                        <FaBirthdayCake /> Cakes Available
                      </span>
                      <span className="badge bg-light text-dark p-2 d-flex align-items-center gap-2">
                        <FaCar /> Parking Available
                      </span>
                    </div>

                    <button
                      className="btn dark-back text-white w-100 mt-4"
                      onClick={() => handleLocationSelect(selectedLocation)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <a
                    href="tel:+918977917555"
                    className="btn btn-lg dark-back text-white d-inline-flex align-items-center gap-2"
                  >
                    <FaPhone /> Book Via Call
                  </a>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};

export default LocationSelector;
