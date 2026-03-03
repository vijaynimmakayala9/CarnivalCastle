import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { URLS } from "../Url";
import axios from "axios";
import logo from "./logo1.png";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaMobileAlt,
  FaInstagram,
  FaHome,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaUser,
  FaBars,
  FaCompress,
  FaExpand,
  FaImage,
  FaDollarSign,
  FaCrown,
  FaTicketAlt
} from "react-icons/fa";

function Header() {
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  const [show, setshow] = useState(false);
  const [Contact, setContact] = useState([]);
  const [PopUp, setPopUp] = useState([]);

  const shows = show === true ? "menu-opened" : "";

  useEffect(() => {
    // Show message only on home page
    if (location.pathname === "/") {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    GetFooterData();
  }, []);

  const GetFooterData = () => {
    axios.post(URLS.GetFooter, {}, {}).then((res) => {
      if (res.status === 200) {
        setContact(res.data.contactus);
        setPopUp(res.data.popup[0]);
      }
    });
  };

  const currentPage = () => {
    const path = location.pathname === "/" ? "Home" : location.pathname.slice(1);
    return path;
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <>
      <div className={shows}>
        <header className="header main-header headersix">
          <nav className="navbar navbar-expand-lg header-nav" style={{ backgroundColor: "#fff" }}>
            <div className="navbar-header">

              {/* MOBILE ONLY: Hamburger + Logo + Book/Icons row */}
              <div className="d-flex d-md-none align-items-center justify-content-between w-100">

                {/* LEFT: Hamburger + Logo */}
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="border-0 bg-transparent p-1"
                    onClick={() => setshow(true)}
                    aria-label="Open menu"
                    style={{ lineHeight: 1 }}
                  >
                    <FaBars size={22} color="#800080" />
                  </button>
                  <a href="/" className="navbar-brand logo mb-0">
                    <img src={logo} className="img-fluid" alt="Logo" style={{ height: "80px" }} />
                  </a>
                </div>

                {/* RIGHT: Book Now + Icons */}
                <div className="d-flex flex-column align-items-end">
                  <a
                    href="/locations"
                    className="btn text-white book1-btn"
                    style={{ padding: "6px 14px", fontSize: "13px", borderRadius: "10px", fontWeight: "600" }}
                  >
                    Book Now
                  </a>
                  <div className="d-flex gap-3 mt-2">
                    <a href={Contact.instagram || "#"} target="_blank" rel="noreferrer">
                      <FaInstagram size={18} color="#E1306C" />
                    </a>
                    <a href={`tel:${Contact.phone}`}>
                      <FaPhoneAlt size={18} color="#800080" />
                    </a>
                    <a href="/profile">
                      <FaUser size={18} color="#831cd2" />
                    </a>
                  </div>
                </div>
              </div>

              {/* DESKTOP ONLY: Just the logo */}
              <a href="/" className="navbar-brand logo ms-1 d-none d-md-block">
                <img src={logo} className="img-fluid" alt="Logo" style={{ height: "80px", marginRight: "10px" }} />
              </a>

            </div>

            <div className="main-menu-wrapper">
              <div className="menu-header">
                <a href="/" className="menu-logo">
                  <img src={logo} className="img-fluid" alt="Logo" />
                </a>
                <a id="menu_close" className="menu-close" onClick={() => setshow(false)}>
                  <i className="fas fa-times" />
                </a>
              </div>
              <ul className="main-nav">
                <li><NavLink to="/" style={{ color: currentPage() === "Home" ? "#800080" : "" }}>Home</NavLink></li>
                <li><NavLink to="/about" style={{ color: currentPage() === "about" ? "#800080" : "" }}>About Us</NavLink></li>
                <li><NavLink to="/locations" style={{ color: currentPage() === "locations" ? "#800080" : "" }}>THEATRES</NavLink></li>
                <li><NavLink to="/cakes" style={{ color: currentPage() === "cakes" ? "#800080" : "" }}>Cakes</NavLink></li>
                <li><NavLink to="/enquiry" style={{ color: currentPage() === "enquiry" ? "#800080" : "" }}>GET QUOTE</NavLink></li>
                <li><NavLink to="/Reviews" style={{ color: currentPage() === "Reviews" ? "#800080" : "" }}>Testimonials</NavLink></li>
                <li><NavLink to="/gallery" style={{ color: currentPage() === "gallery" ? "#800080" : "" }}>Gallery</NavLink></li>
                <li><NavLink to="/blogs" style={{ color: currentPage() === "blogs" ? "#800080" : "" }}>Blogs</NavLink></li>
                <li><NavLink to="/profile" style={{ color: currentPage() === "profile" ? "#800080" : "" }}>My Profile</NavLink></li>

                {/* Mobile Contact Icons - Only visible in mobile menu */}
                <li className="mobile-contact-header d-md-none" style={{
                  borderTop: '1px solid #e0e0e0',
                  marginTop: '15px',
                  paddingTop: '15px'
                }}>
                  <div style={{
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                    paddingLeft: '15px'
                  }}>
                    Connect With Us
                  </div>
                </li>
                <li className="mobile-contact-item d-md-none">
                  <a
                    href="https://www.instagram.com/carnival_castle_hyderabad/?hl=en"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 15px",
                      color: "#333",
                      textDecoration: "none",
                      borderBottom: "1px solid #f0f0f0"
                    }}
                    onClick={() => setshow(false)}
                  >
                    <FaInstagram color="#E1306C" size={20} />
                    <span style={{ fontSize: "14px" }}>Instagram</span>
                  </a>
                </li>
                <li className="mobile-contact-item d-md-none">
                  <a
                    href={`tel:8374777834`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 15px",
                      color: "#333",
                      textDecoration: "none",
                      borderBottom: "1px solid #f0f0f0"
                    }}
                    onClick={() => setshow(false)}
                  >
                    <FaPhoneAlt color="#40008C" size={20} />
                    <span style={{ fontSize: "14px" }}>Call Us: +91 8374777834</span>
                  </a>
                </li>
                <li className="mobile-contact-item d-md-none">
                  <a
                    href={`https://wa.me/918374777834`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 15px",
                      color: "#333",
                      textDecoration: "none",
                      borderBottom: "1px solid #f0f0f0"
                    }}
                    onClick={() => setshow(false)}
                  >
                    <FaWhatsapp color="#25D366" size={20} />
                    <span style={{ fontSize: "14px" }}>WhatsApp: +91 8374777834</span>
                  </a>
                </li>
                <li className="mobile-contact-item d-md-none">
                  <a
                    href={`tel:${Contact.mobile || "8374777834"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 15px",
                      color: "#333",
                      textDecoration: "none"
                    }}
                    onClick={() => setshow(false)}
                  >
                    <FaMobileAlt color="#40008C" size={20} />
                    <span style={{ fontSize: "14px" }}>Mobile: +91 8374777834</span>
                  </a>
                </li>
              </ul>

              {/* Desktop Contact Details */}
              <div
                className="desktop-contact-details d-none d-lg-flex"
                style={{
                  justifyContent: "center",
                  gap: "40px",
                  marginTop: "10px",
                  padding: "10px 0",
                  backgroundColor: "#9D4DFF",
                  fontSize: "14px",
                  borderRadius: "20px"
                }}
              >

                {/* INSTAGRAM */}
                <a
                  href="https://www.instagram.com/carnival_castle_hyderabad/?hl=en"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "700"
                  }}
                >
                  <span
                    style={{
                      background: "#fff",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <FaInstagram color="#dc2743" size={16} />
                  </span>
                  <span>carnival_castle_hyderabad</span>
                </a>

                {/* PHONE */}
                <a
                  href="tel:8341428342"
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "700"
                  }}
                >
                  <span
                    style={{
                      background: "#fff",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <FaPhoneAlt color="#4b50f2" size={14} />
                  </span>
                  <span>+91 8341428342</span>
                </a>

                {/* WHATSAPP */}
                <a
                  href="https://wa.me/918374777834"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "700"
                  }}
                >
                  <span
                    style={{
                      background: "#fff",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <FaWhatsapp color="#2cde5b" size={16} />
                  </span>
                  <span>+91 8374777834</span>
                </a>

              </div>
            </div>

            <ul className="nav header-navbar-rht book-now-btn d-none d-lg-block">
              <li className="nav-item contact-item">
                <a href="/locations" className="btn text-white book1-btn">Book Now</a>
              </li>
            </ul>
          </nav>
        </header>

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <div className="mobile-bottom-nav d-lg-none">
          <NavLink to="/" className="nav-item">
            <FaHome size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/gallery" className="nav-item">
            <FaImage size={20} />
            <span>Gallery</span>
          </NavLink>
          <div className="nav-item book-special" onClick={() => window.location.href = '/locations'}>
            <div className="inner-book">
              <FaTicketAlt size={20} color="#fff" />
            </div>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#800080", marginTop: "2px" }}>Book Now</span>
          </div>
          <NavLink to="/cakes" className="nav-item">
            <FaBirthdayCake size={20} />
            <span>Addons</span>
          </NavLink>
          <NavLink to="/packages" className="nav-item">
            <FaCrown size={20} />
            <span>Plans</span>
          </NavLink>
        </div>

        {/* Floating Actions */}
        <div className="cp-floating-area">
          <div className="cp-floating-action">
            {/* FULLSCREEN TOGGLE */}
            <button onClick={toggleFullScreen} className="sbutton fullscreen">
              {isFullScreen ? (
                <FaExpand size={20} color="white" />
              ) : (
                <FaCompress size={20} color="white" />
              )}
            </button>
            <a href="tel:+918341428342" className="sbutton phone"><FaPhoneAlt size={22} color="white" /></a>
            <a href="https://wa.me/918374777834" className="sbutton whatsapp"><FaWhatsapp size={22} color="white" /></a>
            {showMessage && <div className="floating-msg">How can I assist you?</div>}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Mobile Bottom Nav Styles */

        .book1-btn {
  background-color: #9D4DFF;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.book1-btn:hover {
  background-color: #7a2df5;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(157, 77, 255, 0.35);
}
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 65px;
          background: #fff;
          display: flex;
          justify-content: space-around;
          align-items: center;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
          padding-bottom: env(safe-area-inset-bottom);
        }

        .mobile-bottom-nav .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #666;
          text-decoration: none;
          font-size: 11px;
          font-weight: 500;
        }

        .mobile-bottom-nav .nav-item.active {
          color: #800080;
        }

        .book-special {
          margin-top: -30px;
        }

        .inner-book {
          background: #800080;
          color: white;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(128, 0, 128, 0.4);
          border: 4px solid #fff;
        }

        /* Adjustments for Floating Area so it doesn't overlap bottom nav */
        .cp-floating-area {
          position: fixed;
          bottom: 80px; /* Moved up to clear bottom bar */
          right: 20px;
          z-index: 999;
        }

        .sbutton {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          text-decoration: none;
        }
        .phone { background: #242724; }
        .whatsapp { background: #25D366; }
        .fullscreen { background: #924ae9; }

        .floating-msg {
          position: absolute;
          right: 60px;
          bottom: 10px;
          background: white;
          padding: 8px 15px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          white-space: nowrap;
          font-size: 13px;
        }

        /* Mobile Contact Items Hover Effect */
        .mobile-contact-item a:hover {
          background-color: #f8f8f8;
        }

        @media (max-width: 991px) {
          body { padding-bottom: 70px; } /* Prevent content being hidden behind bar */
          .header-nav { padding: 10px 0; }
          
          /* Ensure main-nav has proper spacing for contact items */
          .main-nav {
            padding-bottom: 20px;
          }
        }
      `}</style>
    </>
  );
}

export default Header;  