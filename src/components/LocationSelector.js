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
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);

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

      if (res.data?.success) {
        const data = res.data.data;

        const cleanedCities = [
          ...new Set(
            data.map((item) => (item.city || "Hyderabad").trim())
          ),
        ];

        setAddresses(data);
        setCities(cleanedCities);
        setSelectedCity(cleanedCities[0]);

        const firstAddress = data.find(
          (a) => a.city.trim() === cleanedCities[0]
        );
        setSelectedLocation(firstAddress || null);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (address) => {
    const slug = address.name.toLowerCase().replace(/\s+/g, "-");
    sessionStorage.setItem("selectedAddress", JSON.stringify(address));
    navigate(`/theaters/${slug}`, { state: { address } });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-purple" role="status" />
      </div>
    );
  }

  const filteredAddresses = addresses.filter(
    (a) => a.city.trim() === selectedCity
  );

  return (
    <>
      <div className="home-page indexsix">
        <Header />

        <main className="main-wrapper position-relative light-back">
          <div style={{ position: "relative", zIndex: 2 }}>
            {/* HEADER */}
            <section
              className="slider-area breadcrumb-area d-flex align-items-center justify-content-center"
              style={{ minHeight: "100px" }}
            >
              <div className="text-center pt-1 pb-3">
                <h1 className="text-white fw-bold mb-2">
                  Choose Your Nearest Location
                </h1>
                <p className="text-white mb-0">
                  <i>We've got the vibe, you bring the party.</i>
                </p>
              </div>
            </section>

            {/* CITY SELECTOR */}
            <section className="py-0">
              <div className="container">
                <h5 className="text-white text-center mb-3">Select City</h5>
                <div className="d-flex justify-content-center flex-wrap gap-3">
                  {cities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedCity(city);
                        setSelectedLocation(
                          addresses.find((a) => a.city.trim() === city)
                        );
                      }}
                      className="btn"
                      style={{
                        background:
                          selectedCity === city ? "#fff" : "#A259FF",
                        color:
                          selectedCity === city ? "#4000BC" : "#fff",
                        borderRadius: "25px",
                        padding: "8px 22px",
                        fontWeight: 600,
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* ADDRESS SELECTOR */}
            <section className="py-3">
              <div className="container">
                <h5 className="text-white text-center mb-3">
                  Select Address / Branch
                </h5>
                <div className="d-flex justify-content-center flex-wrap gap-3">
                  {filteredAddresses.map((address) => (
                    <button
                      key={address._id}
                      onClick={() => setSelectedLocation(address)}
                      className="btn"
                      style={{
                        background:
                          selectedLocation?._id === address._id
                            ? "#fff"
                            : "#6C3BFF",
                        color:
                          selectedLocation?._id === address._id
                            ? "#4000BC"
                            : "#fff",
                        borderRadius: "25px",
                        padding: "8px 22px",
                        fontWeight: 600,
                      }}
                    >
                      {address.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* SINGLE RESPONSIVE CARD */}
            {selectedLocation && (
              <section className="pb-5">
                <div className="container">
                  <div
                    className="card shadow-lg mx-auto overflow-hidden"
                    style={{
                      backgroundColor: "#E9DCFF",
                      borderRadius: "1.2rem",
                      maxWidth: "900px",
                      border: "none",
                    }}
                  >
                    <div className="row g-0">
                      {/* IMAGE */}
                      <div className="col-12 col-md-5">
                        <img
                          src={BaseUrl + selectedLocation.image}
                          alt={selectedLocation.city}
                          className="img-fluid h-100 w-100"
                          style={{
                            objectFit: "cover",
                            minHeight: "250px",
                          }}
                        />
                      </div>

                      {/* DETAILS */}
                      <div className="col-12 col-md-7">
                        <div className="card-body p-4 h-100 d-flex flex-column">
                          <h4 className="fw-bold text-dark mb-2">
                            {selectedLocation.name},{" "}
                            {selectedLocation.city}
                          </h4>

                          <p className="mb-2 text-dark">
                            <strong>Address:</strong>{" "}
                            {selectedLocation.addressLine1}
                          </p>

                          <p className="mb-3 text-dark">
                            <strong>Landmark:</strong>{" "}
                            {selectedLocation.landmark}
                          </p>

                          <div className="d-flex gap-2 flex-wrap mb-3">
                            <span className="badge bg-light text-dark p-2 d-flex align-items-center gap-2">
                              <FaBirthdayCake /> Cakes Available
                            </span>
                            <span className="badge bg-light text-dark p-2 d-flex align-items-center gap-2">
                              <FaCar /> Parking Available
                            </span>
                          </div>

                          <div className="mt-auto">
                            <button
                              className="btn dark-back text-white w-100 mb-2"
                              onClick={() =>
                                handleBookNow(selectedLocation)
                              }
                            >
                              Book Now
                            </button>

                            <a
                              href={`tel:+91${selectedLocation.phone}`}
                              className="btn btn-outline-dark w-100 d-flex justify-content-center align-items-center gap-2"
                            >
                              <FaPhone /> Book via Call
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default LocationSelector;
