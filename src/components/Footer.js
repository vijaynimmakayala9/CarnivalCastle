import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { URLS } from "../Url";
import axios from "axios";
import footerLogo from "./carnival_footer_logo-1-removebg-preview.png";
import logo from "../components/carnival_footer_logo-2-removebg-preview.png";
function Footer() {
  const [Contact, setContact] = useState([]);

  useEffect(() => {
    GetFooterData();
  }, []);

  const GetFooterData = () => {
    axios.post(URLS.GetFooter, {}, {}).then((res) => {
      if (res.status === 200) {
        setContact(res.data.contactus);
      }
    });
  };

  return (
    <div>
      {" "}
      <footer className="footer footersix">
        <div className="footer-top">
          <div className="container-md">
            <div className="row">
              <div className="col-lg-5 col-md-6">
                <div className="footer-widget footer-about">
                  <h2 className="footer-title">
                    {" "}
                    <img
                      // src={URLS.Base + Contact.logo}
                      // src={footerLogo}
                     src={logo}
                      alt="logo"
                      style={{ height: "100px" }}
                    />
                  </h2>
                  <div className="footer-about-content">
                    <p>{Contact.description}</p>
                    <div className="social-icon">
                      <ul>
                        <li>
                          <a
                            href="https://www.facebook.com/carnivalcastlehyderabad?_rdr"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-facebook-f" />{" "}
                          </a>
                        </li>

                        {/* <li>
                          <a
                            // href="#"
                            target="_blank"
                            className="twitter-icon" 
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="14px"><path fill="black" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>
                          </a>
                        </li> */}
                        <li>
                          <a
                            href="https://www.youtube.com/@Carnival_Castle"
                            target="_blank"
                          >
                            <i className="fab fa-youtube" />
                          </a>
                        </li>
                        {/* <li>
                          <a href={Contact.linkedin} target="_blank">
                            <i className="fab fa-linkedin-in" />
                          </a>
                        </li> */}
                        <li>
                          <a
                            href="https://www.instagram.com/carnival_castle_hyderabad/"
                            target="_blank"
                          >
                            <i className="fab fa-instagram" />
                          </a>
                        </li>
                        <li>
                          <a
                            href={`https://wa.me/${Contact.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-whatsapp" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-6 ">
                <div className="footer-widget footer-menu">
                  <h2 className="footer-title">Quick Links</h2>
                  <ul>
                    <li>
                      <NavLink to="/" style={{ color: "white" }}>
                        <i
                          className="fas fa-angle-double-right"
                          style={{ paddingRight: "5px" }}
                        />
                        Home
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/about" style={{ color: "white" }}>
                        <i
                          className="fas fa-angle-double-right"
                          style={{ paddingRight: "5px" }}
                        />
                        About
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/theaters" style={{ color: "white" }}>
                        <i
                          className="fas fa-angle-double-right"
                          style={{ paddingRight: "5px" }}
                        />
                        Theaters
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/cakes" style={{ color: "white" }}>
                        <i
                          className="fas fa-angle-double-right"
                          style={{ paddingRight: "5px" }}
                        />
                        Cake's
                      </NavLink>
                    </li>
                    <li>
                      {" "}
                      <NavLink to="/enquiry" style={{ color: "white" }}>
                        <i
                          className="fas fa-angle-double-right"
                          style={{ paddingRight: "5px" }}
                        />
                        Enquiry
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/Faqs" style={{ color: "white" }}>
                        <i
                          className="fas fa-angle-double-right"
                          style={{ paddingRight: "5px" }}
                        />
                        Faq's
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/Reviews" style={{ color: "white" }}>
                        <i
                          className="fas fa-angle-double-right"
                          style={{ paddingRight: "5px" }}
                        />
                        Testimonial
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/gallery" style={{ color: "white" }}>
                        <i
                          className="fas fa-angle-double-right"
                          style={{ paddingRight: "5px" }}
                        />
                        Gallery
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-5 col-md-6">
                <div className="footer-widget footer-contact ">
                  <h2 className="footer-title">Address</h2>
                  <div className="footer-contact-info">
                    <div className="footer-address">
                      <span>
                        <i className="fas fa-map-marker-alt" />
                      </span>
                      <p>{Contact.address}</p>
                    </div>
                    <p>
                      <i className="fas fa-phone-alt" />
                      <a
                        href={`tel:+91${Contact.phone}`}
                        className="text-white"
                      >
                        +91 {Contact.phone} (Whatsapp only)
                      </a>
                    </p>
                    <p className="mb-0">
                      <i className="fas fa-envelope" />
                      <a
                        href={`mailto:${Contact.email}`}
                        className="text-white footer-mail"
                      >
                        {Contact.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container-md">
            <div className="copyright">
              <div className="row">
                <div className="col-md-7 col-lg-6">
                  <div className="copyright-text">
                    <ul className="policy-menu text-start">
                      <li>
                        <NavLink to="/Terms" style={{ color: "white" }}>
                          Terms and Conditions
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/PrivacyPolicy" style={{ color: "white" }}>
                          Privacy Policy
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/RefundPolicy" style={{ color: "white" }}>
                          Refund Policy
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-5 col-lg-6">
                  <div className="copyright-menu">
                    <ul className="policy-menu">
                      <li>
                        <p className="mb-0">
                          © 2024. Carnival Castle. All Rights Reserved.
                          {/* Designed by{" "}
                          <a
                            href="https://digitalraiz.com/"
                            target="_blank"
                            className="company-name"
                            style={{ color: "white" }}
                          >
                            Digitalraiz
                          </a> */}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
