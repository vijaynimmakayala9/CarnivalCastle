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
import {
  FaCalendarAlt,
  FaRegClock,
  FaUser,
  FaBirthdayCake,
  FaRegSmile,
} from "react-icons/fa";

const ComboBooking = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
      }
    });
  };

  const navigateHome = useNavigate();
  const [policys, setpolicys] = useState([]);

  // 'https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatebookingforPayment'
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   sessionStorage.setItem("userDetails", JSON.stringify(data));
  //   addBooking();
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handleSubmitpayment()
    addcombobooking()
  }

  const handleSubmitpayment = (e) => {

    sessionStorage.setItem("userDetails", JSON.stringify(data));
    // addBooking(); 
    axios
      .put(
        `https://api.carnivalcastle.com/v1/carnivalApi/web/booking/updatetransactionstatus/${sessionStorage.getItem("bookingid")}`
      )
      .then((response) => {
        // console.log("Transaction status updated:", response.data);
        window.location.href = response.data.data?.instrumentResponse?.redirectInfo.url;
        console.log("Transaction status updated:", response.data.instrumentResponse);
      })
      .catch((error) => {
        console.error("Error updating transaction status:", error);
      });
  };

  useEffect(() => {
    GetTheatersData();
    GetPoliciesData(); // this is the terms and conditions
  }, []);

  const navigateCakes = useNavigate();
  const navigate = useNavigate();
  const handleClick = () => {
    navigateCakes("/ComboPlans");
  };

  const GetPoliciesData = () => {
    axios.post(URLS.GetPolicies, {}, {}).then((res) => {
      if (res.status === 200) {
        setpolicys(res.data.policy);
      }
    });
  };

  const mypaymenttypekey = sessionStorage.getItem("paymentkey");

  const addcombobooking = async () => {
    setIsLoading1(true)
    const extrapersiontheater = parseFloat(sessionStorage.getItem("countPeople"));
    const maxPeopletheater = parseFloat(sessionStorage.getItem("maxPeople"));
    const token = sessionStorage.getItem("token");

    const dataArray = {
      planOfferPrice: sessionStorage.getItem("planpricesss"),
      totalPrice: sessionStorage.getItem("totalallprice"),
      subTotal: sessionStorage.getItem("subtotalallprice"),
      advancePayment: parseFloat(sessionStorage.getItem("comboAdvancePayment")),
      theatrePrice: parseFloat(sessionStorage.getItem("theaterPrice")),
      bookingId: sessionStorage.getItem("bookingid"),
      couponId: sessionStorage.getItem("coupon_Id"),
      couponAmount: sessionStorage.getItem("coupondis"),
      extraAddedPersonsForTheatre: sessionStorage.getItem(
        "countPeople"
      ),
      transactionId: "",
      // transactionId: response.razorpay_payment_id,
      transactionStatus: "completed",
      cashType: "online",
      create_type: "web",
      status: "booking-confirmed",
    };
    if (extrapersiontheater > maxPeopletheater) {
      dataArray.extraPersonPrice = sessionStorage.getItem("planextrapersoncharge") || 0;
    }
    try {
      const res = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatebookingforPayment",
        dataArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        toast(res.data.message);
        // submitcakesall();
        // navigateHome("/payment-success");
        window.location.href = res?.data?.data?.instrumentResponse?.redirectInfo?.url
        setIsLoading1(false)
        // sessionStorage.clear();
        // sessionStorage.setItem("invoicePath", res.data.invoicePath);
        // sessionStorage.setItem("orderId", res.data.orderId);
        // sessionStorage.setItem("bookingId", res?.data?.paymentSave?.bookingId);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
        navigate("/payment-fail"); // error PaymentFail
      } else if (error.response && error.response.status === 406) {
        toast.error(error.response.data.message);
        setTimeout(() => {
          navigate("/theaters");
        }, 2000);
      }
    }
  }

  // const addBooking = async () => {
  //   const extrapersiontheater = sessionStorage.getItem("extraAddedPersonsForTheatre")
  //   const maxPeopletheater = sessionStorage.getItem("maxPeople")
  //   const options = {
  //     key: "rzp_test_HJG5Rtuy8Xh2NB",
  //     currency: "INR",
  //     name: "Carnival Castle",
  //     amount:
  //       mypaymenttypekey == "partialpayment"
  //         ? Number(sessionStorage.getItem("comboAdvancePayment")) * 100
  //         : sessionStorage.getItem("TotalPrice") * 100,
  //     description: "Carnival Castle Transaction",
  //     image: "https://carnivalcastle.com/static/images/logo-text.webp",
  //     handler: async (response) => {
  //       const token = sessionStorage.getItem("token");

  //       const dataArray = {
  //         totalPrice: sessionStorage.getItem("TotalPrice"),
  //         advancePayment: sessionStorage.getItem("comboAdvancePayment"),
  //         bookingId: sessionStorage.getItem("bookingid"),
  //         couponId: sessionStorage.getItem("coupon_Id"),
  //         couponAmount: sessionStorage.getItem("coupondis"),
  //         extraPersonPrice: sessionStorage.getItem("extraPersonprice"),
  //         transactionId: response.razorpay_payment_id,
  //         transactionStatus: "completed",
  //       };
  //       if (extrapersiontheater > maxPeopletheater) {
  //         dataArray.extraPersonPrice = sessionStorage.getItem("extraPersonperprice");
  //       }

  //       try {
  //         const res = await axios.post(
  //           "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatebookingforPayment",
  //           dataArray,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  //         if (res.status === 200) {
  //           toast(res.data.message);
  //           sessionStorage.clear();
  //           sessionStorage.setItem("invoicePath", res.data.invoicePath);
  //           sessionStorage.setItem("orderId", res.data.orderId);
  //           navigateHome("/ThankYou");
  //         } 
  //       } catch (error) {
  //         if (error.response && error.response.status === 400) {
  //           toast.error(error.response.data.message);
  //           navigate("/PaymentFail"); // error PaymentFail
  //         } else if (error.response && error.response.status === 406) {
  //           toast.error(error.response.data.message);
  //           setTimeout(() => {
  //             navigate("/theaters");
  //           }, 2000); 
  //         }
  //       }

  //     },
  //     prefill: {
  //       name: sessionStorage.getItem("name"),
  //       email: sessionStorage.getItem("email"),
  //       contact: sessionStorage.getItem("phone"),
  //     },
  //     notes: {
  //       address: "",
  //     },
  //     theme: {
  //       color: "#015A65",
  //     },
  //   };
  //   const rzp1 = new window.Razorpay(options);
  //   rzp1.open();
  // };

  const [isAgreed, setIsAgreed] = useState(false); //  agree
  const handleAgree = (event) => {
    if (event.target.checked) {
      setIsAgreed(true);
    } else {
      setIsAgreed(false);
      toast.error("You must agree to the terms and conditions to proceed.");
    }
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
              className="shop-area pt-4 pb-5 p-relative lightest-back "
              style={{ background: "white" }}
            >
              <div className="container mx-auto p-4">
                <button
                  type="button"
                  className="btn mb-3 light-back shadow-sm text-light"
                  onClick={handleClick}
                  style={{
                    boxShadow: "none",
                    color: "black",
                    border: "none",
                  }}
                >
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>

                <div className="row">
                  <div className="col-12 ">
                    <div
                      className="shadow-sm lighter-back text-black p-4 d-flex flex-column"
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
                            className="btn  dark-back text-white"
                            style={{
                              boxShadow: "none",
                              color: "black",
                              border: "none",
                            }}
                            onClick={handleSubmit}
                            disabled={!isAgreed}
                          >
                            Confirm & Pay ₹750 to Reserve
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

export default ComboBooking;
