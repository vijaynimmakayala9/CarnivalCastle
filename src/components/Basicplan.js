import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaLocationArrow, FaMap, FaTheaterMasks } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';

const Basicplan = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [totalPrice, setTotalPrice] = useState(
    Number(sessionStorage.getItem("TotalPrice")) || 0
  );
  const [data, setData] = useState(
    JSON.parse(sessionStorage.getItem("data")) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [couponData, setCouponData] = useState({ couponCode: "" });
  const [addons, setAddons] = useState(
    JSON.parse(sessionStorage.getItem("adonsJSON")) || []
  );
  const [people, setPeople] = useState(sessionStorage.getItem("maxPeople") || 0);
  const theatermaxseats = Number(sessionStorage.getItem("theatermaxSeating"));
  const [price, setPrice] = useState(0);
  const [discountprice, setdiscountprice] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [modalPop, setModalPop] = useState(false);
  const navigate = useNavigate();
  const navigateOccassions = useNavigate();

  const isComboPlan = sessionStorage.getItem("planType") === "Combo";

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
      }
    });
  };

  const GetUniqueId = () => {
    axios.post(URLS.GetUnicId).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
      }
    });
  };

  const handleCouponChange = (couponCode) => {
    setCouponData({ ...couponData, couponCode });
    setIsCouponApplied(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const applyCoupon = async () => {
    if (!couponData.couponCode) {
      toast("Please select a coupon code");
      return;
    }

    const dataArray = {
      couponId: couponData.couponCode,
    };

    try {
      const res = await axios.post(URLS.GetCheckCoupon, dataArray);
      if (res.status === 200) {
        toast(res.data.message);
        sessionStorage.setItem("coupon_Id", res.data.coupon_Id);
        const couponAmount = Number(res.data.couponAmount);
        const amount = Number(sessionStorage.getItem("subtotal"));
        const TotalPrice = parseFloat(sessionStorage.getItem("TotalPrice"));

        var discountAmount;
        if (res.data.couponCodeType === "Percentage") {
          discountAmount = amount * (res.data.couponAmount / 100);
        } else {
          discountAmount = res.data.couponAmount;
        }

        sessionStorage.setItem("couponAmount", discountAmount);
        var tamount = amount - discountAmount;
        sessionStorage.setItem("Couponbutton", true);
        sessionStorage.setItem("CouponData", JSON.stringify(res.data));
        setdiscountprice(discountAmount);
        sessionStorage.setItem("coupondis", discountAmount);
        sessionStorage.setItem("TotalPrice", tamount);
        setTotalPrice(tamount);
        setIsCouponApplied(true);
        setModalPop(true);

        // Auto-close modal after 2 seconds
        setTimeout(() => {
          setModalPop(false);
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast(error.response.data.message);
      }
    }
  };

  const handleCloseModal = () => {
    setModalPop(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataArray = {
      userName: data.userName,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      noOfPersons: data.noOfPersons,
      decoration: data.decoration,
      subTotal: sessionStorage.getItem("subtotal"),
      theatreId: sessionStorage.getItem("theaterId"),
      time: sessionStorage.getItem("slot"),
      date: sessionStorage.getItem("date"),
      theaterName: sessionStorage.getItem("theaterName"),
      type: sessionStorage.getItem("planType"),
    };

    console.log("Payload sent to API:", dataArray);

    const token = sessionStorage.getItem("token");

    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/addbooking",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log("Response from API:", res.data);
        sessionStorage.setItem("bookingid", res.data.bookingId);
        sessionStorage.setItem("userDetails", JSON.stringify(data));
        sessionStorage.setItem("countPeople", data.noOfPersons);
        sessionStorage.setItem("adonsJSON", JSON.stringify([]));
        sessionStorage.setItem("data", JSON.stringify(data));

        GetUniqueId();

        if (couponData.couponCode === "FLAT700COMBO") {
          navigateOccassions("/ComboOccassions");
        } else {
          navigateOccassions("/Occassions");
        }
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  };

  const handleChange = (e) => {
    let myUser = { ...data };
    myUser[e.target.name] = e.target.value;
    sessionStorage.setItem("extraAddedPersonsForTheatre", myUser.noOfPersons);
    setData(myUser);

    const isCombo = couponData.couponCode === "FLAT700COMBO";

    if (isCombo) {
      if (Number(myUser.noOfPersons) > people) {
        const extraPersonPrice = Number(sessionStorage.getItem("extraPersonprice"));
        const extraPrice = (Number(myUser.noOfPersons) - people) * extraPersonPrice;
        sessionStorage.setItem("extraPersonperprice", extraPrice);
        setPrice(extraPrice);
        sessionStorage.setItem("TotalPrice", parseFloat(sessionStorage.getItem("theatrePrices")) + extraPrice);
        sessionStorage.setItem("theaterPrice", parseFloat(sessionStorage.getItem("theatrePrices")) + extraPrice);
        sessionStorage.setItem("subtotal", parseFloat(sessionStorage.getItem("theatrePrices")) + extraPrice);
      } else {
        setPrice(0);
        sessionStorage.setItem("extraPersonperprice", sessionStorage.getItem("extraPersonprice"));
        sessionStorage.setItem("TotalPrice", parseFloat(sessionStorage.getItem("theatrePrices")) + 0);
        sessionStorage.setItem("theaterPrice", parseFloat(sessionStorage.getItem("theatrePrices")) + 0);
        sessionStorage.setItem("subtotal", parseFloat(sessionStorage.getItem("theatrePrices")) + 0);
      }
    } else {
      if (Number(myUser.noOfPersons) > people) {
        const extraPersonPrice = parseFloat(sessionStorage.getItem("extraPersonprice") || 0);
        const extraPrice = (parseFloat(myUser.noOfPersons) - parseFloat(people)) * parseFloat(extraPersonPrice);
        sessionStorage.setItem("extraPersonperprice", parseFloat(extraPrice));
        setPrice(extraPrice);
        sessionStorage.setItem(
          "TotalPrice",
          parseFloat(sessionStorage.getItem("theatrePrices") || 0) +
          parseFloat(extraPrice) +
          parseFloat(sessionStorage.getItem("occprice") || 0) +
          parseFloat(sessionStorage.getItem("cakeprice") || 0) +
          parseFloat(sessionStorage.getItem("addons") || 0) -
          parseFloat(sessionStorage.getItem("coupondis")) ||
          parseFloat(discountprice)
        );

        sessionStorage.setItem(
          "theaterPrice",
          parseFloat(sessionStorage.getItem("theatrePrices")) + parseFloat(extraPrice)
        );

        sessionStorage.setItem(
          "subtotal",
          parseFloat(sessionStorage.getItem("theatrePrices")) +
          parseFloat(extraPrice) +
          parseFloat(sessionStorage.getItem("occprice") || 0) +
          parseFloat(sessionStorage.getItem("cakeprice") || 0) +
          parseFloat(sessionStorage.getItem("addons") || 0)
        );
      } else {
        setPrice(0);
        sessionStorage.setItem(
          "extraPersonperprice",
          sessionStorage.getItem("extraPersonprice")
        );
        sessionStorage.setItem(
          "TotalPrice",
          parseFloat(sessionStorage.getItem("theatrePrices")) +
          0 +
          parseFloat(sessionStorage.getItem("occprice") || 0) +
          parseFloat(sessionStorage.getItem("cakeprice") || 0) +
          parseFloat(sessionStorage.getItem("addons") || 0) -
          parseFloat(sessionStorage.getItem("coupondis")) ||
          parseFloat(discountprice)
        );
        sessionStorage.setItem(
          "theaterPrice",
          parseFloat(sessionStorage.getItem("theatrePrices")) + 0
        );
        sessionStorage.setItem(
          "subtotal",
          parseFloat(sessionStorage.getItem("theatrePrices")) +
          0 +
          parseFloat(sessionStorage.getItem("occprice") || 0) +
          parseFloat(sessionStorage.getItem("cakeprice") || 0) +
          parseFloat(sessionStorage.getItem("addons") || 0)
        );
      }
    }
  };

  useEffect(() => {
    GetTheatersData();
  }, []);

  const handleBackClick = () => {
    navigate("/theaters");
  };

  const SubTotaluserprice = (parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
    parseFloat(sessionStorage.getItem("occprice") || 0) +
    parseFloat(sessionStorage.getItem("addons") || 0) +
    (parseFloat(sessionStorage.getItem("cakeprice")) || 0)).toFixed(2);

  const Totaluserprice = (parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
    parseFloat(sessionStorage.getItem("occprice") || 0) +
    parseFloat(sessionStorage.getItem("addons") || 0) +
    (parseFloat(sessionStorage.getItem("cakeprice")) || 0) -
    (parseFloat(sessionStorage.getItem("couponAmount")) || 0)).toFixed(2);

  if (isLoading) {
    return (
      <div
        className="text-center"
        style={{
          backgroundColor: "var(--charcoal-black)",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <img
            src="assets/img/gipss.gif"
            style={{ height: "300px" }}
            alt="Loading"
          />
          <h6 style={{ color: "white" }}>Loading...</h6>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page indexsix">
      <Header />
      <main className="main-wrapper">
        <section
          id="parallax"
          className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
        >
          <div className="container"></div>
        </section>
        <section
          className="shop-area pt-5 pb-5 p-relative lighter-back"
        >
          <div className="container">
            <button
              type="button"
              className="btn mb-3 light-back shadow-lg text-light"
              onClick={handleBackClick}
            >
              <i className="far fa-arrow-alt-circle-left"></i> Back
            </button>
            <div className="row">
              <div className="col-8">
                <div className="bg-white p-2 rounded w-100 mx-auto shadow-lg">
                  <div className="row">
                    <div className="col-12">
                      <h4>Overview</h4>
                    </div>
                    <div className="col-12">
                      <div className="bg-white p-2 rounded w-100 mx-auto">
                        <div className="row g-3 align-items-center flex-nowrap flex-wrap justify-content-between">
                          <div className="col-auto d-flex align-items-center">
                            <FaTheaterMasks style={{ color: "var(--gold-gradient)" }} />
                            <span className="ms-2">{sessionStorage.getItem("theaterName")}</span>
                          </div>

                          <div className="col-auto d-flex align-items-center">
                            <FaMapMarkerAlt style={{ color: "var(--gold-gradient)" }} />
                            <span className="ms-2">Hyderabad</span>
                          </div>

                          <div className="col-auto d-flex align-items-center">
                            <FaCalendarAlt style={{ color: "var(--gold-gradient)" }} />
                            <span className="ms-2">{sessionStorage.getItem("date")}</span>
                          </div>

                          <div className="col-auto d-flex align-items-center">
                            <FaClock style={{ color: "var(--gold-gradient)" }} />
                            <span className="ms-2">{sessionStorage.getItem("slot")}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className="container mt-4">
              <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <div className="col-md-8 bg-white shadow-sm rounded">
                    <div className="mb-3 mt-4">
                      <div className="">
                        <h5 className="card-title">Booking Details</h5>
                        <div className="row mb-3 mt-3">
                          <div className="col-md-6">
                            <label htmlFor="userName" className="form-label">
                              Your Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="userName"
                              name="userName"
                              value={data.userName}
                              onChange={handleChange}
                              required
                              placeholder="Enter Your Name"
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="numPersons" className="form-label">
                              Number of Persons <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              id="numPersons"
                              name="noOfPersons"
                              value={data.noOfPersons}
                              onChange={handleChange}
                              required
                            >
                              <option value="">No. of Persons</option>
                              {Array.from(
                                { length: theatermaxseats },
                                (_, index) => (
                                  <option key={index} value={index + 1}>
                                    {index + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label htmlFor="userPhone" className="form-label">
                              Mobile Number <span className="text-danger">*</span>
                            </label>
                            <input
                              type="tel"
                              className="form-control"
                              maxLength={10}
                              minLength={10}
                              pattern="[6789][0-9]{9}"
                              required
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                              id="userPhone"
                              name="userPhone"
                              value={data.userPhone}
                              placeholder="Enter your phone number"
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="userEmail" className="form-label">
                              Email Id <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="userEmail"
                              required
                              value={data.userEmail}
                              name="userEmail"
                              placeholder="Enter your email"
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-12 mt-3 mb-5">
                            <label htmlFor="discountCoupon" className="form-label fw-semibold">
                              <i className="bi bi-ticket-perforated-fill me-2"></i>
                              Select Plan <span className="text-danger">*</span>
                            </label>
                            <div className="row gx-3 gy-3">
                              <div className="col-md-6">
                                <div
                                  className={`coupon-box ${couponData.couponCode === "FLAT400BASIC" ? "selected" : ""}`}
                                  onClick={() => handleCouponChange("FLAT400BASIC")}
                                >
                                  <div className="coupon-header">
                                    <i className="bi bi-gift-fill me-2 text-warning"></i>
                                    BASIC PLAN
                                  </div>
                                  <div className="coupon-details">Starts from ₹2148</div>
                                  <div className="coupon-details">Includes Theatre and Decoration</div>
                                  <div className="coupon-details">Add-ons: Cake, Fog Entry, Etc will be in next step</div>


                                  <div className="coupon-minimum">
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div
                                  className={`coupon-box ${couponData.couponCode === "FLAT700COMBO" ? "selected" : ""}`}
                                  onClick={() => handleCouponChange("FLAT700COMBO")}
                                >
                                  <div className="coupon-header">
                                    <i className="bi bi-gift-fill me-2 text-warning"></i>
                                    COMBO PLAN
                                  </div>
                                  <div className="coupon-details">Flat 30% Off on Plans</div>
                                  <div className="coupon-details">Starts from ₹4100/</div>
                                  <div className="coupon-details">Including: Theatre, Decoration, Cake, Photography etc..</div>
                                  <div className="coupon-details">Total 14 services</div>
                                  <div className="coupon-code">
                                  </div>
                                  <div className="coupon-minimum">
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="input-group mt-4">
                              <button
                                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                                style={{
                                  background: isCouponApplied ? "#330C5F" : "#330C5F",
                                  border: "none",
                                  color: "white",
                                  fontWeight: "600",
                                }}
                                type="submit"
                                disabled={isCouponApplied || !couponData.couponCode}
                              >
                                Proceed
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-5">
                    <div className="position-sticky" style={{ top: "20px" }}>
                      <div className="bg-white mb-3">
                        <div className="card-body mt-3">
                          <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded">
                            <div>Total:</div>
                            <div>
                              {couponData.couponCode === "FLAT700COMBO" ? (
                                `₹ ${parseFloat(sessionStorage.getItem("TotalPrice")).toFixed(2)}`
                              ) : (
                                `₹ ${Totaluserprice}`
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="shadow-lg">
                        <div className="card-body">
                          <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                              <h2 className="accordion-header" id="headingOne">
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapseOne"
                                  aria-expanded={isOpen ? "true" : "false"}
                                  aria-controls="collapseOne"
                                  onClick={() => setIsOpen(!isOpen)}
                                >
                                  Summary Details
                                </button>
                              </h2>
                              <div
                                id="collapseOne"
                                className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
                                aria-labelledby="headingOne"
                                data-bs-parent="#accordionExample"
                              >
                                <div className="accordion-body">
                                  <div>
                                    {couponData.couponCode !== "FLAT700COMBO" && (
                                      <>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>
                                            Theatre Price ({data.noOfPersons} ppl)
                                          </div>
                                          <div>
                                            ₹
                                            {Number(
                                              sessionStorage.getItem("theaterPrice")
                                            )}
                                          </div>
                                        </div>
                                        <hr />
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>
                                            Occasions (
                                            {sessionStorage.getItem("occasionName")}
                                            )
                                          </div>
                                          <div>
                                            ₹
                                            {sessionStorage.getItem("occprice") || 0}
                                          </div>
                                        </div>
                                        <hr />
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>Cake</div>
                                          <div>
                                            ₹
                                            {sessionStorage.getItem("cakeprice") || 0}
                                          </div>
                                        </div>
                                        <hr />
                                      </>
                                    )}
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      <div>Addons</div>
                                      <div>
                                        ₹
                                        {sessionStorage.getItem("addons") || 0}
                                      </div>
                                    </div>
                                    <hr />
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div>Sub Total</div>
                                      <div>
                                        {couponData.couponCode === "FLAT700COMBO" ? (
                                          `₹0`
                                        ) : (
                                          `₹ ${SubTotaluserprice}`
                                        )}
                                      </div>
                                    </div>
                                    <hr />
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div>Coupon Amount</div>
                                      <div>
                                        ₹
                                        {parseFloat(
                                          sessionStorage.getItem("coupondis")
                                        ).toFixed(2)}
                                      </div>
                                    </div>
                                    <hr />
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div>Total Amount</div>
                                      <div>
                                        {couponData.couponCode === "FLAT700COMBO" ? (
                                          `₹0`
                                        ) : (
                                          `₹ ${Totaluserprice}`
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
        <Footer />
      </main>
      <ToastContainer />

      <Modal
        size="sm"
        show={modalPop}
        onHide={handleCloseModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            🎉 Coupon Added!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div>
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>✅</div>

          </div>
          <h5>Coupon added successfully!</h5>
          <button
            onClick={handleCloseModal}
            className="btn btn-success mt-4 px-4"
          >
            Okay
          </button>
        </Modal.Body>
      </Modal>

      <style jsx>{`
    .coupon-box {
      border: 2px solid #ddd;
      border-radius: 10px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      height: 100%;
      background-color: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      color: black;
    }

    .coupon-box:hover {
      border-color: var(--gold);
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
    }

    .coupon-box.selected {
      border-color: #C69FF4;
      background: linear-gradient(to right, #9D4DFF, #C69FF4)!important;

    .coupon-header {
      font-weight: 700;
      font-size: 1.2rem;
      color: white;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    .coupon-details {
      font-size: 1rem;
      color: #fff;
      margin-bottom: 8px;
    }

    .coupon-code {
      font-size: 0.85rem;
      color: #fff;
      margin-bottom: 6px;
    }

    .coupon-minimum {
      font-size: 0.8rem;
      color: #000;
    }

    @media (max-width: 576px) {
      .coupon-header {
        font-size: 1rem;
      }

      .coupon-details,
      .coupon-code,
      .coupon-minimum {
        font-size: 0.8rem;
      }

      .coupon-box {
        padding: 15px;
      }
    }
  `}</style>
    </div>
  );
};

export default Basicplan;