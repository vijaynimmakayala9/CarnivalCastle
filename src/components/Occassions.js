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

const Occassions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768); // Open on desktop by default

  const [Occation, setOccation] = useState([]);
  console.log(Occation);
  const [selectedOccasion, setSelectedOccasion] = useState(
    JSON.parse(sessionStorage.getItem("selectedOccasion")) || []
  );
  console.log(selectedOccasion);
  const [addons, setAddons] = useState(
    JSON.parse(sessionStorage.getItem("adonsJSON")) || []
  );
  console.log(addons);
  const [selectedOccasion1, setSelectedOccasion1] = useState();

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

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768); // Open if width is greater than 768px
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleImageClick = (occasion) => {
    setSelectedOccasion(occasion);
    // sessionStorage.setItem("occasionName", occasion.name);

    // var totalPrice = sessionStorage.getItem("TotalPrice");

    // var subtotal = sessionStorage.getItem("subtotal");

    // var occprice = sessionStorage.getItem("occprice");

    // sessionStorage.setItem("selectedOccasion", JSON.stringify(occasion)); // Save to localStorage

    // var total =
    //   parseFloat(totalPrice) +
    //   parseFloat(occasion.price) -
    //   parseFloat(occprice);

    // var subtotalaount = parseFloat(subtotal) + parseFloat(occasion.price) - parseFloat(occprice);

    // sessionStorage.setItem("subtotal", parseFloat(subtotalaount));

    // var CouponData = JSON.parse(sessionStorage.getItem("CouponData"));
    // if (CouponData) {
    //   if (CouponData.couponCodeType === "Percentage" && occprice === 0) {
    //     var discount = (subtotalaount * CouponData.couponAmount) / 100;
    //     sessionStorage.setItem("coupondis", discount);
    //     total = total - discount;
    //   }
    // }

    // sessionStorage.setItem("TotalPrice", parseFloat(total));

    // sessionStorage.setItem("occprice", occasion.price);

    setTimeout(() => {
      additionalImagesRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 200);
  };

  const handleSubmit = () => {

    sessionStorage.setItem("occasionName", selectedOccasion.name);

    sessionStorage.setItem("selectedOccasion", JSON.stringify(selectedOccasion)); // Save to localStorage

    sessionStorage.setItem(
      "subtotal",
      parseFloat(sessionStorage.getItem("subtotal")) +
      parseFloat(selectedOccasion?.price || 0) - parseFloat(sessionStorage.getItem("occprice"))
    );

    sessionStorage.setItem(
      "TotalPrice",
      parseFloat(sessionStorage.getItem("TotalPrice")) +
      parseFloat(selectedOccasion?.price || 0) - parseFloat(sessionStorage.getItem("occprice"))
    );

    sessionStorage.setItem("occprice", selectedOccasion.price);
    const dataArray = {
      occasionId: selectedOccasion._id,
      personName: textFieldValue,
      subTotal:
        parseFloat(sessionStorage.getItem("subtotal")) +
        parseFloat(selectedOccasion?.price || 0),
      totalPrice:
        parseFloat(sessionStorage.getItem("TotalPrice")) +
        parseFloat(selectedOccasion?.price || 0),
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
            navigate("/CakesComponent");
          } else if (res.status === 403) {
            toast.error(
              "Access Denied: You do not have permission to view this page."
            );
            navigate("/theaters");
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            console.log(error.response);
          }
        }
      );
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
            >
              <div className="container-fluid px-4">
                <button
                  type="button"
                  className="btn light-back shadow-lg text-light"
                  onClick={handleClick}
                >
                  {" "}
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>

                <div className="d-flex justify-content-center align-items-center flex-column text-center my-4">
                  <h2 className="dark-text">What’s the celebration?</h2>
                  <p className="light-text">Choose the occasion so we can set the perfect mood!</p>
                </div>


                <div className="container-fluid mt-4">
                  <div className="row mb-4">
                    {/* Occasions */}
                    {/* <div className="col-md-8 shadow-lg"> */}
                    <div className="col-md-8 lighter-back shadow-sm rounded">
                      <h3 className="mt-3">Select Occasion</h3>
                      <div className="row">
                        {Occation.map((ele, ind) => (
                          <div
                            className="col-6 col-md-3 mb-3  text-center"
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
                                    ? "#C69FF4"
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
                    <div className="col-lg-4 col-md-4 mt-4 mt-md-0">
                      <div className="position-sticky" style={{ top: "20px" }}>
                        <div className="lighter-back mb-3">
                          <div className="card-body mt-3">
                            <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded">
                              <div>Total:</div>
                              <div>
                                ₹
                                {parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("cakeprice") || 0) + parseFloat(sessionStorage.getItem("addons") || 0) + parseFloat(selectedOccasion?.price || 0) - parseFloat(sessionStorage.getItem("couponAmount") || 0)}
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
                                    }`}
                                  aria-labelledby="headingOne"
                                  data-bs-parent="#accordionExample"
                                >
                                  <div className="accordion-body">
                                    <div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>
                                          Theatre Price (
                                          {sessionStorage.getItem(
                                            "countPeople"
                                          )}{" "}
                                          ppl)
                                        </div>
                                        <div>
                                          ₹
                                          {sessionStorage.getItem(
                                            "theaterPrice"
                                          )}
                                        </div>
                                      </div>
                                      <hr />
                                      {/* <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Addons</div>
                                        <div>
                                          ₹{sessionStorage.getItem("addons")}
                                        </div>
                                      </div>
                                      <hr /> */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>
                                          Occasions (
                                          {sessionStorage.getItem(
                                            "occasionName"
                                          )}
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
                                        <div>Cake</div>
                                        <div>
                                          ₹
                                          {sessionStorage.getItem("cakeprice") ||
                                            0}
                                        </div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          marginBottom: "8px",
                                        }}
                                      >
                                        <div>Addons</div>
                                        <div>
                                          {sessionStorage.getItem("addons") ||
                                            0}
                                        </div>
                                      </div>

                                      {/* {addons.map((occasion, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          <div>{occasion.name}</div>
                                          <div>₹{occasion.price}</div>
                                        </div>
                                      ))} */}
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Sub Total</div>
                                        <div>
                                          ₹
                                          {parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("couponAmount") || 0) + parseFloat(sessionStorage.getItem("addons") || 0) + parseFloat(sessionStorage.getItem("cakeprice") || 0) + parseFloat(selectedOccasion?.price || 0) - parseFloat(sessionStorage.getItem("occprice") || 0)}
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
                                          ₹
                                          {parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("cakeprice") || 0) + parseFloat(sessionStorage.getItem("addons") || 0) + parseFloat(selectedOccasion?.price || 0) - parseFloat(sessionStorage.getItem("couponAmount") || 0)}

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
                          className="btn  w-100 mt-2 dark-back text-white"
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

export default Occassions;
