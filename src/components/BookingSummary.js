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
  const [heardFrom, setHeardFrom] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [allCoupons, setAllCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // UPI QR states
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiIntentUrl, setUpiIntentUrl] = useState("");

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
      }
    });
  };

  const navigate = useNavigate();
  const [policys, setpolicys] = useState([]);

  // Get all values from sessionStorage (set by AddOns component)
  const finalAmount = parseFloat(sessionStorage.getItem("finalAmount")) || 0;
  const baseSubtotal = parseFloat(sessionStorage.getItem("baseSubtotal")) || 0;
  const subtotalAfterCoupon = parseFloat(sessionStorage.getItem("subtotalAfterCoupon")) || 0;
  const gstPercentage = parseFloat(sessionStorage.getItem("gstPercentage")) || 18;
  const gstAmount = parseFloat(sessionStorage.getItem("gstAmount")) || 0;
  const cgstAmount = parseFloat(sessionStorage.getItem("cgstAmount")) || 0;
  const sgstAmount = parseFloat(sessionStorage.getItem("sgstAmount")) || 0;
  const advancePayment = parseFloat(sessionStorage.getItem("advancePayment")) || 750;
  
  // Calculate remaining amount
  const remainingAmount = finalAmount - advancePayment;

  console.log("Booking Settings from AddOns:", {
    finalAmount,
    gstPercentage,
    gstAmount,
    cgstAmount,
    sgstAmount,
    subtotalAfterCoupon,
    advancePayment,
    remainingAmount
  });

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

  useEffect(() => {
    GetTheatersData();
    GetPoliciesData();
    getAllCoupons();
  }, []);

  // Function to get all coupons
  const getAllCoupons = async () => {
    try {
      const response = await axios.get(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/coupon/getallcarnivalcoupons"
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
      
      // Get coupon amount from response
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

  const allcakes = JSON.parse(sessionStorage.getItem("cartCakes")) || [];
  const allcakeslength = JSON.parse(sessionStorage.getItem("selectedWeights")) || "500";

  const submitcakesall = () => {
    if (!allcakes || allcakes.length === 0) return;
    
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
          console.log("Cakes updated:", res);
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

  // Main payment function with GST fields only - ADVANCE PAYMENT FIXED
  const addbasicbooking = async () => {
    submitcakesall();
    setIsLoading1(true);
    const extrapersiontheater = parseFloat(sessionStorage.getItem("countPeople"));
    const maxPeopletheater = parseFloat(sessionStorage.getItem("maxPeople"));
    const token = sessionStorage.getItem("token");

    // Get coupon amount from applied coupon
    const couponAmountValue = appliedCoupon ? 
      (appliedCoupon.value || appliedCoupon.amount) : 
      sessionStorage.getItem("coupondis");

    // BODY DATA WITH GST FIELDS ONLY - ADVANCE PAYMENT FIXED
    const dataArray = {
      // Basic booking info
      bookingId: sessionStorage.getItem("bookingid"),
      
      // Amounts with GST breakdown
      totalPrice: finalAmount, // Final total with GST
      subTotal: subtotalAfterCoupon, // Subtotal after coupon (before GST)
      
      // GST FIELDS - SENDING CGST AND SGST
      gstPercentage: gstPercentage,
      gstAmount: gstAmount,
      cgstAmount: cgstAmount,
      sgstAmount: sgstAmount,
      
      // Coupon info
      couponId: appliedCoupon ? appliedCoupon._id : sessionStorage.getItem("coupon_Id"),
      couponAmount: couponAmountValue ? parseFloat(couponAmountValue) : 0,
      couponCode: appliedCoupon ? appliedCoupon.couponCode : couponCode,
      
      // Payment info - ADVANCE PAYMENT FIXED (partialpayment hi rahega)
      paymentType: "partialpayment", // Fixed to partialpayment - yeh important hai!
      advancePayment: advancePayment,
      remainingAmount: remainingAmount,
      transactionId: "",
      transactionStatus: "completed",
      cashType: "online",
      create_type: "web",
      status: "booking-confirmed",
      
      // Theatre info
      theatrePrice: parseFloat(sessionStorage.getItem("theaterPrice")) || 0,
      extraAddedPersonsForTheatre: sessionStorage.getItem("countPeople"),
      
      // Original subtotal (before discounts)
      originalSubtotal: parseFloat(sessionStorage.getItem("theaterPrice") || 0) +
        parseFloat(sessionStorage.getItem("cakeprice") || 0) +
        parseFloat(sessionStorage.getItem("occprice") || 0) +
        (parseFloat(sessionStorage.getItem("addons")) || 0),
      
      // How heard about us
      heardFrom: heardFrom,
    };
    
    if (extrapersiontheater > maxPeopletheater) {
      dataArray.extraPersonPrice = sessionStorage.getItem("extraPersonperprice") || 0;
    }
    
    console.log("Sending to backend with CGST/SGST (Advance Payment Fixed):", dataArray);

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
        
        // Check response type
        const responseData = res.data.data;
        
        // Case 1: UPI QR Response (with qrData)
        if (responseData?.qrData) {
          console.log("✅ UPI QR Response received");
          setQrImageUrl(`data:image/png;base64,${responseData.qrData}`);
          if (responseData.intentUrl) {
            setUpiIntentUrl(responseData.intentUrl);
          }
          setShowQRModal(true);
          setIsLoading1(false);
        }
        
        // Case 2: Normal redirect URL
        else if (responseData?.instrumentResponse?.redirectInfo?.url) {
          console.log("✅ Redirect URL received");
          window.location.href = responseData.instrumentResponse.redirectInfo.url;
          setIsLoading1(false);
        }
        
        // Case 3: Direct intent URL
        else if (responseData?.intentUrl) {
          console.log("✅ Intent URL received");
          window.location.href = responseData.intentUrl;
          setIsLoading1(false);
        }
        
        // Case 4: No payment URL found
        else {
          console.log("⚠️ No payment URL found in response");
          toast.error("Payment initiation failed. Please try again.");
          setIsLoading1(false);
        }
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
      setIsLoading1(false);
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
              <div className="container-fluid mx-auto p-4">
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

                {/* Amount Summary Card */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card shadow-sm">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Booking Summary (GST Included)</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <td>Base Subtotal:</td>
                                  <td className="text-end">₹{baseSubtotal.toFixed(2)}</td>
                                </tr>
                                {getCouponDiscount() > 0 && (
                                  <tr className="text-success">
                                    <td>Coupon Discount:</td>
                                    <td className="text-end">- ₹{getCouponDiscount()}</td>
                                  </tr>
                                )}
                                <tr className="fw-bold">
                                  <td>Subtotal after coupon:</td>
                                  <td className="text-end">₹{subtotalAfterCoupon.toFixed(2)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-md-6">
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <td>CGST (9%):</td>
                                  <td className="text-end">+ ₹{cgstAmount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td>SGST (9%):</td>
                                  <td className="text-end">+ ₹{sgstAmount.toFixed(2)}</td>
                                </tr>
                                <tr className="fw-bold text-primary" style={{ fontSize: "18px" }}>
                                  <td>Final Total (incl. GST):</td>
                                  <td className="text-end">₹{finalAmount.toFixed(2)}</td>
                                </tr>
                                <tr className="text-info">
                                  <td>Advance Payment (Now):</td>
                                  <td className="text-end">₹{advancePayment.toFixed(2)}</td>
                                </tr>
                                <tr className="text-secondary">
                                  <td>Remaining (At Venue):</td>
                                  <td className="text-end">₹{remainingAmount.toFixed(2)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 ">
                    <div
                      className="shadow-sm lighter-back text-black p-4 d-flex flex-column "
                      style={{ height: "500px" }}
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
                            Pay Advance ₹{advancePayment.toFixed(2)} & Confirm Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* QR Code Modal */}
            {showQRModal && (
              <>
                <div className="modal-backdrop fade show" style={{ display: 'block' }}></div>
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          <i className="bi bi-qr-code-scan me-2"></i>
                          Pay Advance ₹{advancePayment.toFixed(2)}
                        </h5>
                        <button 
                          type="button" 
                          className="btn-close" 
                          onClick={() => setShowQRModal(false)}
                        ></button>
                      </div>
                      <div className="modal-body">
                        
                        {/* QR CODE */}
                        {qrImageUrl && (
                          <div className="text-center mb-4">
                            <img 
                              src={qrImageUrl} 
                              alt="Payment QR Code" 
                              className="img-fluid border p-2"
                              style={{ maxWidth: '200px' }}
                            />
                            <p className="text-muted mt-2">Scan this QR code with any UPI app</p>
                          </div>
                        )}
                        
                        {/* UPI ID ENTRY FIELD */}
                        <div className="mt-3">
                          <label className="form-label fw-bold">Enter your UPI ID</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-person-badge"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., name@okhdfcbank"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                          </div>
                          <small className="text-muted">
                            Pay to: <strong>carnivalcastle@okhdfcbank</strong>
                          </small>
                        </div>

                        {/* Amount Display */}
                        <div className="alert alert-info mt-3 py-2">
                          <div className="d-flex justify-content-between">
                            <span>Advance Amount:</span>
                            <strong>₹{advancePayment.toFixed(2)}</strong>
                          </div>
                        </div>

                        {/* Pay Button */}
                        <button 
                          className="btn btn-primary w-100 mt-3"
                          onClick={() => {
                            if (upiId) {
                              // UPI ID se payment
                              window.location.href = `upi://pay?pa=carnivalcastle@okhdfcbank&pn=Carnival%20Castle&am=${advancePayment}&cu=INR&tn=Booking`;
                            } else if (upiIntentUrl) {
                              // Intent URL se payment
                              window.location.href = upiIntentUrl;
                            } else {
                              toast.error("Please enter UPI ID or scan QR code");
                            }
                          }}
                        >
                          Pay ₹{advancePayment.toFixed(2)} Now
                        </button>

                      </div>
                      <div className="modal-footer">
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => setShowQRModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Footer />
          </main>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default BookingForm;