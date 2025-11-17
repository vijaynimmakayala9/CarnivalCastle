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
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSelect = (address) => {
        if (address && address._id) {
            const slug = address.name.toLowerCase().replace(/\s+/g, '-');
            navigate(`/theaters/${slug}`, { state: { address } });
        } else {
            // Handle "Coming Soon" if needed
            alert("This location is coming soon!");
        }
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

                <main className="main-wrapper">
                    <section
                        className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix lightdark-back"
                        style={{
                            minHeight: "200px",
                            background: "#C69FF4",
                            padding: "20px 0"
                        }}
                    >
                        <div className="container-fluid position-relative">
                            <div className="row align-items-center position-relative">
                                {/* Back Button */}
                                <div className="col-12 position-absolute top-0 start-0 p-3 p-md-4 p-lg-5">
                                    <button
                                        type="button"
                                        className="btn dark-back shadow-lg text-light"
                                        style={{
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                            border: "none"
                                        }}
                                        onClick={() => navigate(-1)}
                                    >
                                        <i className="far fa-arrow-alt-circle-left me-1 me-md-2"></i>
                                        <span>Back</span>
                                    </button>
                                </div>

                                {/* Title Section */}
                                <div className="col-12 text-center">
                                    <div className="pt-5 pt-md-4 pb-3 pb-md-4">
                                        <h1 className="dark-text fw-bold mb-3 
                        h3 h2-md h1-lg 
                        px-3 px-md-4 px-lg-5">
                                            Choose Your Nearest Location
                                        </h1>
                                        <p className="light-text mb-0 
                        fs-6 fs-md-5 
                        px-3 px-md-4 px-lg-5">
                                            <i>We've got the vibe, you bring the party.</i>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="pb-5" style={{ background: "#C69FF4" }}>
                        <div className="container">
                            <div className="row">
                                {addresses.length > 0 ? (
                                    addresses.map((address, index) => (
                                        <div className="col-12 col-md-4 d-flex" key={address._id || index}>
                                            <div
                                                className="card text-black shadow-lg bg-white d-flex flex-column w-100"
                                                style={{
                                                    backgroundColor: "#E9DCFF",
                                                    borderRadius: "1rem",
                                                    overflow: "hidden",
                                                    border: "2px solid #E9DCFF",
                                                }}
                                            >
                                                <div style={{ flexShrink: 0, position: "relative", padding: "15px" }}>
                                                    {address.image ? (
                                                        <>
                                                            <img
                                                                src={BaseUrl + address.image}
                                                                alt={address.city}
                                                                className="img-fluid"
                                                                style={{
                                                                    width: "100%",
                                                                    objectFit: "cover",
                                                                    height: "250px",
                                                                    borderRadius: "15px",
                                                                }}
                                                            />
                                                            <a
                                                                href={address.addressLine2}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    position: "absolute",
                                                                    bottom: "20px",
                                                                    right: "20px",
                                                                    borderRadius: "50%",
                                                                    zIndex: 10,
                                                                    background: "",
                                                                    padding: "5px",
                                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                                                }}
                                                                title="View on Google Maps"
                                                            >
                                                                <img
                                                                    src="https://bnbtplstorageaccount.blob.core.windows.net/googleicons/map (1).svg"
                                                                    alt="Google Maps"
                                                                    style={{ width: "50px", height: "50px" }}
                                                                />
                                                            </a>
                                                        </>
                                                    ) : (
                                                        <div
                                                            className="d-flex align-items-center justify-content-center"
                                                            style={{
                                                                height: "250px",
                                                                backgroundColor: "#444",
                                                                fontSize: "3rem",
                                                                borderRadius: "15px",
                                                            }}
                                                        >
                                                            <i className="bi bi-image text-dark"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="card-body d-flex flex-column justify-content-between p-3">
                                                    <div>
                                                        <h5 className="card-title fw-semibold mb-1 text-dark">
                                                            <i className="fa-solid fa-map-location-dot me-2" style={{ color: "#000" }}></i>
                                                            {address.name}, {address.city}
                                                        </h5>
                                                        {address.landmark && (
                                                            <p className="mb-0 text-dark" style={{ fontSize: "0.9rem" }}>
                                                                <i className="fa-solid fa-location-dot me-2" style={{ color: "#000" }}></i>
                                                                {address.landmark}
                                                            </p>
                                                        )}
                                                        <div className="mt-3 d-flex gap-2 flex-wrap text-center">
                                                            <span
                                                                className="badge rounded-pill dark-text d-flex align-items-center"
                                                                style={{ fontSize: "0.8rem", padding: "0.5em 1em", gap: "0.4em" }}
                                                            >
                                                                <FaBirthdayCake /> Cakes Available
                                                            </span>
                                                            <span
                                                                className="badge rounded-pill dark-text d-flex align-items-center"
                                                                style={{ fontSize: "0.9rem", padding: "0.5em 1em", gap: "0.4em" }}
                                                            >
                                                                <FaCar /> Parking Available
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn dark-back text-white w-100 mt-3"
                                                        onClick={() => handleLocationSelect(address)}
                                                    >
                                                        Book Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center">
                                        <p>No locations available at the moment.</p>
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <a
                                    href="tel:+918977917555"
                                    className="btn btn-lg dark-back text-white d-inline-flex align-items-center gap-2"
                                >
                                    <FaPhone /> Book Via Call
                                </a>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default LocationSelector;