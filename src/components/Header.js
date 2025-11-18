import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// import Sidebar from "./SideBar";
import { URLS } from "../Url";
import axios from "axios";
// import logo from "../components/logo.png";
// import logo from "../components/carnival_footer_logo-2-removebg-preview.png";
import logo from "./logo.png";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";



import { useLocation } from "react-router-dom";

function Header() {


  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Show only on home page
    if (location.pathname === "/") {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 15000); // hide after 5 sec
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);


  const [show, setshow] = useState(false);

  const shows = show === true ? "menu-opened" : "";

  const [Contact, setContact] = useState([]);

  const [PopUp, setPopUp] = useState([]);

  useEffect(() => {
    GetFooterData();
  }, []);

  const GetFooterData = () => {
    axios.post(URLS.GetFooter, {}, {}).then((res) => {
      if (res.status === 200) {
        setContact(res.data.contactus);
        setPopUp(res.data.popup[0]);
      }
      console.log(res.data.contactus);
    });
  };
  const currentPage = () => {
    const pageName =
      location.pathname === "/" ? "Home" : location.pathname.slice(1);
    return pageName;
  };

  // console.log(currentPage());
  return (
    <>
      {/* {currentPage() !== "Home" && (
        <style>
          {`
            .headersix .main-nav li a {
              color: #fff !important;
            }
          `}
        </style>
      )} */}

      <div className={shows}>
        <header className="header main-header headersix">
          {/* <div className="top-header">
            <div className="container-fluid">
              <div className="row justify-content-between align-items-center">
                <div className="col-12 col-md-10">
                  <div className="header-top-left">
                    <div className="social-icon">
                      <ul>
                        <li>
                          <a
                            href={`https://www.google.com/maps/place/Flat+No.401,+4th+floor,+Carnival+Castle,+Garden+View+Enclave,+Plot+No.16,+behind+Pista+House,+Ashok+Nagar,+Golden+Habitat,+Whitefields,+Kondapur,+Hyderabad,+Telangana+500084/data=!4m2!3m1!1s0x3bcb9331d3353e77:0x1a56f2c3d5cbcdee?utm_source=mstt_1&entry=gps&coh=192488&g_ep=CAESCjExLjEwNy4xMDEYACDXggMqGzQ3MDY4NjE1LCw5NDIwMDUzMSw0NzA3NTkxNUICSU4%3D`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-flex align-items-center"
                          >
                            <i className="fas fa-map-marker-alt" />
                            <span
                              className="text-white ms-2 location"
                              style={{ fontWeight: "bold" }}
                            >
                              Carnival Castle Hyderabad
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {PopUp.modalEnabled == true? (
                    <h3
                      className="offer-text"
                      style={{ paddingLeft: "25%", marginTop: "8px" }}
                    >
                      {PopUp.title}
                    </h3>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-12 col-md-2">
                  <div className="header-top-right">
                    <div className="social-icon">
                      <ul>
                        <li>
                          <a
                            href={`https://wa.me/`}
                            href={`https://api.whatsapp.com/send/?phone=+91${Contact.phone}&text=Hi&type=phone_number&app_absent=0`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-flex align-items-center"
                          >
                            <i className="fab fa-whatsapp" />
                            <span
                              className="text-white ms-2 header-contact"
                              style={{ fontWeight: "bold" }}
                            >
                              {Contact.phone}
                            </span>
                          </a>
                        </li>

                        <li>
                          <a
                            href="https://www.facebook.com/carnivalcastlehyderabad?_rdr"
                            target="_blank"
                          >
                            <i className="fab fa-facebook-f" />
                          </a>
                        </li> */}
          {/* <li
                          style={{
                            background: "#595b56",
                            borderRadius: "50%",
                            marginLeft: "5px",
                          }}
                        >
                          <a target="_blank" className="twitter-header">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              height="14px"
                              className="custom-svg"
                            >
                              <path
                                fill="white"
                                d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                              ></path>
                            </svg>
                          </a>
                        </li> */}

          {/* <li>
                          <a
                            href="https://www.youtube.com/@Carnival_Castle"
                            target="_blank"
                          >
                            <i className="fab fa-youtube" />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.instagram.com/carnival_castle_hyderabad/"
                            target="_blank"
                          >
                            <i className="fab fa-instagram" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <nav
            className="navbar navbar-expand-lg header-nav"
            // style={{
            //   backgroundColor: currentPage() === "Home" ? "#F5E7B6" : "",

            //   height: "90px",
            // }}
            style={{ backgroundColor: "#fff", fontSize: "60px" }}
          >
            <div className="navbar-header">
              <a
                id="mobile_btn"
                onClick={() => {
                  setshow(!show);
                }}
              >
                <span className="bar-icon">
                  <span />
                  <span />
                  <span />
                </span>
              </a>
              <a href="/" className="navbar-brand logo ms-1">
                <img
                  src={logo}
                  className="img-fluid"
                  alt="Logo"
                  style={{ height: "100px ", marginRight: "30px" }}
                />
              </a>
            </div>
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <a href="/" className="menu-logo">
                  <img src={logo} className="img-fluid" alt="Logo" />
                </a>
                <a
                  id="menu_close"
                  className="menu-close"
                  onClick={() => {
                    setshow(false);
                  }}
                >
                  <i className="fas fa-times" />
                </a>
              </div>
              <ul className="main-nav" >
                <li>
                  <NavLink
                    to="/"
                    style={{
                      color:
                        currentPage() === "Home" ? "#800080" : "",
                    }}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/about" style={{ color: currentPage() === "about" ? "#800080" : "" }}>
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/locations" style={{ color: currentPage() === "theaters" ? "#800080" : "", }}>THEATRE'S</NavLink>
                </li>
                <li>
                  <NavLink to="/cakes" style={{ color: currentPage() === "cakes" ? "#800080" : "", }}>Cakes</NavLink>
                </li>
                <li>
                  <NavLink to="/enquiry" style={{ color: currentPage() === "enquiry" ? "#800080" : "", }}>GET QUOTE</NavLink>
                </li>


                {/* <li>
                  <NavLink className="dropdown-item" to="/Faqs" style={{ color: currentPage() === "Faqs" ? "#800080" : "" }}>
                    FAQ's
                  </NavLink>
                </li> */}
                <li>
                  <NavLink className="dropdown-item" to="/Reviews" style={{ color: currentPage() === "Reviews" ? "#800080" : "" }}>
                    Testimonial
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/gallery" style={{ color: currentPage() === "gallery" ? "#800080" : "" }}>
                    Gallery
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" style={{ color: currentPage() === "profile" ? "#800080" : "", }}>My Profile</NavLink>
                </li>
              </ul>
            </div>
            <ul className="nav header-navbar-rht book-now-btn">
              <li className="nav-item contact-item">
                {/* <a href="/locations" className="btn main-booknow"> */}
                <a
                  href="/locations"
                  className="btn dark-back text-white"
                  style={{ backgroundColor: "#242724", color: "#f5e7b6" }}
                >
                  {/* <i className="fas fa-ticket-alt" /> */}
                  Book Now
                </a>
              </li>
            </ul>
          </nav>
        </header>



        <div className="cp-floating-area d-block zi-1100 p-relative">
          <div className="cp-floating-action cp-bg-move-y">
            {/* Phone Icon */}
            <a
              href="tel:+918341428342"
              className="sbutton phone"
              tooltip="Call Now"
              onClick={() => console.log("Calling: 8341428342")}
            >
              <FaPhoneAlt size={28} color="white" />
            </a>

            {/* WhatsApp Icon */}
            <div>
              {/* WhatsApp Icon */}
              <a
                href="https://api.whatsapp.com/send/?phone=+918341428342&text=Hi&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="sbutton whatsapp"
                tooltip="WhatsApp"
              >
                <FaWhatsapp size={28} color="white" />
              </a>

              {/* Floating Message */}
              {showMessage && (
                <div
                  style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "100px",
                    backgroundColor: "#fff",
                    color: "black",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    zIndex: 9999,
                    fontWeight: "bold",
                  }}
                >
                  How can i assist you?
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </>
  );
}

export default Header;
