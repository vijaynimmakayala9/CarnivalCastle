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

const ComboPlans = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [isLoading, setIsLoading] = useState(false);
  const [include, setIncludes] = useState([]);
  const [showImages, setShowImages] = useState(null);
  const [cakesFlavour, setCakesFlavour] = useState(null);
  const [itemkey, setItemkey] = useState("");
  const [plans, setPlans] = useState([]);
  const [planProducts, setPlanProducts] = useState([]);
  const [cakes, setCakes] = useState([]);
  const [otherProducts, setotherProducts] = useState([]);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0); // For mobile indicators

  const [totalAmountOption, setTotalAmountOption] = useState({
    amountOption: "partialpayment",
  });

  const navigate = useNavigate();
  
  useEffect(() => {
    axios.post(URLS.GetAllTheaters, {}).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
      }
    });
    sessionStorage.setItem("paymentkey", "partialpayment");
  }, []);

  useEffect(() => {
    const getid = sessionStorage.getItem("theaterId");
    const occasiondata = sessionStorage.getItem("occasion");
    const datas = JSON.parse(occasiondata);

    if (datas && getid) {
      axios
        .post(URLS.GetOccationById, { occasionId: datas._id, theatreId: getid })
        .then((res) => {
          console.log(res.data);
          setPlans(res.data?.plans || []);
        });
    }
  }, []);

  const handleBack = () => {
    navigate("/ComboOccassions");
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

  const [advanceAmount, setAdvanceAmount] = useState(0);
  
  useEffect(() => {
    getOneGst();
  }, []);

  const getOneGst = async () => {
    try {
      const res = await axios.post(URLS.GetCharges, {});
      if (res.status === 200) {
        console.log(res.data.charges.comboAdvancePayment, "response");
        setAdvanceAmount(Number(res.data.charges.comboAdvancePayment));
        sessionStorage.setItem("comboAdvancePayment", res.data.charges.comboAdvancePayment);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle error
      }
    }
  };

  const [totalAmountOption1, setTotalAmountOption1] = useState("");

  const slecthandleChange = (e) => {
    const myChange = { ...totalAmountOption };
    myChange[e.target.name] = e.target.value;
    console.log(e.target.value);
    sessionStorage.setItem("paymentkey", e.target.value);
    setTotalAmountOption(myChange);
    if (e.target.value == "partialpayment") {
      const advanceamountkey =
        parseFloat(sessionStorage.getItem("TotalPrice")) -
        parseFloat(advanceAmount);
      setTotalAmountOption1(advanceamountkey);
      sessionStorage.setItem("TotalPrice2", advanceamountkey);
      sessionStorage.setItem("advancePayment", parseFloat(advanceAmount));
    } else {
      const advanceamountkey = parseFloat(sessionStorage.getItem("TotalPrice"));
      setTotalAmountOption1(advanceamountkey);
      sessionStorage.setItem("TotalPrice2", advanceamountkey);
    }
  };

  const remainingAmount =
    totalAmountOption === "fullpayment"
      ? 0
      : sessionStorage.getItem("TotalPrice") - advanceAmount;

  const totalAmount = Number(sessionStorage.getItem("TotalPrice"));
  const remainingAmountFixed = remainingAmount.toFixed(2);
  const totalAmountFixed = totalAmount.toFixed(2);
  const displayedAdvanceAmount =
    totalAmountOption === "fullpayment" ? 0 : advanceAmount;

  const [extrapersionschanges, setextrapersionschanges] = useState(0);
  const [extrapersionschanges1, setextrapersionschanges1] = useState(0);

  const nintymin = Number(sessionStorage.getItem("nintymin"));

  const [plansdata, setplansdata] = useState([]);
  const [theaterplanstate, settheaterplanstate] = useState(0);
  const [totalplanprice, settotalplanprice] = useState(0);
  const [subtotalplanprice, setsubtotalplanprice] = useState(0);

  const handleChoose = (item, index) => {
    setplansdata(item);
    if (showImages === index) {
      setShowImages(null);
    } else {
      setShowImages(index);
    }
    axios.post(URLS.GetByPlanIdProducts, { planId: item._id }).then((res) => {
      const selectedCaketype = res?.data?.planProducts.filter(
        (cake) => cake.categoryName === "cakes"
      );
      setPlanProducts(selectedCaketype[0]);
      setCakes(selectedCaketype);
      const selectedCaketype1 = res?.data?.planProducts.filter(
        (cake) => cake.categoryName !== "cakes"
      );
      setotherProducts(selectedCaketype1);
    });

    const theaterPrice = parseFloat(nintymin == 90 ? sessionStorage.getItem("theatrePrices") : sessionStorage.getItem("theatrePrices")) || 0;
    const theaterplanprice = (nintymin == 90 ? item.oneandhalfslotPrice : item.offerPrice);
    settheaterplanstate(theaterplanprice);
    sessionStorage.setItem("planpricesss", theaterplanprice);

    const extrapersions = sessionStorage.getItem("countPeople");
    if (Number(extrapersions) > item.noOfPersons) {
      const extrapersons = extrapersions - item.noOfPersons;
      setextrapersionschanges1(extrapersons);
      const extrapersonscharge = extrapersons * item.extraPersonPrice;
      setextrapersionschanges(extrapersonscharge);
      sessionStorage.setItem("planextrapersoncharge", extrapersonscharge);
      const totalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No"? theaterPrice:0)) - (parseFloat(sessionStorage.getItem("coupondis") || 0));
      const subtotalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No"? theaterPrice:0));
      settotalplanprice(totalallprice);
      setsubtotalplanprice(subtotalallprice);
      sessionStorage.setItem("totalallprice", totalallprice);
      sessionStorage.setItem("subtotalallprice", subtotalallprice);
    } else {
      const extrapersonscharge = 0;
      const totalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No"? theaterPrice:0)) - (parseFloat(sessionStorage.getItem("coupondis") || 0));
      const subtotalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No"? theaterPrice:0));
      settotalplanprice(totalallprice);
      setsubtotalplanprice(subtotalallprice);
      setextrapersionschanges1(0);
      setextrapersionschanges(extrapersonscharge);
      sessionStorage.setItem("planextrapersoncharge", extrapersonscharge);
      sessionStorage.setItem("totalallprice", totalallprice);
      sessionStorage.setItem("subtotalallprice", subtotalallprice);
    }
  };

  const handleFlavourChange = (e) => {
    const selectedId = e.target.value;
    const selectedCake = cakes.find((cake) => cake._id === selectedId);
    console.log(selectedCake);
    setPlanProducts(selectedCake || null);
  };

  const singleCake = (data) => {
    setPlanProducts(data);
    console.log(data);
  };

  const handleGoToBookingSummary = () => {
    navigate("/Theaters");
  };

  const handleSubmit = () => {
    const bodyData = {
      bookingId: sessionStorage.getItem("bookingid"),
      totalPrice: totalplanprice,
      planId: plansdata._id,
      flavour: planProducts?.name,
      productId: planProducts?._id,
    };

    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatecombo",
        bodyData
      )
      .then(
        (res) => {
          if (res.status === 200) {
            console.log(res.data);
            navigate("/ComboBooking");
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

  const advanceAmount1 =
    totalAmountOption.amountOption === "partialpayment"
      ? displayedAdvanceAmount
      : 0;
  const totalPrice1 = parseFloat(sessionStorage.getItem("TotalPrice")) || 0;
  const remainingAmount1 = totalPrice1 - advanceAmount1;

  // Handle mobile plan navigation
  const handlePrevPlan = () => {
    setCurrentPlanIndex((prev) => (prev > 0 ? prev - 1 : plans.length - 1));
  };

  const handleNextPlan = () => {
    setCurrentPlanIndex((prev) => (prev < plans.length - 1 ? prev + 1 : 0));
  };

  const goToSlide = (index) => {
    setCurrentPlanIndex(index);
  };

  return (
    <>
      {isLoading ? (
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
                  className="btn mb-2 light-back shadow-lg text-light"
                  onClick={handleBack}
                >
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>

                <div className="container mt-4">
                  <div className="row">
                    {plans.length === 0 ? (
                      <div className="col-md-12 shadow-lg p-4 text-center lighter-back">
                        <div className="text-center">
                          <h3>
                            There are no plans available for this theater.
                            Please choose another theater.
                          </h3>
                          <button
                            type="button"
                            className="btn mb-2 ms-2 light-back shadow-lg text-light"
                            style={{
                              boxShadow: "none",
                              color: "black",
                              border: "none",
                            }}
                            onClick={handleGoToBookingSummary}
                          >
                            Click Now
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="col-md-8 shadow-lg p-4 lighter-back">
                          {/* Desktop/Tablet View - 3 per row on lg, 2 per row on md */}
                          <div className="row d-none d-md-flex">
                            {plans.map((item, index) => (
                              <div key={index} className="col-lg-4 col-md-6 mb-4">
                                <div
                                  className="card bg-dark h-100"
                                  style={{
                                    color: "#fff",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleChoose(item, index)}
                                >
                                  <h2 className="fw-bold text-gold-gradient">
                                    {item.name}
                                  </h2>
                                  <p>({item.noOfPersons}) Members</p>
                                  <ul className="pt-4 opls flex-grow-1">
                                    {item?.benefits?.map((datas, is) => (
                                      <li className="pb-2" key={is}>
                                        <img
                                          draggable="false"
                                          role="img"
                                          className="emoji m-1"
                                          alt="🌟"
                                          style={{ height: "15px" }}
                                          src="https://s.w.org/images/core/emoji/15.0.3/svg/1f31f.svg"
                                        />
                                        {datas}
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="mt-auto">
                                    <p>
                                      <del className="text-center">
                                        <small>₹ </small>
                                        {item.price}
                                      </del>
                                    </p>
                                    <h3>
                                      <small> ₹</small>
                                      {nintymin == 90 ? item.oneandhalfslotPrice : item.offerPrice}/-
                                    </h3>
                                    <button
                                      className="btn btn-success w-100 mt-3 main-booknow"
                                      style={{
                                        boxShadow: "none",
                                        color: "black",
                                        border: "none",
                                      }}
                                      onClick={() => handleChoose(item, index)}
                                    >
                                      {showImages === index ? "Hide" : "Choose"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Mobile View - 1 per row with carousel indicators */}
                          <div className="d-md-none">
                            <div className="position-relative">
                              {/* Current Plan */}
                              <div className="mb-3">
                                <div
                                  className="card bg-dark"
                                  style={{
                                    color: "#fff",
                                    borderRadius: "10px",
                                    padding: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleChoose(plans[currentPlanIndex], currentPlanIndex)}
                                >
                                  <h2 className="fw-bold text-gold-gradient">
                                    {plans[currentPlanIndex]?.name}
                                  </h2>
                                  <p>({plans[currentPlanIndex]?.noOfPersons}) Members</p>
                                  <ul className="pt-4 opls">
                                    {plans[currentPlanIndex]?.benefits?.map((datas, is) => (
                                      <li className="pb-2" key={is}>
                                        <img
                                          draggable="false"
                                          role="img"
                                          className="emoji m-1"
                                          alt="🌟"
                                          style={{ height: "15px" }}
                                          src="https://s.w.org/images/core/emoji/15.0.3/svg/1f31f.svg"
                                        />
                                        {datas}
                                      </li>
                                    ))}
                                  </ul>
                                  <p>
                                    <del className="text-center">
                                      <small>₹ </small>
                                      {plans[currentPlanIndex]?.price}
                                    </del>
                                  </p>
                                  <h3>
                                    <small> ₹</small>
                                    {nintymin == 90 ? plans[currentPlanIndex]?.oneandhalfslotPrice : plans[currentPlanIndex]?.offerPrice}/-
                                  </h3>
                                  <button
                                    className="btn btn-success w-100 mt-3 main-booknow"
                                    style={{
                                      boxShadow: "none",
                                      color: "black",
                                      border: "none",
                                    }}
                                    onClick={() => handleChoose(plans[currentPlanIndex], currentPlanIndex)}
                                  >
                                    {showImages === currentPlanIndex ? "Hide" : "Choose"}
                                  </button>
                                </div>
                              </div>

                              {/* Navigation Arrows */}
                              {plans.length > 1 && (
                                <>
                                  <button
                                    className="btn btn-dark position-absolute"
                                    style={{
                                      left: "10px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      zIndex: 10,
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                    }}
                                    onClick={handlePrevPlan}
                                  >
                                    <i className="bi bi-chevron-left"></i>
                                  </button>
                                  <button
                                    className="btn btn-dark position-absolute"
                                    style={{
                                      right: "10px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      zIndex: 10,
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                    }}
                                    onClick={handleNextPlan}
                                  >
                                    <i className="bi bi-chevron-right"></i>
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Indicators */}
                            {plans.length > 1 && (
                              <div className="text-center mb-4">
                                <div className="d-inline-flex gap-2">
                                  {plans.map((_, index) => (
                                    <button
                                      key={index}
                                      className={`btn btn-sm ${
                                        currentPlanIndex === index 
                                          ? 'btn-primary' 
                                          : 'btn-outline-secondary'
                                      }`}
                                      style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        padding: "0",
                                        minWidth: "12px",
                                      }}
                                      onClick={() => goToSlide(index)}
                                    ></button>
                                  ))}
                                </div>
                                <div className="mt-2">
                                  <small className="text-muted">
                                    {currentPlanIndex + 1} of {plans.length} plans
                                  </small>
                                </div>
                              </div>
                            )}
                            <div className="row d-flex">
                              {Object.keys(plansdata).length > 0 ? (
                                <div
                                  className="col-md-4 col-sm-6 mb-4 d-flex flex-column"
                                  style={{ cursor: "pointer" }}
                                >
                                  {/* Card */}
                                  <div
                                    className="card flex-fill"
                                    style={{
                                      border: "none",
                                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    }}
                                  >
                                    <div style={{ position: "relative" }}>
                                      {/* Conditionally render the badge if the cake is eggless */}
                                      {planProducts.cakeType === "eggless" && (
                                        <span
                                          className="badge bg-success"
                                          style={{
                                            position: "absolute",
                                            top: "10px",
                                            left: "10px",
                                            zIndex: "1",
                                          }}
                                        >
                                          Eggless
                                        </span>
                                      )}
                                      <img
                                        src={URLS.Base + planProducts.image}
                                        className="card-img-top"
                                        alt="Combo Image"
                                        style={{
                                          height: "200px",
                                          width: "100%",
                                          objectFit: "cover",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      />
                                    </div>

                                    <div className="card-body bg-dark text-white gradient-border">
                                      {/* Cake name and egg/eggless images in one row */}
                                      <div className="d-flex justify-content-between align-items-center">
                                        <h5
                                          className="card-title"
                                          style={{
                                            fontSize: "15px",
                                            margin: "0",
                                          }}
                                        >
                                          {planProducts.name}
                                        </h5>

                                        {/* Conditionally render the base64 image for egg or eggless cake */}
                                        {planProducts.cakeType === "egg" ? (
                                          <img
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABW0lEQVR4nN2VP0sDQRDF01gIgoWFYGGhCBaCxRWGS/LeXXKFihK/kljoF/FT+LcRLFIIFoKgaDTZPRUVEy0sjOSYO84YzWruQBzYZvYxP+bNsJvJ/JvwyXkNXGmy9dujyDcNVHzXnfwE0GS1n+L6I2izGyC47MuFQsEWwEEqAOU4c0Ed4DAVQN11LQFUfgTQjlPWwJ4GmsEhdxW51KnzXXc2sAg4MgZocuPLYQJrca0iZ6SDYyOAJld6bUwdWAz1NXJaACdmAGC/50oC26H+BpiSLTo17eDZAPAY6fP5Ccmfm3bQNAA8RBblcuOSv0zSoq1Qf2vbY2JRzQzgOGWDIS9E+mJxVPK+EUC6WP/mzVmNa69LpRHZojtjQDsUsKzJHQU0FPnU3pz4eoZx73nDnYNP9rEjhwTQSAVQzWYHpc5LKoCWZQ3IbF7T/nDOun+ZSUCAC016/Tjxt+IdjFUzfH0mcf4AAAAASUVORK5CYII="
                                            alt="Egg Cake"
                                            style={{
                                              width: "20px",
                                              marginLeft: "10px",
                                            }}
                                          />
                                        ) : planProducts.cakeType ===
                                          "eggless" ? (
                                          <img
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVR4nGNgGDZAdH6Fh9iCisfiCyv+k40XVPwTW1hxRnRBiTKGBWILyx9RZPhCFIuWYlgAk6QoFBaVWUEtOEoTC8QXVZiDzBBbUH6CJhZILqgwBluwsOIMSRaILSz3F1tYsV9sQcUXMF5Yvk98YYUPujrRReX60CC6QLQFYgsrOvBEaDOKGYsqdaBBdJkoC8QWVQYQSjESCyu84EE0v1IDEkTl14mzYEH5AcLJsnwPTL3IvFJVqPgt4ixYWP6ViHT/Aa5+boUSNIjuEemDii9E+OA9PIgWlstBLKh4SL0gWlCxG6ZeeE6pFFT8KbFB5E8wkheUecLVL6sUh/rgJVEWQIOpHY/rG5HVSi2sEIbGwRuiLQAB8UXlvmILKvaKLyj/LL6w4hMo5SAnTxgQnFnOjx7x1C3sVtXzQHxW/pkmFsisKuSExsE3mljAMDONFWrOL9pWOAsr7mKvMqlgidiC8gdiCytcKAqJQQUAHGz+5dhaYC0AAAAASUVORK5CYII="
                                            alt="Eggless Cake"
                                            style={{
                                              width: "20px",
                                              marginLeft: "10px",
                                            }}
                                          />
                                        ) : null}
                                      </div>
                                    </div>
                                    {planProducts.categoryName === "cakes" ? (
                                      <select
                                        className="form-select"
                                        aria-label="Cake size selection"
                                        value={cakesFlavour?._id || ""}
                                        name="flavour"
                                        required
                                        onChange={handleFlavourChange}
                                        style={{ marginTop: "0px" }}
                                      >
                                        <option value="">Select Flavour</option>
                                        {cakes.map((flavour, index) => (
                                          <option
                                            key={index}
                                            value={flavour._id}
                                          >
                                            {flavour.name}
                                          </option>
                                        ))}
                                      </select>
                                    ) : null}
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>

                            <div className="row d-flex">
                              {Object.keys(plansdata).length > 0 ? (
                                <>
                                  {otherProducts.map((data, index) => (
                                    <div
                                      key={index}
                                      // className="col-md-4 col-sm-6 mb-4 d-flex flex-column"
                                      className="col-6 col-sm-4 col-md-4 mb-4 d-flex flex-column"
                                      style={{ cursor: "pointer" }}
                                    >
                                      {/* Card */}
                                      <div
                                        className="card flex-fill"
                                        style={{
                                          border: "none",
                                          boxShadow:
                                            "0 4px 8px rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        <div>
                                          <img
                                            src={URLS.Base + data.image}
                                            className="card-img-top"
                                            alt="Combo Image"
                                            style={{
                                              height: "120px",
                                              width: "100%",
                                              objectFit: "cover",
                                              borderBottom: "1px solid #ddd",
                                            }}
                                          />
                                        </div>

                                        <div className="card-body bg-dark text-white gradient-border">
                                          <div className="d-flex justify-content-between align-items-center">
                                            <h6
                                              className=""
                                              style={{
                                                fontSize: "12px",
                                                margin: "0",
                                              }}
                                            >
                                              {data.name}
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>

                        {Object.keys(plansdata).length > 0 && (
                          <div className="col-lg-4 col-md-5 mt-3">
                            <div
                              className="position-sticky"
                              style={{ top: "20px" }}
                            >
                              <div className="bg-light-grey mb-3">
                                <div className="card-body mt-3">
                                  <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded gradient-border">
                                    <div>Total:</div>
                                    <div>
                                      ₹ 
                                      {totalplanprice.toFixed(2)}
                                      {/* {parseFloat(
                                        sessionStorage.getItem("TotalPrice")
                                      ).toFixed(2)} */}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="shadow-lg">
                                <div className="card-body">
                                  <div
                                    className="accordion"
                                    id="accordionExample"
                                  >
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
                                          aria-expanded={
                                            isOpen ? "true" : "false"
                                          }
                                          aria-controls="collapseOne"
                                          onClick={() => setIsOpen(!isOpen)} // Toggle state on click
                                        >
                                          Summary Details
                                        </button>
                                      </h2>
                                      <div
                                        id="collapseOne"
                                        className={`accordion-collapse collapse ${
                                          isOpen ? "show" : ""
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
                                              <div>Plan Price</div>
                                              <div>
                                                ₹ {theaterplanstate}
                                                {/* {sessionStorage.getItem(
                                                  "cakeprice"
                                                )} */}
                                              </div>
                                            </div>
                                            <hr />
                                           
                                            {/* theatrePriceIncluded  yes or no*/}

                                            {plansdata.theatrePriceIncluded ===
                                              "No" && (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <div>Theater Price</div>
                                                <div>
                                                  ₹ 
                                                  {sessionStorage.getItem(
                                                    "theatrePrices"
                                                  )}
                                                </div>
                                              </div>
                                            )}

                                            {plansdata.theatrePriceIncluded ===
                                              "No" && <hr />}

                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                              }}
                                            >
                                              <div>
                                                {" "}
                                                Extra Person Price(
                                                {extrapersionschanges1})
                                              </div>
                                              <div>₹ 
                                                {/* {extrapersionpiceplan} */}
                                                {extrapersionschanges}
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
                                                ₹  {subtotalplanprice.toFixed(2)}
                                                {/* {sessionStorage.getItem(
                                                  "subtotal"
                                                )} */}
                                                {/* {sessionStorage.getItem(
                                                  "cakeprice"
                                                )} */}
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
                                                  sessionStorage.getItem(
                                                    "coupondis"
                                                  )
                                                ).toFixed(2) || 0}
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
                                              {/* <div>
                                                {totalAmountOption !==
                                                "fullpayment"
                                                  ? remainingAmountFixed
                                                  : totalAmountFixed}
                                              </div> */}
                                              {/* {totalAmountOption.amountOption ===
                                              "partialpayment" ? (
                                                <div>
                                               
                                                  {totalAmountOption1}
                                                </div>
                                              ) : (
                                                sessionStorage.getItem(
                                                  "TotalPrice"
                                                )
                                              )} */}
                                          <div>
                                                        ₹   {totalplanprice.toFixed(2)}
                                                        </div>
                                              {/* {sessionStorage.getItem(
                                                "TotalPrice"
                                              )} */}
                                            </div>
                                            <hr />
                                            {/* <div className="row mb-3">
                                              <div className="col">
                                                <div className="form-check mt-2">
                                                  <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="amountOption"
                                                    id="partialpaymentOption"
                                                    value="partialpayment"
                                                    checked={
                                                      totalAmountOption.amountOption ===
                                                      "partialpayment"
                                                    }
                                                    onChange={(e) =>
                                                      slecthandleChange(e)
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="partialpaymentOption"
                                                  >
                                                    <small>
                                                      Advance Amount
                                                    </small>
                                                  </label>
                                                </div>
                                              </div>
                                              <div className="col pt-0">
                                                <div className="form-check mt-2">
                                                  <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="amountOption"
                                                    id="fullpaymentOption"
                                                    value="fullpayment"
                                                    checked={
                                                      totalAmountOption.amountOption ===
                                                      "fullpayment"
                                                    }
                                                    onChange={(e) =>
                                                      slecthandleChange(e)
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor="fullpaymentOption"
                                                  >
                                                    <small>Full Amount</small>
                                                  </label>
                                                </div>
                                              </div>
                                            </div> */}

                                            {totalAmountOption.amountOption ===
                                              "partialpayment" && (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <div>Advance Amount</div>
                                                <div>
                                                  ₹ {displayedAdvanceAmount} /-
                                                </div>
                                              </div>
                                            )}

                                            <hr />
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                              }}
                                            >
                                              <div>Remaining Amount</div>
                                              <div>
                                                {(parseFloat(totalplanprice) - parseFloat(displayedAdvanceAmount)).toFixed(2)}
                                              </div>
                                              {/* {totalAmountOption.amountOption ===
                                              "partialpayment" ? (
                                                <div>₹{remainingAmount1}/-</div>
                                              ) : (
                                                <div>₹{totalPrice1}/-</div>
                                              )} */}
                                            </div>

                                            {/* {totalAmountOption ===
                                              "partialpayment" && (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <div>Advance Amount</div>
                                                <div>
                                                  - ₹ {displayedAdvanceAmount}{" "}
                                                  /-
                                                </div>
                                              </div>
                                            )} */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleSubmit}
                                className="btn btn-success w-100 mt-2 main-booknow"
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
                        )}
                      </>
                    )}
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

export default ComboPlans;
