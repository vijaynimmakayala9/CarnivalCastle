import React, { useState, useEffect, useRef } from "react";
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

const ComboOccassions = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768); // Open on desktop by default

  const [isLoading, setIsLoading] = useState(false);
  const [Occation, setOccation] = useState([]);
  console.log(Occation);
  const [selectedOccasion, setSelectedOccasion] = useState(
    JSON.parse(sessionStorage.getItem("occasion"))
  );
  // console.log(selectedOccasion);
  const additionalImagesRef = useRef(null);
  const [textFieldValue, setTextFieldValue] = useState("");
  useEffect(() => {
    const storedValue = sessionStorage.getItem("specialPersonName");
    if (storedValue) {
      setTextFieldValue(storedValue);
    }
  }, []);
  const handleChange = (e) => {
    const newValue = e.target.value;
    setTextFieldValue(newValue);
    sessionStorage.setItem("specialPersonName", newValue);
  };

  const navigate = useNavigate();

  useEffect(() => {
    GetTheatersData();
    GetOccation();
  }, []);

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
      }
    });
  };

  const GetOccation = () => {
    axios.post(URLS.GetAllOccation, {}).then(
      (res) => {
        if (res.status === 200) {
          setOccation(res?.data?.occasions);
        }
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          setOccation([]);
        }
      }
    );
  };

  useEffect(() => {
    // Update the state based on the window width when the component mounts
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768); // Open if width is greater than 768px
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = () => {
    const dataArray = {
      occasionId: selectedOccasion._id,
      personName: textFieldValue,
      totalPrice: sessionStorage.getItem("TotalPrice"),
      bookingId: sessionStorage.getItem("bookingid"),
    };

    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updateocasion",
        dataArray
      )
      .then(
        (res) => {
          if (res.status === 200) {
            if (!textFieldValue) {
              toast.error("Please fill out the text field!");
              return;
            }
            navigate("/ComboPlans");
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            console.log(error.response);
            toast.error(error.response.message);
          } else if (error.response && error.response.status === 406) {
            toast.error(error.response.message);
            setTimeout(() => {
              navigate("/theaters");
            }, 2000);
          }
        }
      );
  };

  const handleImageClick = (occasion) => {
    setSelectedOccasion(occasion);
    sessionStorage.setItem("occasionName", occasion.name);

    var totalPrice = sessionStorage.getItem("TotalPrice");

    var occprice = sessionStorage.getItem("occprice");

    console.log(occprice, "occprice");

    sessionStorage.setItem("occasion", JSON.stringify(occasion));
    // sessionStorage.setItem("selectedOccasion", JSON.stringify(occasion)); // Save localStorage

    var total =
      parseFloat(totalPrice) +
      parseFloat(occasion.price) -
      parseFloat(occprice);

    sessionStorage.setItem("TotalPrice", parseFloat(total));

    sessionStorage.setItem("occprice", occasion.price);

    console.log(total, "TotalPrice");

    setTimeout(() => {
      additionalImagesRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 200);
  };

  const navigateCakes = useNavigate();
  const handleClick = () => {
    navigateCakes("/Basicplan");
  };

  return (
    <>
      {isLoading === true ? (
        <div
          className="text-center"
          style={{
            // background:
            //   "linear-gradient(329deg, rgba(191, 63, 249, 1) 0%, rgba(113, 51, 210, 1) 100%)",
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
      ) : (
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
              className="shop-area pt-5 pb-5 p-relative lightest-back"
              style={{ background: "white" }}
            >
              <div className="container">
                <button
                  type="button"
                  className="btn light-back shadow-lg text-light"
                  onClick={handleClick}
                >
                  {" "}
                  <i className="far fa-arrow-alt-circle-left "></i> Back
                </button>
                <div className="container mt-4">
                  <div className="row mb-4">
                    {/* Occasions */}
                    <div className="col-md-8 lighter-back shadow-sm rounded">
                      <h3 className="mt-3">Select Occasion</h3>
                      <div className="row">
                        {Occation.map((ele, ind) => (
                          <div
                            className="col-6 col-md-3 mb-3 text-center"
                            key={ind}
                            onClick={() => handleImageClick(ele)}

                          >
                            <div
                              className={`${selectedOccasion?._id === ele?._id ? "shadow-lg" : "shadow-sm"}`}
                              style={{
                                cursor: "pointer",
                                border: "2px solid #C69FF4",
                                margin: "1px",
                                background:
                                  selectedOccasion?._id === ele?._id
                                    ? " #C69FF4"
                                    : "linear-gradient(45deg, #FFFAFB, #BEBEBE)",
                                color:
                                  selectedOccasion?._id === ele?._id
                                    ? "black"
                                    : "inherit",
                                borderRadius: "0.5rem",
                                padding: "1rem",
                                transition:
                                  "background 0.3s ease, color 0.3s ease",
                              }}
                            >
                              <img
                                src={URLS.Base + ele.image}
                                alt="occasions images"
                                // className="rounded-circle img-fluid"
                                className="img-fluid rounded-pill"
                                style={{
                                  height: "150px",
                                  width: "150px",
                                  objectFit: "cover",
                                }}
                              />
                              <h6 className="mt-2">{ele.name}</h6>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="alert light-back mt-3">
                        <i
                          className="fa fa-exclamation-triangle me-2"
                          style={{ color: "white" }}
                        ></i>
                        <span style={{ color: "white" }}>
                          <b>ATTENTION:</b> Decoration cannot be customized.
                        </span>{" "}
                        <br />
                        <span style={{ color: "white" }}>
                          <b>Note:</b> You can add multiple names by comma
                          seperated, if you have multiple special person
                        </span>
                      </div>

                      {/* Text Field */}
                      {selectedOccasion && (
                        <div
                          ref={additionalImagesRef}
                          className="m-4 col-md-12"
                        >
                          <div className="m-4 col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Special Person Name"
                              value={textFieldValue}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Booking Summary */}
                    <div className="col-lg-4 col-md-5">
                      <div className="position-sticky" style={{ top: "20px" }}>
                        <div className="shadow-lg rounded mb-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded ">
                              <div>Total:</div>
                              <div>
                                ₹ 0
                                {/* {parseFloat(
                                  sessionStorage.getItem("TotalPrice")
                                ).toFixed(2)} */}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="shadow-lg">
                          <div className="card-body">
                            <div className="accordion" id="accordionExample">
                              <div className="accordion-item">
                                <h2
                                  className="accordion-header"
                                  id="headingOne"
                                >
                                  <button
                                    className="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseOne"
                                    aria-expanded={isOpen ? "true" : "false"} // Controlled by state
                                    aria-controls="collapseOne"
                                    onClick={() => setIsOpen(!isOpen)} // Toggle state on click
                                  >
                                    Summary Details
                                  </button>
                                </h2>
                                <div
                                  id="collapseOne"
                                  className={`accordion-collapse collapse ${isOpen ? "show" : ""
                                    }`} // Conditional class for open state
                                  aria-labelledby="headingOne"
                                  data-bs-parent="#accordionExample"
                                >
                                  <div className="accordion-body">
                                    <div>
                                      {/* <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>
                                          Theatre Price (
                                          {sessionStorage.getItem("countPeople")}{" "}
                                          ppl)
                                        </div>
                                        <div>
                                          ₹
                                          {sessionStorage.getItem("theaterPrice")}
                                        </div>
                                      </div> */}
                                      {/* <hr />
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
                                          ₹{selectedOccasion?.price || 0}
                                        </div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Plan Price</div>
                                        <div>
                                          ₹
                                          {sessionStorage.getItem("cakeprice") ||
                                            0}
                                        </div>
                                      </div>
                                      <hr /> */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Sub Total</div>
                                        <div>
                                          {/* ₹{sessionStorage.getItem("subtotal")} */}
                                          ₹ 0
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
                                          ₹ 0
                                          {/* {parseFloat(
                                            sessionStorage.getItem("TotalPrice")
                                          ).toFixed(2)} */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
                          onClick={() => handleSubmit()}
                          className="btn w-100 mt-2 dark-back text-white"
                          style={{
                            // backgroundColor: "#a020f0",
                            boxShadow: "none",
                            color: "black",
                            border: "none",
                          }}
                        >
                          Proceed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <Footer />
          </main>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default ComboOccassions;
