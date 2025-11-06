import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTicketAlt,
  FaCopy,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { BsTagFill } from "react-icons/bs";

const CouponSection = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(
          "https://api.carnivalcastle.com/v1/carnivalApi/admin/coupon/getallcarnivalcoupons"
        );
        if (res.data.success) {
          // ✅ Filter: show only active and non-expired coupons
          const currentDate = new Date();
          const validCoupons = res.data.coupons.filter((coupon) => {
            const expiryDate = new Date(coupon.toDate);
            return (
              coupon.status === "active" &&
              expiryDate >= currentDate &&
              !isNaN(expiryDate.getTime())
            );
          });
          setCoupons(validCoupons);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!", {
      position: "top-center",
      autoClose: 1500,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p>Loading coupons...</p>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4" style={{ color: "#330C5F" }}>
            <FaTicketAlt className="me-2" />
            Exclusive CarnivalCastle Coupons
          </h2>

          {/* Empty State Card */}
          <div
            className="d-inline-block p-5 rounded-4 shadow-sm"
            style={{
              background:
                "linear-gradient(135deg, rgba(157,77,255,0.08), rgba(255,255,255,0.9))",
              maxWidth: "400px",
            }}
          >
            <div
              className="mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "rgba(157,77,255,0.15)",
                borderRadius: "50%",
                margin: "0 auto",
              }}
            >
              <FaTicketAlt size={48} color="#9D4DFF" />
            </div>
            <h5 className="fw-semibold mt-3" style={{ color: "#40008C" }}>
              No Active Coupons Right Now
            </h5>
            <p className="text-secondary small mt-2 mb-0">
              Please check back later — new offers and discounts are coming soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Group coupons into chunks of 3 for carousel slides (desktop view)
  const chunkSize = 3;
  const couponChunks = [];
  for (let i = 0; i < coupons.length; i += chunkSize) {
    couponChunks.push(coupons.slice(i, i + chunkSize));
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center fw-bold mb-3" style={{ color: "#330C5F" }}>
          <FaTicketAlt className="me-2" />
          Exclusive CarnivalCastle Coupons
        </h2>

        {/* Carousel Wrapper */}
        <div
          id="couponsCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="4000"
        >
          {/* Indicators */}
          <div className="carousel-indicators">
            {couponChunks.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#couponsCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Carousel Inner */}
          <div className="carousel-inner">
            {couponChunks.map((chunk, chunkIndex) => (
              <div
                key={chunkIndex}
                className={`carousel-item ${chunkIndex === 0 ? "active" : ""}`}
              >
                <div className="row g-4 justify-content-center">
                  {chunk.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="col-md-4 d-flex justify-content-center"
                    >
                      <div className="coupon-ticket shadow-lg rounded-3 position-relative overflow-hidden h-100 lightdark-back">
                        {/* Status ribbon */}
                        <div
                          className="position-absolute top-0 end-0 px-2 py-1 text-white fw-bold rounded-start"
                          style={{
                            backgroundColor: "#28a745",
                            fontSize: "0.8rem",
                            zIndex: 2,
                          }}
                        >
                          <FaCheckCircle className="me-1" />
                          Active
                        </div>

                        <div className="p-4 d-flex flex-column">
                          <h5
                            className="fw-bold mb-2"
                            style={{ color: "#40008C" }}
                          >
                            <BsTagFill className="me-2" />
                            {coupon.title}
                          </h5>
                          <p className="text-black small mb-4">
                            {coupon.description || "Special offer for you!"}
                          </p>

                          {/* Discount & Code */}
                          <div className="text-center border rounded-3 py-3 mb-4 bg-light">
                            <div
                              className="fw-bold fs-5"
                              style={{ color: "#40008C" }}
                            >
                              {coupon.discountType === "fixed"
                                ? `₹${coupon.value} OFF`
                                : `${coupon.value}% OFF`}
                            </div>
                            <div className="text-muted small mt-1">
                              Use Code:{" "}
                              <span className="fw-bold text-danger">
                                {coupon.couponCode}
                              </span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="coupon-details mb-4 small text-secondary flex-grow-1">
                            <div className="d-flex justify-content-between py-1 border-bottom">
                              <span className="fw-semibold text-dark">
                                <FaCalendarAlt className="me-2 text-primary" />
                                Valid Till :
                              </span>
                              <span className="text-black">
                                {new Date(coupon.toDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between py-1 border-bottom">
                              <span className="fw-semibold text-dark">
                                <FaMapMarkerAlt className="me-2 text-primary" />
                                Theaters :
                              </span>
                              <span
                                className="text-black"
                                style={{
                                  maxWidth: "130px",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {coupon.theaters.map((t) => t.name).join(", ")}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between py-1">
                              <span className="fw-semibold text-dark">
                                <FaClock className="me-2 text-primary" />
                                Slots :
                              </span>
                              <span className="text-black">
                                {coupon.slots.join(", ")}
                              </span>
                            </div>
                          </div>

                          <button
                            className="btn w-100 mt-auto d-flex align-items-center justify-content-center gap-2"
                            style={{
                              backgroundColor: "#9D4DFF",
                              color: "white",
                              fontWeight: "600",
                              borderRadius: "30px",
                            }}
                            onClick={() => copyCode(coupon.couponCode)}
                          >
                            <FaCopy /> Copy Code
                          </button>
                        </div>

                        {/* Perforation */}
                        <div className="perforation-top"></div>
                        <div className="perforation-bottom"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          {coupons.length > 3 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#couponsCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#couponsCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      </div>

      <ToastContainer />

      <style jsx>{`
        .coupon-ticket {
          background: white;
          max-width: 340px;
          border: 2px dashed #e0e0e0;
          position: relative;
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .coupon-ticket:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        }

        .perforation-top,
        .perforation-bottom {
          position: absolute;
          left: 0;
          right: 0;
          height: 8px;
          background: repeating-linear-gradient(
            90deg,
            #f8f9fa,
            #f8f9fa 10px,
            transparent 10px,
            transparent 20px
          );
          pointer-events: none;
        }

        .perforation-top {
          top: 0;
        }

        .perforation-bottom {
          bottom: 0;
        }

        .carousel-indicators [data-bs-target] {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #9d4dff;
          opacity: 0.5;
          transition: opacity 0.2s;
        }

        .carousel-indicators .active {
          opacity: 1;
          background-color: #9d4dff;
        }
      `}</style>
    </section>
  );
};

export default CouponSection;
