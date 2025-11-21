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
      const totalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No" ? theaterPrice : 0)) - (parseFloat(sessionStorage.getItem("coupondis") || 0));
      const subtotalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No" ? theaterPrice : 0));
      settotalplanprice(totalallprice);
      setsubtotalplanprice(subtotalallprice);
      sessionStorage.setItem("totalallprice", totalallprice);
      sessionStorage.setItem("subtotalallprice", subtotalallprice);
    } else {
      const extrapersonscharge = 0;
      const totalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No" ? theaterPrice : 0)) - (parseFloat(sessionStorage.getItem("coupondis") || 0));
      const subtotalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No" ? theaterPrice : 0));
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
    setPlanProducts(selectedCake || null);
  };

  const singleCake = (data) => {
    setPlanProducts(data);
  };

  const handleGoToBookingSummary = () => {
    const theater = JSON.parse(sessionStorage.getItem("selectedAddress"));
    navigate(`/Theaters/${theater.name.toLowerCase().replace(/\s+/g, '-')}`);
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
            navigate("/ComboBooking");
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
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
            <section className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix">
              <div className="container"></div>
            </section>
            <section className="shop-area pt-5 pb-5 p-relative lightest-back" style={{ background: "white" }}>
              <div className="container-fluid px-4">
                <button type="button" className="btn mb-2 light-back shadow-lg text-light" onClick={handleBack}>
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>

                <div className="container-fluid mt-4">
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
                        {/* PLANS SECTION */}
                        <div className="col-12 shadow-lg p-4 lighter-back">
                          <h2 className="mb-4 text-center dark-text">Select Package Type</h2>
                          <p className="text-center mb-5"><i>Choose Your Celebration Package</i></p>
                          <div className="row justify-content-center">
                            {plans.map((item, index) => (
                              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
                                <div
                                  className={`card rounded-5 ${showImages === index ? "gradient45" : "gradientdark"} h-100 plan-card ${showImages === index ? "selected-plan" : ""}`}
                                  onClick={() => {                                    
                                    document.getElementById("cakes")?.scrollIntoView({ behavior: "smooth" });
                                    handleChoose(item, index);
                                  }}

                                >
                                  <div className="card-body d-flex flex-column text-center">
                                    {/* Plan Name */}
                                    <h2 className="fw-bold">{item.name}</h2>
                                    <p>({item.noOfPersons}) Members</p>

                                    {/* Prices */}
                                    <div>
                                      <p className="mb-1">
                                        <del>
                                          ₹{item.price}
                                        </del>
                                        <span style={{ color: "green", marginLeft: "5px", fontWeight: "500" }}>
                                          ₹{item.price - item.offerPrice} Off
                                        </span>
                                      </p>
                                      <h3 className="fw-bold">
                                        ₹{nintymin === 90 ? item.oneandhalfslotPrice : item.offerPrice}
                                      </h3>
                                      <small className="text-muted">All-Inclusive package</small>
                                    </div>

                                    {/* Button */}
                                    <button
                                      className={`btn text-white ${showImages === index ? "dark-back" : "light-back"} mt-3`}
                                      style={{
                                        border: "none",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {showImages === index ? "Continue with Add-Ons →" : "Select"}
                                    </button>

                                    {/* Descriptions */}
                                    <p className="mt-3" style={{ fontSize: "0.9rem" }}>
                                      Perfect for small birthday parties with essential entertainment and basic decorations.
                                    </p>
                                    <p style={{ fontSize: "0.85rem" }}>
                                      <span className="fw-bold">Pros & Cons:</span> Great value for intimate celebrations.
                                      Limited customisation options but covers all party essentials.
                                    </p>

                                    {/* Features */}
                                    <h6 className="fw-bold mt-3">What's Included</h6>
                                    <ul className="list-unstyled text-start mx-auto" style={{ maxWidth: "250px" }}>
                                      {item?.benefits?.map((datas, is) => (
                                        <li key={is} className="d-flex align-items-center mb-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" viewBox="0 0 16 16" style={{ marginRight: "8px" }}>
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0z" />
                                            <path fill="#fff" d="M6.173 10.927a.5.5 0 0 1-.707 0l-2.146-2.147a.5.5 0 1 1 .707-.707L6.5 9.793l5.146-5.147a.5.5 0 0 1 .707.708l-5.854 5.854z" />
                                          </svg>
                                          <span>{datas}</span>
                                        </li>
                                      ))}

                                      {/* Example unavailable feature */}
                                      {item?.notIncluded?.map((datas, is) => (
                                        <li key={is} className="d-flex align-items-center mb-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" viewBox="0 0 16 16" style={{ marginRight: "8px" }}>
                                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.646 4.646a.5.5 0 0 1 .708.708L8.707 9l3.647 3.646a.5.5 0 0 1-.708.708L8 9.707l-3.646 3.647a.5.5 0 0 1-.708-.708L7.293 9 3.646 5.354a.5.5 0 1 1 .708-.708L8 8.293l3.646-3.647z" />
                                          </svg>
                                          <span>{datas}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                </div>
                              </div>
                            ))}
                          </div>

                          {/* SUMMARY AND PRODUCTS SECTION */}
                          {Object.keys(plansdata).length > 0 && (
                            <div className="row mt-4" id="cakes">


                              {/* CAKES AND ADD-ONS SECTION - FULL WIDTH ON MOBILE, 8 COLUMNS ON DESKTOP */}
                              <div className="col-lg-8 col-md-12">
                                {/* CAKES SECTION */}
                                <div className="mb-5">
                                  <h3 className="mb-4 text-center">Select Your Cake</h3>
                                  <div className="row justify-content-center">
                                    <div className="col-md-8">
                                      <div className="card">
                                        <div style={{ position: "relative" }}>
                                          {planProducts.cakeType === "eggless" ? (
                                            <span className="badge bg-success" style={{ position: "absolute", top: "10px", left: "10px", zIndex: "1" }}>
                                              Eggless
                                            </span>
                                          ) : (
                                            <span className="badge bg-danger" style={{ position: "absolute", top: "10px", left: "10px", zIndex: "1" }}>
                                              Egg
                                            </span>
                                          )}
                                          <img
                                            src={URLS.Base + planProducts.image}
                                            className="card-img-top"
                                            alt="Cake"
                                            style={{
                                              height: "250px",
                                              width: "100%",
                                              objectFit: "cover",
                                              borderBottom: "1px solid #ddd",
                                            }}
                                          />
                                        </div>
                                        <div className="card-body gradientleft text-black gradient-border">
                                          <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="card-title" style={{ fontSize: "18px", margin: "0" }}>
                                              {planProducts.name}
                                            </h5>
                                            {planProducts.cakeType === "egg" ? (
                                              // Egg Icon
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="red"
                                                viewBox="0 0 16 16"
                                              >
                                                <path d="M8 15c3.866 0 7-3.134 7-7 0-3.071-2.104-7-7-7s-7 3.929-7 7c0 3.866 3.134 7 7 7z" />
                                              </svg>
                                            ) : planProducts.cakeType === "eggless" ? (
                                              // Leaf Icon
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="green"
                                                viewBox="0 0 16 16"
                                              >
                                                <path d="M8 0C4 0 1 4 1 8s3 8 7 8 7-4 7-8-3-8-7-8zm0 14.5A6.5 6.5 0 1 1 8 1.5a6.5 6.5 0 0 1 0 13z" />
                                                <path d="M6 8c0-1 1-3 2-3s2 2 2 3-1 3-2 3-2-2-2-3z" />
                                              </svg>
                                            ) : null}

                                          </div>
                                          {planProducts.categoryName === "cakes" && (
                                            <select
                                              className="form-select mt-3"
                                              aria-label="Cake flavor selection"
                                              value={cakesFlavour?._id || ""}
                                              name="flavour"
                                              required
                                              onChange={handleFlavourChange}
                                            >
                                              <option value="">Select Flavor</option>
                                              {cakes.map((flavour, index) => (
                                                <option key={index} value={flavour._id}>
                                                  {flavour.name}
                                                </option>
                                              ))}
                                            </select>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* ADD-ONS SECTION */}
                                <div>
                                  <h3 className="mb-4 text-center">Add-ons Included</h3>
                                  <div className="row justify-content-center">
                                    {otherProducts.map((data, index) => (
                                      <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-4" key={index}>
                                        <div className="card h-100 addon-card">
                                          <img
                                            src={URLS.Base + data.image}
                                            className="card-img-top"
                                            alt="Add-on"
                                            style={{
                                              height: "120px",
                                              width: "100%",
                                              objectFit: "cover",
                                              borderBottom: "1px solid #ddd",
                                            }}
                                          />
                                          <div className="card-body lightdark-back dark-text text-center">
                                            <h6 style={{ fontSize: "14px", margin: "0" }}>
                                              {data.name}
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* SUMMARY SECTION - FULL WIDTH ON MOBILE, 4 COLUMNS ON DESKTOP */}
                              <div className="col-lg-4 col-md-12 mb-4">
                                <div className="position-sticky" style={{ top: "20px" }}>
                                  <div className="bg-white mb-3 rounded">
                                    <div className="card-body mt-3">
                                      <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded">
                                        <div>Total:</div>
                                        <div>
                                          ₹
                                          {totalplanprice.toFixed(2)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="shadow-lg rounded">
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
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                  <div>Plan Price</div>
                                                  <div>₹ {theaterplanstate}</div>
                                                </div>
                                                <hr />

                                                {plansdata.theatrePriceIncluded === "No" && (
                                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div>Theater Price</div>
                                                    <div>₹ {sessionStorage.getItem("theatrePrices")}</div>
                                                  </div>
                                                )}

                                                {plansdata.theatrePriceIncluded === "No" && <hr />}

                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                  <div>Extra Person Price({extrapersionschanges1})</div>
                                                  <div>₹ {extrapersionschanges}</div>
                                                </div>
                                                <hr />
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                  <div>Sub Total</div>
                                                  <div>₹ {subtotalplanprice.toFixed(2)}</div>
                                                </div>
                                                <hr />
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                  <div>Coupon Amount</div>
                                                  <div>₹ {parseFloat(sessionStorage.getItem("coupondis")).toFixed(2) || 0}</div>
                                                </div>

                                                <hr />
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                  <div>Total Amount</div>
                                                  <div>₹ {totalplanprice.toFixed(2)}</div>
                                                </div>
                                                <hr />

                                                {totalAmountOption.amountOption === "partialpayment" && (
                                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div>Advance Amount</div>
                                                    <div>₹ {displayedAdvanceAmount} /-</div>
                                                  </div>
                                                )}

                                                <hr />
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                  <div>Remaining Amount</div>
                                                  <div>{(parseFloat(totalplanprice) - parseFloat(displayedAdvanceAmount)).toFixed(2)}</div>
                                                </div>
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
                                    className="btn w-100 mt-2 dark-back text-white"
                                    style={{
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
                          )}
                        </div>
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