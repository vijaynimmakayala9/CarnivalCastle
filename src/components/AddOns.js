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

var IDSvar = sessionStorage.getItem("IDSvar")
  ? JSON.parse(sessionStorage.getItem("IDSvar"))
  : [];

const AddOns = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [isLoading, setIsLoading] = useState(false);
  const [addOns, setAddOns] = useState([]);
  const [IDS, setIDS] = useState([]);
  
  // GST is always ON
  const [gstPercentage, setGstPercentage] = useState(18);
  
  // Payment states - sirf advance payment, hamesha online
  const [advanceAmount, setAdvanceAmount] = useState(0);
  
  const [selectedOccasions, setSelectedOccasions] = useState(
    JSON.parse(sessionStorage.getItem("addonsData")) || []
  );
  
  const navigate = useNavigate();

  // Get all stored values
  const theaterPrice = parseFloat(sessionStorage.getItem("theaterPrice")) || 0;
  const cakePrice = parseFloat(sessionStorage.getItem("cakeprice")) || 0;
  const occasionPrice = parseFloat(sessionStorage.getItem("occprice")) || 0;
  const couponDiscount = parseFloat(sessionStorage.getItem("couponAmount")) || 0;
  
  // Calculate addons total
  const addonsTotal = selectedOccasions.reduce(
    (total, item) => total + item.price,
    0
  );
  
  // Base subtotal (before any discounts)
  const baseSubtotal = theaterPrice + cakePrice + occasionPrice + addonsTotal;
  
  // Apply coupon discount first
  const subtotalAfterCoupon = baseSubtotal - couponDiscount;
  
  // GST calculation on subtotal after coupon
  const gstAmount = (subtotalAfterCoupon * gstPercentage) / 100;
  
  // CGST and SGST (half each)
  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;
  
  // Final total with GST
  const finalTotal = subtotalAfterCoupon + gstAmount;
  
  // Display total
  const displayTotal = finalTotal;
  
  // Sirf advance payment - remaining amount hamesha calculate hoga
  const remainingAmount = displayTotal - advanceAmount;

  useEffect(() => {
    // Set payment type to online hamesha
    sessionStorage.setItem("payType", "online");
    
    GetTheatersData();
    GetAddOns();
    getGstPercentage();
    
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/bookings/getallbookings",
        { bookingId: sessionStorage.getItem("bookingid") }
      )
      .then((res) => {
        console.log(res);
        setIDS(res?.data?.booking?.addons || []);
        
        const sum = res?.data?.booking?.addons?.reduce(
          (total, obj) => total + Number(obj.price),
          0
        );
        
        sessionStorage.setItem("paymentkey", "partialpayment");
      });
  }, []);

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
      }
    });
  };

  const getGstPercentage = async () => {
    try {
      const res = await axios.post(URLS.GetCharges, {});
      if (res.status === 200) {
        console.log(res.data.charges, "response");
        setGstPercentage(Number(res.data.charges.bookingGst) || 18);
        setAdvanceAmount(Number(res.data.charges.advancePayment));
        sessionStorage.setItem(
          "advancePayment",
          res.data.charges.advancePayment
        );
        sessionStorage.setItem("gstPercentage", res.data.charges.bookingGst || 18);
      }
    } catch (error) {
      console.error("Error fetching GST:", error);
    }
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

  const GetAddOns = () => {
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/getalladdonproducts",
        {}
      )
      .then(
        (res) => {
          if (res.status === 200) {
            setAddOns(res?.data?.products);
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            setAddOns([]);
          }
        }
      );
  };

  const handleImageClick = (occasion) => {
    console.log(occasion.price);
    var TotalPrice = sessionStorage.getItem("TotalPrice");
    var subtotal = sessionStorage.getItem("subtotal");

    setSelectedOccasions((prevSelected) => {
      const isSelected = prevSelected.some(
        (soccasion) => occasion._id === soccasion._id
      );

      console.log(isSelected, "isSelectednoone");
      console.log(occasion, "occasion");
      console.log(prevSelected, "prevSelected");

      if (isSelected) {
        TotalPrice = parseFloat(TotalPrice) - occasion.price;
        subtotal = parseFloat(subtotal) - occasion.price;
        var CouponData = JSON.parse(sessionStorage.getItem("CouponData"));
        if (CouponData) {
          if (CouponData.couponCodeType === "Percentage") {
            var discount = (subtotal * CouponData.couponAmount) / 100;
            sessionStorage.setItem("coupondis", discount);
            console.log("coupondis", discount);
            TotalPrice = subtotal - discount;
          }
        }
        return prevSelected.filter(
          (soccasion) => occasion._id !== soccasion._id
        );
      } else {
        TotalPrice = parseFloat(TotalPrice) + occasion.price;
        subtotal = parseFloat(subtotal) + occasion.price;
        var CouponData = JSON.parse(sessionStorage.getItem("CouponData"));
        if (CouponData) {
          if (CouponData.couponCodeType === "Percentage") {
            var discount = (subtotal * CouponData.couponAmount) / 100;
            sessionStorage.setItem("coupondis", discount);
            console.log("coupondis", discount);
            TotalPrice = subtotal - discount;
          }
        }
        sessionStorage.setItem("subtotal", subtotal);
        return [...prevSelected, occasion];
      }
    });

    if (IDS.length > 0) {
      const index = IDS.findIndex(
        (obj) => String(obj.id) === String(occasion._id)
      );

      if (index !== -1) {
        const newIDS = [...IDS.slice(0, index), ...IDS.slice(index + 1)];
        setIDS(newIDS);
      } else {
        setIDS([
          ...IDS,
          { id: occasion._id, price: occasion.price, name: occasion.name },
        ]);
      }
    } else {
      setIDS([
        { id: occasion._id, price: occasion.price, name: occasion.name },
      ]);
    }
  };

  // HANDLE SUBMIT WITH GST FIELDS ONLY - HAMESHA ONLINE
  const handleSubmit = () => {
    // No validation needed for payment method - hamesha online

    const productMap = selectedOccasions.map((e, i) => {
      return {
        _id: e._id,
        name: e.name,
        type: "other",
        price: e.price,
        quantity: 1,
      };
    });

    // BODY DATA WITH GST FIELDS ONLY - HAMESHA ONLINE
    const bodyData = {
      // Products and booking info
      products: productMap,
      addons: JSON.stringify(IDS),
      bookingId: sessionStorage.getItem("bookingid"),
      
      // Subtotal after coupon (before GST)
      subTotal: subtotalAfterCoupon.toFixed(2),
      
      // GST FIELDS - SENDING CGST AND SGST
      gstPercentage: gstPercentage,
      gstAmount: gstAmount.toFixed(2),
      cgstAmount: cgstAmount.toFixed(2),
      sgstAmount: sgstAmount.toFixed(2),
      
      // Total price (with GST)
      totalPrice: displayTotal.toFixed(2),
      
      // Coupon discount
      couponAmount: couponDiscount,
      
      // Payment info - HAMESHA ONLINE
      paymentType: "online", // Fixed to online
      paymentOption: "partialpayment", // Fixed to partialpayment
      advanceAmount: advanceAmount,
      remainingAmount: remainingAmount.toFixed(2),
      
      // Theatre info
      theatrePrice: theaterPrice,
      extraAddedPersonsForTheatre: sessionStorage.getItem("countPeople"),
      
      // Other fields
      cashType: "online", // Fixed to online
      create_type: "web",
      
      // Extra info
      baseSubtotal: baseSubtotal.toFixed(2),
    };

    console.log("Submitting data to updateaddons:", bodyData);

    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updateaddons",
        bodyData
      )
      .then(
        (res) => {
          console.log(res.status, "res.status");
          if (res.status === 200) {
            // Save all settings to sessionStorage
            sessionStorage.setItem("addonsData", JSON.stringify(selectedOccasions));
            sessionStorage.setItem("addons", addonsTotal);
            
            // Save GST calculation results to sessionStorage
            sessionStorage.setItem("baseSubtotal", baseSubtotal.toFixed(2));
            sessionStorage.setItem("subtotalAfterCoupon", subtotalAfterCoupon.toFixed(2));
            sessionStorage.setItem("gstPercentage", gstPercentage);
            sessionStorage.setItem("gstAmount", gstAmount.toFixed(2));
            sessionStorage.setItem("cgstAmount", cgstAmount.toFixed(2));
            sessionStorage.setItem("sgstAmount", sgstAmount.toFixed(2));
            sessionStorage.setItem("finalAmount", displayTotal.toFixed(2));
            
            toast.success("Addons updated successfully!");
            navigate("/BookingSummary");
          } else if (res.status === 403) {
            toast.error(
              "Access Denied: You do not have permission to view this page."
            );
            navigate("/locations");
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            console.log(error.response);
            toast.error(error.response.data?.message || "Error updating addons");
          } else if (error.response && error.response.status === 406) {
            toast.error(error.response.data?.message || "Payment required");
            setTimeout(() => {
              navigate("/locations");
            }, 2000);
          } else {
            toast.error("Something went wrong. Please try again.");
          }
        }
      );
  };

  const navigateCakes = useNavigate();
  const handleClick = () => {
    navigateCakes("/CakesComponent");
  };

  const cakecartdata = JSON.parse(sessionStorage.getItem("cartCakes")) || [];
  const cakepricedata = cakecartdata.map((data) => data.price);
  const cakevalue = cakepricedata.reduce((acc, curr) => acc + curr, 0);

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
              className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix "
            >
              <div className="container"></div>
            </section>
            <section
              className="shop-area pt-5 pb-5 p-relative lightest-back"
              style={{ background: "white" }}
            >
              <div className="container-fluid px-4">
                <button
                  type="button"
                  className="btn light-back shadow-lg text-light"
                  onClick={handleClick}
                >
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>
                <div className="container-fluid mt-4">
                  <div className="row mb-4">
                    {/* Addons Products */}
                    <div className="col-md-8 lighter-back rounded shadow-sm">
                      {addOns.map((data, key) => (
                        <div key={key}>
                          <div className="row">
                            <h4 className="mt-1">{data.name}</h4>
                            <div className="d-flex flex-wrap">
                              {data?.products.map((ele, ind) => (
                                <div
                                  className="col-6 col-md-3 mb-3 text-center d-flex"
                                  key={ind}
                                  onClick={() => handleImageClick(ele)}
                                  style={{
                                    cursor: "pointer",
                                    borderRadius: "0.5rem",
                                    display: "flex",
                                    padding: "3px",
                                    boxSizing: "border-box",
                                  }}
                                >
                                  <div
                                    className="d-flex flex-column justify-content-between align-items-center w-100"
                                    style={{
                                      padding: "10px",
                                      border: "2px solid #C69FF4",
                                      borderRadius: "10px",
                                      background: selectedOccasions?.some(
                                        (addIds) =>
                                          addIds._id === String(ele._id)
                                      )
                                        ? " #C69FF4"
                                        : "linear-gradient(45deg, #FFFAFB, #BEBEBE)",
                                      color: selectedOccasions?.some(
                                        (addIds) =>
                                          addIds._id === String(ele._id)
                                      )
                                        ? "black"
                                        : "inherit",
                                    }}
                                  >
                                    <div>
                                      <img
                                        src={URLS.Base + ele.image}
                                        alt="occasions images"
                                        className="img-fluid rounded-pill"
                                        style={{
                                          height: "150px",
                                          width: "150px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                    <p
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {ele.name}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      ₹ {ele.price}/-
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="alert light-back mt-3">
                        <i className="fa fa-exclamation-triangle me-2" style={{ color: 'white' }}></i>
                        <span style={{ color: 'white' }}>
                          <b>Note:</b> The timing of the photography sessions is subject to the availability of our photographers. We strive to accommodate your preferred schedule and appreciate your understanding and flexibility. For specific booking inquiries, please contact us directly.
                        </span>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="col-lg-4 col-md-4">
                      <div className="position-sticky" style={{ top: "20px" }}>
                        {/* Total Display */}
                        <div className="lighter-back rounded shadow-sm mb-3">
                          <div className="card-body mt-3">
                            <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded">
                              <div>Total (incl. GST):</div>
                              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#300843" }}>
                                ₹ {displayTotal.toFixed(2)}
                              </div>
                            </div>
                            <div className="small text-muted text-end">
                              ({gstPercentage}% GST included)
                            </div>
                          </div>
                        </div>

                        {/* GST Display with CGST/SGST breakdown */}
                        <div className="lighter-back rounded shadow-sm mb-3 p-3">
                          <div>
                            <span style={{ fontWeight: "bold" }}>GST ({gstPercentage}%)</span>
                            <div className="small text-muted">
                              CGST: ₹{cgstAmount.toFixed(2)} | SGST: ₹{sgstAmount.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Advance Payment Display */}
                        <div className="lighter-back rounded shadow-sm mb-3 p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <span style={{ fontWeight: "bold" }}>Advance Payment (Online)</span>
                              <div className="small text-muted">
                                Pay now to confirm booking
                              </div>
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#300843" }}>
                              ₹{advanceAmount}
                            </div>
                          </div>
                          <div className="mt-2 text-muted small">
                            Remaining: ₹{remainingAmount.toFixed(2)} (pay at venue)
                          </div>
                        </div>

                        {/* Payment Method Badge - Sirf online dikhega */}
                        <div className="lighter-back rounded shadow-sm mb-3 p-3">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-credit-card me-2" style={{ fontSize: "1.2rem" }}></i>
                            <span>Payment Method: <strong>Online Payment</strong></span>
                          </div>
                        </div>

                        {/* Summary Details Accordion */}
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
                                      {/* Theatre Price */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>
                                          Theatre Price (
                                          {sessionStorage.getItem("countPeople")} ppl)
                                        </div>
                                        <div>₹{theaterPrice}</div>
                                      </div>
                                      <hr />
                                      
                                      {/* Addons */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          marginBottom: "8px",
                                        }}
                                      >
                                        <div>Addons</div>
                                      </div>
                                      {selectedOccasions.map((occasion, index) => (
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
                                      ))}

                                      {selectedOccasions.length > 0 && (
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            marginTop: "8px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          ₹ {addonsTotal}
                                        </div>
                                      )}

                                      <hr />
                                      
                                      {/* Occasion */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>
                                          Occasions (
                                          {sessionStorage.getItem("occasionName")})
                                        </div>
                                        <div>₹{occasionPrice}</div>
                                      </div>
                                      <hr />
                                      
                                      {/* Cake */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Cake</div>
                                        <div>₹{cakePrice}</div>
                                      </div>
                                      <hr />
                                      
                                      {/* Base Subtotal */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>Base Subtotal</div>
                                        <div>₹{baseSubtotal.toFixed(2)}</div>
                                      </div>
                                      
                                      {/* Coupon Discount */}
                                      {couponDiscount > 0 && (
                                        <>
                                          <hr />
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              color: "#28a745",
                                            }}
                                          >
                                            <div>Coupon Discount</div>
                                            <div>- ₹{couponDiscount.toFixed(2)}</div>
                                          </div>
                                        </>
                                      )}
                                      
                                      <hr />
                                      
                                      {/* Subtotal after coupon */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          fontWeight: "bold",
                                          backgroundColor: "#e8f5e9",
                                          padding: "5px",
                                          borderRadius: "4px"
                                        }}
                                      >
                                        <div>Subtotal after coupon</div>
                                        <div>₹{subtotalAfterCoupon.toFixed(2)}</div>
                                      </div>
                                      
                                      {/* GST Breakdown */}
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          color: "#6c757d",
                                        }}
                                      >
                                        <div>CGST (9%)</div>
                                        <div>+ ₹{cgstAmount.toFixed(2)}</div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          color: "#6c757d",
                                        }}
                                      >
                                        <div>SGST (9%)</div>
                                        <div>+ ₹{sgstAmount.toFixed(2)}</div>
                                      </div>
                                      
                                      <hr />
                                      
                                      {/* Final Total */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          color: "#300843",
                                          backgroundColor: "#f8f9fa",
                                          padding: "12px",
                                          borderRadius: "5px",
                                          marginTop: "10px",
                                          border: "2px solid #C69FF4"
                                        }}
                                      >
                                        <div>Final Total (incl. GST)</div>
                                        <div>₹{displayTotal.toFixed(2)}</div>
                                      </div>
                                      
                                      <hr />
                                      
                                      {/* Advance & Remaining */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          color: "#007bff",
                                        }}
                                      >
                                        <div>Advance Payment (Now - Online)</div>
                                        <div>₹{advanceAmount}</div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          color: "#6c757d",
                                          marginTop: "5px",
                                        }}
                                      >
                                        <div>Remaining (At Venue)</div>
                                        <div>₹{remainingAmount.toFixed(2)}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Proceed Button */}
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className="btn dark-back text-white w-100 mt-2"
                          style={{
                            boxShadow: "none",
                            color: "black",
                            border: "none",
                            padding: "12px",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Pay Advance ₹{advanceAmount} Online & Proceed
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

export default AddOns;