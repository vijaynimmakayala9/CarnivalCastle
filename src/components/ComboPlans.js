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
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768); // Open on desktop by default
  const [isLoading, setIsLoading] = useState(false);
  const [include, setIncludes] = useState([]);
  const [showImages, setShowImages] = useState(null);
  console.log(showImages);
  const [cakesFlavour, setCakesFlavour] = useState(null);
  console.log(cakesFlavour);
  const [itemkey, setItemkey] = useState("");
  const [plans, setPlans] = useState([]);
  console.log(plans);
  const [planProducts, setPlanProducts] = useState([]);
  console.log(planProducts);
  const [cakes, setCakes] = useState([]); // egg and eglees
  const [otherProducts, setotherProducts] = useState([]); // other PLAN PRODUCTS
  console.log(otherProducts);

  const [totalAmountOption, setTotalAmountOption] = useState({
    amountOption: "partialpayment", // Set this to "partialpayment" by default
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
    // Update the state based on the window width when the component mounts
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768); // Open if width is greater than 768px
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [advanceAmount, setAdvanceAmount] = useState(0);
  console.log(advanceAmount);
  useEffect(() => {
    getOneGst();
  }, []);

  const getOneGst = async () => {
    try {
      const res = await axios.post(URLS.GetCharges, {});
      if (res.status === 200) {
        console.log(res.data.charges.comboAdvancePayment, "response");
        setAdvanceAmount(Number(res.data.charges.comboAdvancePayment));
        sessionStorage.setItem("comboAdvancePayment", res.data.charges.comboAdvancePayment
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // setGst(0);
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

  // Conditional total amount calculation
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
  console.log(plansdata);

  const [theaterplanstate, settheaterplanstate] = useState(0)
  const [totalplanprice, settotalplanprice] = useState(0)
  const [subtotalplanprice, setsubtotalplanprice] = useState(0)

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
    const theaterplanprice = (nintymin == 90 ? item.oneandhalfslotPrice : item.offerPrice)
    settheaterplanstate(theaterplanprice)
    sessionStorage.setItem("planpricesss", theaterplanprice)

    const extrapersions = sessionStorage.getItem("countPeople");
    if (Number(extrapersions) > item.noOfPersons) {
      const extrapersons = extrapersions - item.noOfPersons;
      setextrapersionschanges1(extrapersons);
      const extrapersonscharge = extrapersons * item.extraPersonPrice;
      setextrapersionschanges(extrapersonscharge);
      sessionStorage.setItem("planextrapersoncharge", extrapersonscharge)
      const totalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No" ? theaterPrice : 0)) - (parseFloat(sessionStorage.getItem("coupondis") || 0))
      const subtotalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No" ? theaterPrice : 0))
      settotalplanprice(totalallprice)
      setsubtotalplanprice(subtotalallprice)
      sessionStorage.setItem("totalallprice", totalallprice)
      sessionStorage.setItem("subtotalallprice", subtotalallprice)
    } else {
      const extrapersonscharge = 0;
      const totalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No" ? theaterPrice : 0)) - (parseFloat(sessionStorage.getItem("coupondis") || 0))
      const subtotalallprice = parseFloat(theaterplanprice) + parseFloat(extrapersonscharge) + parseFloat((item.theatrePriceIncluded === "No" ? theaterPrice : 0))
      settotalplanprice(totalallprice)
      setsubtotalplanprice(subtotalallprice)
      setextrapersionschanges1(0);
      setextrapersionschanges(extrapersonscharge);
      sessionStorage.setItem("planextrapersoncharge", extrapersonscharge)
      sessionStorage.setItem("totalallprice", totalallprice)
      sessionStorage.setItem("subtotalallprice", subtotalallprice)
    }
  }

  const handleFlavourChange = (e) => {
    const selectedId = e.target.value;
    const selectedCake = cakes.find((cake) => cake._id === selectedId);
    console.log(selectedCake);
    setPlanProducts(selectedCake || null); // Handle case where no cake is selected
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
              <div className="container">
                <button type="button" className="btn mb-2 light-back shadow-lg text-light" onClick={handleBack}>
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>

                <div className="container mt-4">
                  <div className="row">
                    {plans.length === 0 ? (
                      <div className="col-md-12 shadow-lg p-4 text-center lighter-back">
                        {/* Keep your no-plans message the same */}
                      </div>
                    ) : (
                      <>
                        {/* PLANS SECTION */}
                        <div className="col-12 shadow-lg p-4 lighter-back">
                          <h3 className="mb-4 text-center">Choose Your Plan</h3>
                          <div className="row justify-content-center">
                            {plans.map((item, index) => (
                              <div className="col-xl-3 col-lg-6 col-md-6 mb-4" key={index}>
                                <div
                                  className="card bg-dark h-100 plan-card"
                                  onClick={() => handleChoose(item, index)}
                                >
                                  <div className="card-body">
                                    <h2 className="fw-bold text-gold-gradient text-center">{item.name}</h2>
                                    <p className="text-center">({item.noOfPersons}) Members</p>
                                    <ul className="pt-3 opls">
                                      {item?.benefits?.map((datas, is) => (
                                        <li className="pb-2" key={is}>
                                          <img
                                            draggable="false"
                                            className="emoji m-1"
                                            alt="🌟"
                                            style={{ height: "15px" }}
                                            src="https://s.w.org/images/core/emoji/15.0.3/svg/1f31f.svg"
                                          />
                                          {datas}
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="text-center mt-auto">
                                      <p className="mb-1">
                                        <del className="text-center">
                                          <small>₹ </small>
                                          {item.price}
                                        </del>
                                      </p>
                                      <h3 className="mb-3">
                                        <small> ₹</small>
                                        {nintymin == 90 ? item.oneandhalfslotPrice : item.offerPrice}/-
                                      </h3>
                                      <button
                                        className="btn btn-success main-booknow"
                                        style={{
                                          boxShadow: "none",
                                          color: "black",
                                          border: "none",
                                        }}
                                      >
                                        {showImages === index ? "Hide" : "Choose"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="text-center">
                            <div>
                              {Object.keys(plansdata).length > 0 && (
                                <div className="col-6 mt-md-3">
                                  <div className="position-sticky" style={{ top: "20px" }}>
                                    <div className="bg-light-grey mb-3">
                                      <div className="card-body mt-3">
                                        <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded gradient-border">
                                          <div>Total:</div>
                                          <div>
                                            ₹
                                            {totalplanprice.toFixed(2)}
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
                                      className="btn btn-success w-100 mt-2 main-booknow"
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
                              )}

                              {/* CAKES SECTION (only shows when a plan is selected) */}
                              {Object.keys(plansdata).length > 0 && (
                                <>
                                  <div className="mt-5">
                                    <h3 className="mb-4 text-center">Select Your Cake</h3>
                                    <div className="row justify-content-center">
                                      <div className="col-md-8">
                                        <div className="card">
                                          <div style={{ position: "relative" }}>
                                            {planProducts.cakeType === "eggless" && (
                                              <span className="badge bg-success" style={{ position: "absolute", top: "10px", left: "10px", zIndex: "1" }}>
                                                Eggless
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
                                          <div className="card-body bg-dark text-white gradient-border">
                                            <div className="d-flex justify-content-between align-items-center">
                                              <h5 className="card-title" style={{ fontSize: "18px", margin: "0" }}>
                                                {planProducts.name}
                                              </h5>
                                              {planProducts.cakeType === "egg" ? (
                                                <img
                                                  src="data:image/png;base64,..." // keep your egg icon
                                                  alt="Egg Cake"
                                                  style={{ width: "24px" }}
                                                />
                                              ) : planProducts.cakeType === "eggless" ? (
                                                <img
                                                  src="data:image/png;base64,..." // keep your eggless icon
                                                  alt="Eggless Cake"
                                                  style={{ width: "24px" }}
                                                />
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
                                  <div className="mt-5">
                                    <h3 className="mb-4 text-center">Add-ons Included</h3>
                                    <div className="row justify-content-center">
                                      {otherProducts.map((data, index) => (
                                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
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
                                            <div className="card-body bg-dark text-white gradient-border text-center">
                                              <h6 style={{ fontSize: "14px", margin: "0" }}>
                                                {data.name}
                                              </h6>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
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