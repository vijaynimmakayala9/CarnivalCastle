import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { URLS } from "../Url";
import Modal from "react-bootstrap/Modal";
import Header from "./Header";
import Footer from "./Footer";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const navigateTheatres = useNavigate();

  const [form1, setForm1] = useState({});
  const [gst, setGst] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);

  const [lgShow, setLgShow] = useState(false);

  const modelshow = () => {
    setLgShow(false);
    addBooking();
  };

  const [policys, setpolicys] = useState([]);

  useEffect(() => {
    GetPoliciesData();
  }, []);

  const GetPoliciesData = () => {
    axios.post(URLS.GetPolicies, {}, {}).then((res) => {
      if (res.status === 200) {
        setpolicys(res.data.policy);
      }
    });
  };

  useEffect(() => {
    getOneGst();
  }, []);

  const getOneGst = async () => {
    try {
      const res = await axios.post(URLS.GetCharges, {});
      if (res.status === 200) {
        // setGst(Number(res.data.charges.bookingGst));
        setAdvanceAmount(Number(res.data.charges.advancePayment));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setGst(0);
      }
    }
  };

  const handleChange1 = (e) => {
    setForm1({
      ...form1,
      [e.target.name]: e.target.value,
    });
  };

  const add1 = async () => {
    const dataArray = {
      couponId: form1.couponCode,
      amount: productsValuePrice,
    };

    try {
      const res = await axios.post(URLS.GetCheckCoupon, dataArray);
      if (res.status === 200) {
        toast(res.data.message);
        sessionStorage.setItem("couponAmount", res.data.couponAmount);
        sessionStorage.setItem("coupon_Id", res.data.coupon_Id);
        const couponAmount = Number(res.data.couponAmount);
        const amount = Number(sessionStorage.getItem("totalprice"));
        const discount = amount - couponAmount;
        sessionStorage.setItem("Couponbutton", true);
        sessionStorage.setItem("coupondis", discount);
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast(error.response.data.message);
      }
    }
  };

  const formSubmit1 = (e) => {
    e.preventDefault();
    add1();
  };

  const productsValue = JSON.parse(sessionStorage.getItem("cart"));
  const userData = JSON.parse(sessionStorage.getItem("form"));
  console.log(userData);
  const productsValuePrice = Number(sessionStorage.getItem("totalprice"));
  const couponButton = sessionStorage.getItem("Couponbutton");
  const couponType = sessionStorage.getItem("coupon_Id");
  const couponDiscount = Number(sessionStorage.getItem("couponAmount"));
  console.log(couponDiscount);
  const totalPrices = Number(sessionStorage.getItem("coupondis"));

  const gstAmount = (totalPrices * gst) / 100;

  const [totalAmountOption, setTotalAmountOption] = useState("fullpayment");

  // Conditional total amount calculation
  const remainingAmount =
    totalAmountOption === "fullpayment" ? 0 : totalPrices - advanceAmount;

  const totalAmount = totalPrices;
  const remainingAmountFixed = remainingAmount.toFixed(2);
  const totalAmountFixed = totalAmount.toFixed(2);
  const displayedAdvanceAmount =
    totalAmountOption === "fullpayment" ? 0 : advanceAmount;

  const addBooking = async () => {
    const totalInPaise =
      totalAmountOption === "fullpayment"
        ? parseInt(totalAmountFixed) * 100
        : parseInt(advanceAmount) * 100;

    const options = {
      key: "rzp_test_HJG5Rtuy8Xh2NB",
      amount: totalInPaise,
      currency: "INR",
      name: "Carnival Castle",
      description: "Carnival Castle Transaction",
      image: "https://carnivalcastle.com/static/images/logo-text.webp",
      handler: async (response) => {
        const token = sessionStorage.getItem("token");

        const dataArrays = {
          transactionId: response.razorpay_payment_id,
          paymentType: totalAmountOption,
          transactionStatus: "completed",
          theatreId: sessionStorage.getItem("Theaterid"),
          planId: sessionStorage.getItem("PlanId"),
          occasionId: sessionStorage.getItem("OccationId"),
          userId: sessionStorage.getItem("UserId"),
          personName: userData.personName,
          userName: userData.name,
          userEmail: userData.email,
          userPhone: userData.phone,
          date: sessionStorage.getItem("date"),
          time: userData.timeSlot,
          type: userData.type,
          couponId: couponType,
          couponAmount: Number(couponDiscount),
          subTotal: Number(productsValuePrice),
          advancePayment: Number(displayedAdvanceAmount),
          remainingAmount: Number(remainingAmountFixed),
          totalPrice: Number(totalAmount),
          products: productsValue,
          // gst: Number(gst),
          noOfPersons: Number(userData.NoofPersons),
        };

        try {
          const res = await axios.post(URLS.AddBookings, dataArrays, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 200) {
            toast(res.data.message);
            navigate("/");
            sessionStorage.clear();
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            toast(error.response.data.message);
          }
        }
      },
      prefill: {
        name: sessionStorage.getItem("name"),
        email: sessionStorage.getItem("email"),
        contact: sessionStorage.getItem("phone"),
      },
      notes: {
        address: "",
      },
      theme: {
        color: "#015A65",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="home-page indexsix">
      <Header />
      <main className="main-wrapper">
        <section
          id="parallax"
          className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
          // style={{ backgroundImage: "url(img/bgss.jpg)" }}
          style={{ backgroundColor: "#AD3DF0" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                <div className="breadcrumb-wrap text-center">
                  <div className="breadcrumb-title mb-30">
                    <h1 style={{ color: "white" }}>Check Out</h1>
                  </div>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/">Home</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Check Out
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="content" style={{ background: "#F8EBFF" }}>
            <div className="container-md">
              <div className="row">
                <div className="col-md-12 col-lg-12">
                  <div className="card" style={{ background: "#F9F9F9" }}>
                    <div className="card-body">
                      <div className="info-widget">
                        <h3
                          className="card-title mb-3"
                          style={{ color: "#A020F0" }}
                        >
                          Booking Information
                        </h3>
                        <div className="row">
                          <div className="col-md-8 col-sm-12">
                            <div className="card">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-12 col-sm-12">
                                    <div className=" widget-profile pat-widget-profile">
                                      <div>
                                        <div className="pro-widget-content">
                                          <div className="profile-info-widget">
                                            <div className="profile-det-info">
                                              <h3>
                                                {sessionStorage.getItem("date")}
                                              </h3>
                                              <div className="customer-details">
                                                <h5>
                                                  <b>Time Slot :</b>{" "}
                                                  {userData.timeSlot}
                                                </h5>
                                                <h5 className="mb-0">
                                                  <i className="fas fa-user" />{" "}
                                                  {userData.NoofPersons}
                                                </h5>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="customer-info mb-3">
                                          <ul>
                                            <li>
                                              Name :{" "}
                                              <span>{userData.name}</span>
                                            </li>
                                            <li>
                                              Phone :{" "}
                                              <span>{userData.phone}</span>
                                            </li>
                                            <li>
                                              Email :{" "}
                                              <span>{userData.email}</span>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="row">
                                  <div className="customer-info col-md-6">
                                    <ul>
                                      <li>
                                        Theater Name :{" "}
                                        <span>
                                          {sessionStorage.getItem("theatreName")}
                                        </span>
                                      </li>
                                      <li>
                                      Occasion Name :{" "}
                                        <span>
                                          {sessionStorage.getItem("occasionName")}
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                  <div className="customer-info col-md-6">
                                    <ul>
                                      <li>
                                        Theatre Price :{" "}
                                        <span>
                                          {sessionStorage.getItem("theatrePrice")}
                                        </span>
                                      </li>
                                      <li>
                                        Occasion Price :{" "}
                                        <span>
                                          {sessionStorage.getItem(
                                            "occasionPrice"
                                          )}
                                        </span>
                                      </li>
                                      <li>
                                        offer Price :{" "}
                                        <span>
                                          {sessionStorage.getItem(
                                            "offerPrice"
                                          )}
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                </div> */}

                                <hr></hr>
                                <div>
                                  <div>
                                    <div className="table-responsive">
                                      <table className="table table-border tm-checkout-ordertable">
                                        <thead>
                                          <tr className="text-center">
                                            <th>S.No</th>
                                            <th>Product Name</th>
                                            <th>Product Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Price</th>
                                          </tr>
                                          <tr className="text-center">
                                            <td>1</td>
                                            <td style={{ fontWeight: "bold" }}>
                                              {sessionStorage.getItem(
                                                "theatreName"
                                              )}
                                            </td>
                                            <td>-</td>
                                            <td>
                                              {sessionStorage.getItem(
                                                "theatrePrice"
                                              )}
                                            </td>
                                            <td>
                                              {sessionStorage.getItem(
                                                "theatrePrice"
                                              )}
                                            </td>
                                          </tr>
                                          <tr className="text-center">
                                            <td>2</td>
                                            <td style={{ fontWeight: "bold" }}>
                                              {sessionStorage.getItem(
                                                "occasionName"
                                              )}
                                            </td>
                                            <td>-</td>
                                            <td>
                                              {sessionStorage.getItem(
                                                "occasionPrice"
                                              )}
                                            </td>
                                            <td>
                                              {sessionStorage.getItem(
                                                "occasionPrice"
                                              )}
                                            </td>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {productsValue?.map((data, index) => (
                                            <tr
                                              key={index}
                                              className="text-center"
                                            >
                                              <td>{index + 3}</td>
                                              <td>
                                                <h5
                                                  style={{ fontWeight: "bold" }}
                                                >
                                                  {data.name}
                                                </h5>
                                              </td>
                                              <td>
                                                {data.quantity}
                                                {data.type === "cake"
                                                  ? data.quantity === 500
                                                    ? "Gms"
                                                    : "Kg"
                                                  : ""}
                                              </td>
                                              <td>
                                                ₹{data.price}{" "}
                                                {data.type === "cake"
                                                  ? "/ 500 Gms"
                                                  : ""}
                                              </td>
                                              <td>
                                                {data.type === "cake"
                                                  ? data.quantity === 500
                                                    ? data.price
                                                    : data.price *
                                                      (2 * data.quantity)
                                                  : data.price * data.quantity}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>{" "}
                            </div>
                          </div>
                          <div className="col-md-4 col-lg-4 card">
                            <div className=" card-body">
                              <form onSubmit={formSubmit1}>
                                <div className="row">
                                  <div className="col-md-12">
                                    <h4
                                      className="card-title"
                                      style={{ color: "#A020F0" }}
                                    >
                                      Coupon
                                    </h4>
                                    <div className="payment-widget">
                                      <div className="row m-1">
                                        <div className="col-md-8 pt-3 col-12">
                                          <div
                                            className="card booking-card"
                                            style={{ background: "#fff" }}
                                          >
                                            <input
                                              className="form-control"
                                              type="text"
                                              onChange={handleChange1}
                                              placeholder="Apply Coupon"
                                              name="couponCode"
                                              value={form1.couponCode || ""}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4 col-12">
                                          {couponButton === "true" ? (
                                            <button
                                              disabled
                                              className="btn btn-secondary submit-btn mt-3"
                                              type="button"
                                            >
                                              Applied
                                            </button>
                                          ) : (
                                            <button
                                              type="submit"
                                              className="btn btn-primary submit-btn mt-3"
                                            >
                                              Apply
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                              <hr></hr>

                              <div style={{ width: "100%", float: "right" }}>
                                <h4
                                  className="card-title mt-4"
                                  style={{ color: "#A020F0" }}
                                >
                                  Payment
                                </h4>
                                <div
                                  className="booking-card"
                                  style={{ background: "#fff" }}
                                >
                                  <div className="">
                                    <div className="booking-summary">
                                      <div className="booking-item-wrap">
                                        <ul className="booking-fee">
                                          <li>
                                            Sub Total (Including GST)
                                            <span>
                                              ₹ {productsValuePrice} /-
                                            </span>
                                          </li>

                                          {/* <li>
                                            Gst({gst}%){" "}
                                            <span>
                                              {" "}
                                              + ₹{" "}
                                              {(
                                                (gst / 100) *
                                                productsValuePrice
                                              ).toFixed(2)}
                                            </span>
                                          </li> */}

                                          <li>
                                            Coupon Discount{" "}
                                            <span>
                                              - ₹{" "}
                                              {couponDiscount == null ? (
                                                <>0</>
                                              ) : (
                                                <>{couponDiscount}</>
                                              )}{" "}
                                              /-
                                            </span>
                                          </li>
                                          {totalAmountOption ===
                                          "fullpayment" ? (
                                            <></>
                                          ) : (
                                            <>
                                              <li>
                                                Total Amount
                                                <span>
                                                  ₹ <> {totalAmountFixed}</> /-
                                                </span>
                                              </li>
                                              <li>
                                                Advance Amount
                                                <span>
                                                  - ₹ {displayedAdvanceAmount}{" "}
                                                  /-
                                                </span>
                                              </li>
                                            </>
                                          )}
                                        </ul>
                                        <div className="row">
                                          <div className="col">
                                            <div className="form-check mt-3">
                                              <input
                                                className="form-check-input"
                                                type="radio"
                                                name="amountOption"
                                                id="fullpaymentOption"
                                                value="fullpayment"
                                                checked={
                                                  totalAmountOption ===
                                                  "fullpayment"
                                                }
                                                onChange={(e) =>
                                                  setTotalAmountOption(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                              <label
                                                className="form-check-label"
                                                htmlFor="fullpaymentOption"
                                              >
                                                <small>Full Amount: </small>
                                              </label>
                                            </div>
                                          </div>{" "}
                                          <div className="col pt-2">
                                            <div className="form-check mt-2">
                                              <input
                                                className="form-check-input"
                                                type="radio"
                                                name="amountOption"
                                                id="partialpaymentOption"
                                                value="partialpayment"
                                                checked={
                                                  totalAmountOption ===
                                                  "partialpayment"
                                                }
                                                onChange={(e) =>
                                                  setTotalAmountOption(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                              <label
                                                className="form-check-label "
                                                htmlFor="partialpaymentOption"
                                              >
                                                <small>Advance Amount</small>
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="booking-total">
                                          <ul className="booking-total-list">
                                            {totalAmountOption ===
                                            "fullpayment" ? (
                                              <>
                                                <li>
                                                  <span>Total Amount</span>
                                                  <span className="total-cost">
                                                    ₹{" "}
                                                    {totalAmountFixed ==
                                                    null ? (
                                                      <>0</>
                                                    ) : (
                                                      <>{totalAmountFixed}</>
                                                    )}{" "}
                                                    /-
                                                  </span>
                                                </li>
                                              </>
                                            ) : (
                                              <>
                                                <li>
                                                  <span>Final Amount</span>
                                                  <span className="total-cost">
                                                    ₹{" "}
                                                    {totalAmountFixed ==
                                                    null ? (
                                                      <>0</>
                                                    ) : (
                                                      <>
                                                        {remainingAmountFixed}
                                                      </>
                                                    )}{" "}
                                                    /-
                                                  </span>
                                                </li>
                                              </>
                                            )}
                                          </ul>
                                        </div>
                                        <div className="submit-section mt-5">
                                          <button
                                            type="button"
                                            className="btn btn-primary submit-btn"
                                            style={{ width: "100%" }}
                                            onClick={() => {
                                              setLgShow(true);
                                            }}
                                          >
                                            Check Out
                                          </button>
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
                    <div className="row">
                      <div className="col-6">
                        <div className="row mt-5">
                          <div className="col-12">
                            <div
                              className="text-center m-2"
                              style={{ float: "left" }}
                            >
                              <button
                                type="submit"
                                className="btn course-btn"
                                onClick={() => navigateTheatres("/theaters")}
                              >
                                <i className="far fa-arrow-alt-circle-left"></i>
                                <span> Back</span>
                              </button>
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
        </section>
      </main>

      <ToastContainer />

      <Modal
        size="xl"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="example-modal-sizes-title-lg"
            style={{ textAlign: "center" }}
          >
            Term & Conditions :{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-md-center">
            <div
              className="col-lg-12 mt-40"
              style={{ border: "1px solid white", background: "white" }}
            >
              {/* style={{ color: "#A020F0" }} */}
              <h4 className="p-4 ">
                <div
                  className="mt-2"
                  dangerouslySetInnerHTML={{
                    __html: policys.termsAndCondition,
                  }}
                ></div>
              </h4>
              <div className="text-center">
                <button
                  onClick={() => modelshow()}
                  type="button"
                  className="btn course-btn mb-3 text-center btn-outline"
                >
                  I Agree !
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
