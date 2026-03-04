import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTicketAlt, FaCopy, FaCalendarAlt,
  FaMapMarkerAlt, FaClock, FaCheckCircle,
} from "react-icons/fa";
import { BsTagFill } from "react-icons/bs";

const CouponSection = () => {
  const [coupons, setCoupons]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  // Touch swipe
  const touchStartX = useRef(null);
  const isSwiping   = useRef(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(
          "https://api.carnivalcastle.com/v1/carnivalApi/admin/coupon/getallcarnivalcoupons"
        );
        if (res.data.success) {
          const now = new Date();
          const valid = res.data.coupons.filter((c) => {
            const exp = new Date(c.toDate);
            return c.status === "active" && exp >= now && !isNaN(exp.getTime());
          });
          setCoupons(valid);
        }
      } catch (err) {
        console.error("Error fetching coupons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  // Auto-play every 4 s
  useEffect(() => {
    if (chunks.length <= 1) return;
    const t = setInterval(() => setActiveIdx(i => (i + 1) % chunks.length), 4000);
    return () => clearInterval(t);
  });

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!", { position: "top-center", autoClose: 1500 });
  };

  // Group into chunks of 3
  const CHUNK = 3;
  const chunks = [];
  for (let i = 0; i < coupons.length; i += CHUNK) chunks.push(coupons.slice(i, i + CHUNK));

  const prev = () => setActiveIdx(i => (i - 1 + chunks.length) % chunks.length);
  const next = () => setActiveIdx(i => (i + 1) % chunks.length);

  // Touch handlers
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; isSwiping.current = false; };
  const onTouchMove  = (e) => {
    if (!touchStartX.current) return;
    if (Math.abs(e.touches[0].clientX - touchStartX.current) > 8) { isSwiping.current = true; e.preventDefault(); }
  };
  const onTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (isSwiping.current && Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null; isSwiping.current = false;
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Loading coupons...</p>
    </div>
  );

  if (coupons.length === 0) return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="fw-bold mb-4" style={{ color: "#330C5F" }}>
          <FaTicketAlt className="me-2" />Exclusive CarnivalCastle Coupons
        </h2>
        <div className="d-inline-block p-5 rounded-4 shadow-sm"
          style={{ background: "linear-gradient(135deg,rgba(157,77,255,.08),rgba(255,255,255,.9))", maxWidth: 400 }}>
          <div className="mb-3 d-flex align-items-center justify-content-center"
            style={{ width: 100, height: 100, backgroundColor: "rgba(157,77,255,.15)", borderRadius: "50%", margin: "0 auto" }}>
            <FaTicketAlt size={48} color="#9D4DFF" />
          </div>
          <h5 className="fw-semibold mt-3" style={{ color: "#40008C" }}>No Active Coupons Right Now</h5>
          <p className="text-secondary small mt-2 mb-0">
            Please check back later — new offers and discounts are coming soon!
          </p>
        </div>
      </div>
    </section>
  );

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center fw-bold mb-3" style={{ color: "#330C5F" }}>
          <FaTicketAlt className="me-2" />Exclusive CarnivalCastle Coupons
        </h2>

        {/* ── Dot indicators ── */}
        {chunks.length > 1 && (
          <div className="d-flex justify-content-center gap-2 mb-4">
            {chunks.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                style={{
                  width: i === activeIdx ? 26 : 10, height: 10,
                  borderRadius: 999, border: "none", padding: 0, cursor: "pointer",
                  background: i === activeIdx ? "#9D4DFF" : "#E9DCFF",
                  transition: "all .3s ease",
                }}
              />
            ))}
          </div>
        )}

        {/* ── Slides ── */}
        <div style={{ position: "relative", overflow: "hidden" }}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

          <div style={{
            display: "flex",
            transform: `translateX(-${activeIdx * 100}%)`,
            transition: "transform .45s cubic-bezier(.34,1.26,.64,1)",
            willChange: "transform",
          }}>
            {chunks.map((chunk, ci) => (
              <div key={ci} style={{ minWidth: "100%", flexShrink: 0 }}>
                <div className="row g-4 justify-content-center">
                  {chunk.map((coupon) => (
                    <div key={coupon._id} className="col-md-4 d-flex justify-content-center">

                      {/* ── Original card design ── */}
                      <div className="coupon-ticket shadow-lg rounded-3 position-relative overflow-hidden h-100 lightdark-back">

                        {/* Status ribbon */}
                        <div className="position-absolute top-0 end-0 px-2 py-1 text-white fw-bold rounded-start"
                          style={{ backgroundColor: "#28a745", fontSize: ".8rem", zIndex: 2 }}>
                          <FaCheckCircle className="me-1" />Active
                        </div>

                        <div className="p-4 d-flex flex-column">
                          <h5 className="fw-bold mb-2" style={{ color: "#40008C" }}>
                            <BsTagFill className="me-2" />{coupon.title}
                          </h5>
                          <p className="text-black small mb-4">
                            {coupon.description || "Special offer for you!"}
                          </p>

                          {/* Discount & Code */}
                          <div className="text-center border rounded-3 py-3 mb-4 bg-light">
                            <div className="fw-bold fs-5" style={{ color: "#40008C" }}>
                              {coupon.discountType === "fixed" ? `₹${coupon.value} OFF` : `${coupon.value}% OFF`}
                            </div>
                            <div className="text-muted small mt-1">
                              Use Code: <span className="fw-bold text-danger">{coupon.couponCode}</span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="coupon-details mb-4 small text-secondary flex-grow-1">
                            <div className="d-flex justify-content-between py-1 border-bottom">
                              <span className="fw-semibold text-dark"><FaCalendarAlt className="me-2 text-primary" />Valid Till :</span>
                              <span className="text-black">{new Date(coupon.toDate).toLocaleDateString()}</span>
                            </div>
                            <div className="d-flex justify-content-between py-1 border-bottom">
                              <span className="fw-semibold text-dark"><FaMapMarkerAlt className="me-2 text-primary" />Theaters :</span>
                              <span className="text-black" style={{ maxWidth: 130, fontSize: ".85rem" }}>
                                {coupon.theaters.map(t => t.name).join(", ")}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between py-1">
                              <span className="fw-semibold text-dark"><FaClock className="me-2 text-primary" />Slots :</span>
                              <span className="text-black">{coupon.slots.join(", ")}</span>
                            </div>
                          </div>

                          <button className="btn w-100 mt-auto d-flex align-items-center justify-content-center gap-2"
                            style={{ backgroundColor: "#9D4DFF", color: "white", fontWeight: 600, borderRadius: 30 }}
                            onClick={() => copyCode(coupon.couponCode)}>
                            <FaCopy /> Copy Code
                          </button>
                        </div>

                        <div className="perforation-top" />
                        <div className="perforation-bottom" />
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next arrows */}
          {chunks.length > 1 && (
            <>
              <button onClick={prev} className="carousel-control-prev" type="button"
                style={{ width: 40, position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)" }}>
                <span className="carousel-control-prev-icon" aria-hidden="true" style={{ filter: "invert(30%) sepia(80%) saturate(500%) hue-rotate(240deg)" }} />
                <span className="visually-hidden">Previous</span>
              </button>
              <button onClick={next} className="carousel-control-next" type="button"
                style={{ width: 40, position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" }}>
                <span className="carousel-control-next-icon" aria-hidden="true" style={{ filter: "invert(30%) sepia(80%) saturate(500%) hue-rotate(240deg)" }} />
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      </div>

      <ToastContainer />

      <style>{`
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
          box-shadow: 0 8px 16px rgba(0,0,0,.12);
        }
        .perforation-top, .perforation-bottom {
          position: absolute; left: 0; right: 0; height: 8px;
          background: repeating-linear-gradient(90deg,#f8f9fa,#f8f9fa 10px,transparent 10px,transparent 20px);
          pointer-events: none;
        }
        .perforation-top  { top: 0; }
        .perforation-bottom { bottom: 0; }
      `}</style>
    </section>
  );
};

export default CouponSection;