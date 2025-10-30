import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [heardFrom, setHeardFrom] = useState(""); // New field
  const [couponCode, setCouponCode] = useState(""); // New field
  const [allCoupons, setAllCoupons] = useState([]); // All available coupons
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Applied coupon data
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false); // Loading state for apply button

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
      }
    });
  };

  const navigateHome = useNavigate();
  const navigate = useNavigate();
  const [policys, setpolicys] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!heardFrom) {
      toast.error("Please select how you heard about us");
      return;
    }
    
    sessionStorage.setItem("userDetails", JSON.stringify(data));
    addbasicbooking();
  };

  const handleSubmitpayment = () => {
    sessionStorage.setItem("userDetails", JSON.stringify(data));
    axios
      .put(
        `https://api.carnivalcastle.com/v1/carnivalApi/web/booking/updatetransactionstatus/${sessionStorage.getItem(
          "bookingid"
        )}`
      )
      .then((response) => {
        if (response.status === 200) {
          window.location.href =
            response.data.data?.instrumentResponse?.redirectInfo.url;
        } else if (response.status === 400) {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating transaction status:", error);
      });
  };

  useEffect(() => {
    GetTheatersData();
    GetPoliciesData();
    getAllCoupons(); // Load all coupons on component mount
  }, []);

  // Function to get all coupons
  const getAllCoupons = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5091/v1/carnivalApi/admin/coupon/getallcarnivalcoupons"
      );
      if (response.data.success) {
        setAllCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  // Function to apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);

    try {
      // Find coupon in the list
      const foundCoupon = allCoupons.find(
        coupon => coupon.couponCode.toLowerCase() === couponCode.trim().toLowerCase()
      );

      if (!foundCoupon) {
        toast.error("Invalid coupon code");
        setAppliedCoupon(null);
        // Clear session storage for coupon
        sessionStorage.removeItem("coupon_Id");
        sessionStorage.removeItem("coupondis");
        sessionStorage.removeItem("couponCode");
        setIsApplyingCoupon(false);
        return;
      }

      // Check if coupon is active
      if (foundCoupon.status !== "active") {
        toast.error("This coupon is not active");
        setAppliedCoupon(null);
        sessionStorage.removeItem("coupon_Id");
        sessionStorage.removeItem("coupondis");
        sessionStorage.removeItem("couponCode");
        setIsApplyingCoupon(false);
        return;
      }

      // Check date validity
      const currentDate = new Date();
      const fromDate = new Date(foundCoupon.fromDate);
      const toDate = new Date(foundCoupon.toDate);

      if (currentDate < fromDate) {
        toast.error("This coupon is not yet valid");
        setAppliedCoupon(null);
        sessionStorage.removeItem("coupon_Id");
        sessionStorage.removeItem("coupondis");
        sessionStorage.removeItem("couponCode");
        setIsApplyingCoupon(false);
        return;
      }

      if (currentDate > toDate) {
        toast.error("This coupon has expired");
        setAppliedCoupon(null);
        sessionStorage.removeItem("coupon_Id");
        sessionStorage.removeItem("coupondis");
        sessionStorage.removeItem("couponCode");
        setIsApplyingCoupon(false);
        return;
      }

      // If all validations pass, apply the coupon
      setAppliedCoupon(foundCoupon);
      
      // Get coupon amount from response (use value or amount field)
      const couponAmount = foundCoupon.value || foundCoupon.amount;
      
      // Store coupon details in sessionStorage
      sessionStorage.setItem("coupon_Id", foundCoupon._id);
      sessionStorage.setItem("coupondis", couponAmount);
      sessionStorage.setItem("couponCode", foundCoupon.couponCode);
      
      toast.success(`Coupon applied successfully! Discount: ₹${couponAmount}`);
      
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Error applying coupon");
      setAppliedCoupon(null);
      sessionStorage.removeItem("coupon_Id");
      sessionStorage.removeItem("coupondis");
      sessionStorage.removeItem("couponCode");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Function to remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    sessionStorage.removeItem("coupon_Id");
    sessionStorage.removeItem("coupondis");
    sessionStorage.removeItem("couponCode");
    toast.info("Coupon removed");
  };

  const navigateCakes = useNavigate();
  const handleClick = () => {
    navigateCakes("/AddOnscomponent");
  };

  const GetPoliciesData = () => {
    axios.post(URLS.GetPolicies, {}, {}).then((res) => {
      if (res.status === 200) {
        setpolicys(res.data.policy);
      }
    });
  };

  const mypaymenttypekey = sessionStorage.getItem("paymentkey");

  // Calculate total price with coupon discount
  const calculateTotalPrice = () => {
    const basePrice = 
      parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
      parseFloat(sessionStorage.getItem("cakeprice") || 0) +
      parseFloat(sessionStorage.getItem("occprice") || 0) +
      (parseFloat(sessionStorage.getItem("addons")) || 0);
    
    const couponDiscount = appliedCoupon ? 
      parseFloat(appliedCoupon.value || appliedCoupon.amount || 0) : 0;
    
    return basePrice - couponDiscount;
  };

  const totoalbasicprice = calculateTotalPrice();
  const totoalbasicpricesubtotal =
    parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
    parseFloat(sessionStorage.getItem("cakeprice") || 0) +
    parseFloat(sessionStorage.getItem("occprice") || 0) +
    (parseFloat(sessionStorage.getItem("addons")) || 0);

  const allcakes = JSON.parse(sessionStorage.getItem("cartCakes"));
  const allcakeslength =
    JSON.parse(sessionStorage.getItem("selectedWeights")) || "500";

  const submitcakesall = () => {
    const productMap = allcakes.map((e, i) => {
      return {
        _id: e._id,
        name: e.name,
        type: "cake",
        cakeType: e.cakeType,
        price: e.price,
        quantity: parseFloat(
          allcakeslength[e._id] == undefined ||
          allcakeslength[e._id] == "500" ||
          allcakeslength[e._id] == null
            ? "500"
            : allcakeslength[e._id]
        ),
      };
    });

    const bodyData = {
      products: productMap,
      bookingId: sessionStorage.getItem("bookingid"),
    };
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatecakes",
        bodyData
      )
      .then(
        (res) => {
          console.log(res);
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            console.log(error.response);
            toast.error(error.response.message);
          } else if (error.response && error.response.status === 406) {
            toast.error(error.response.message);
          }
        }
      );
  };

  const addbasicbooking = async () => {
    submitcakesall();
    setIsLoading1(true);
    const extrapersiontheater = parseFloat(sessionStorage.getItem("countPeople"));
    const maxPeopletheater = parseFloat(sessionStorage.getItem("maxPeople"));
    const token = sessionStorage.getItem("token");

    // Get coupon amount from applied coupon (use value or amount field from response)
    const couponAmountValue = appliedCoupon ? 
      (appliedCoupon.value || appliedCoupon.amount) : 
      sessionStorage.getItem("coupondis");

    const dataArray = {
      totalPrice: totoalbasicprice,
      subTotal: totoalbasicpricesubtotal,
      advancePayment: parseFloat(sessionStorage.getItem("advancePayment")),
      theatrePrice: parseFloat(sessionStorage.getItem("theaterPrice")),
      bookingId: sessionStorage.getItem("bookingid"),
      couponId: appliedCoupon ? appliedCoupon._id : sessionStorage.getItem("coupon_Id"),
      couponAmount: couponAmountValue, // Send the value/amount from response as couponAmount
      couponCode: appliedCoupon ? appliedCoupon.couponCode : couponCode,
      extraAddedPersonsForTheatre: sessionStorage.getItem("countPeople"),
      transactionId: "",
      transactionStatus: "completed",
      cashType: "online",
      create_type: "web",
      status: "booking-confirmed",
      heardFrom: heardFrom,
    };
    
    if (extrapersiontheater > maxPeopletheater) {
      dataArray.extraPersonPrice = sessionStorage.getItem("extraPersonperprice") || 0;
    }
    
    try {
      const res = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatebookingforPayment",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('🔵 API Response:', res.data);
      if (res.status === 200) {
        toast(res.data.message);
        window.location.href = res?.data?.data?.instrumentResponse?.redirectInfo?.url;
        setIsLoading1(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
        navigate("/payment-fail");
      } else if (error.response && error.response.status === 406) {
        toast.error(error.response.data.message);
        setTimeout(() => {
          navigate("/theaters");
        }, 2000);
      }
    }
  };

  const [isAgreed, setIsAgreed] = useState(false);

  const handleAgree = (event) => {
    if (event.target.checked) {
      setIsAgreed(true);
    } else {
      setIsAgreed(false);
      toast.error("You must agree to the terms and conditions to proceed.");
    }
  };

  // Get coupon discount amount for display
  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.value || appliedCoupon.amount;
  };

  return (
    <>
      {isLoading === true ? (
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
              className="shop-area pt-4 pb-5 p-relative lightest-back "
              style={{ background: "white" }}
            >
              <div className="container mx-auto p-4">
                <button
                  type="button"
                  className="btn light-back shadow-sm text-light mb-3"
                  onClick={handleClick}
                  style={{
                    boxShadow: "none",
                    color: "black",
                    border: "none",
                  }}
                >
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>

                {/* New Fields Section */}
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="heardFrom" className="form-label fw-bold">
                      How did you hear about us? *
                    </label>
                    <select
                      className="form-select"
                      id="heardFrom"
                      value={heardFrom}
                      onChange={(e) => setHeardFrom(e.target.value)}
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Google">Google</option>
                      <option value="Friend">Friend</option>
                      <option value="Family">Family</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="form-text">Please select how you found out about us</div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="couponCode" className="form-label fw-bold">
                      Coupon Code
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="couponCode"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon}
                      />
                      {!appliedCoupon ? (
                        <button
                          className="btn btn-success"
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                        >
                          {isApplyingCoupon ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Applying...
                            </>
                          ) : (
                            'Apply'
                          )}
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={handleRemoveCoupon}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    {/* Applied Coupon Display */}
                    {appliedCoupon && (
                      <div className="alert alert-success mt-2 p-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>Coupon Applied:</strong> {appliedCoupon.couponCode}
                            <br />
                            <small>Discount: ₹{getCouponDiscount()}</small>
                          </div>
                          <button 
                            type="button" 
                            className="btn-close" 
                            onClick={handleRemoveCoupon}
                            aria-label="Remove coupon"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="form-text">
                      {appliedCoupon 
                        ? `You saved ₹${getCouponDiscount()} with this coupon!`
                        : "Enter your coupon code and click Apply"
                      }
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 ">
                    <div
                      className="shadow-sm lighter-back text-black p-4 d-flex flex-column "
                      style={{ height: "700px" }}
                    >
                      <div
                        className="mt-2 flex-grow-1"
                        style={{
                          overflowY: "auto",
                          paddingRight: "10px",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: policys.termsAndCondition,
                        }}
                      ></div>

                      <div className="mt-auto text-center">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          id="agreeCheckbox"
                          onChange={handleAgree}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="agreeCheckbox"
                        >
                          I agree to all the above conditions.
                        </label>
                      </div>

                      <div className="d-flex justify-content-end mt-3">
                        {isLoading1 == true ? (
                          <button
                            className="btn dark-back text-white"
                            style={{
                              boxShadow: "none",
                              color: "black",
                              border: "none",
                            }}
                            disabled
                          >
                            Your Booking Processing...
                          </button>
                        ) : (
                          <button
                            className="btn dark-back text-white"
                            style={{
                              boxShadow: "none",
                              color: "black",
                              border: "none",
                            }}
                            onClick={handleSubmit}
                            disabled={!isAgreed || !heardFrom}
                          >
                            Confirm & Pay ₹{sessionStorage.getItem("advancePayment") || "750"} to Reserve
                          </button>
                        )}
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

export default BookingForm;