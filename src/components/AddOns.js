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

  const [isOpen, setIsOpen] = useState(window.innerWidth > 768); // Open on desktop by default

  const [isLoading, setIsLoading] = useState(false);
  
  const [addOns, setAddOns] = useState([]);
  const [IDS, setIDS] = useState([]);
  const [totalAmountOption, setTotalAmountOption] = useState({
    amountOption: "partialpayment", // Set this to "partialpayment" by default
  });

  const addonsprice = IDS.map((data) => data.price);
  const addonsvalue = addonsprice.reduce((acc, curr) => acc + curr, 0);



  const [onlines, setOnline] = useState("online");
  console.log(onlines);

  const [selectedOccasions, setSelectedOccasions] = useState(JSON.parse(sessionStorage.getItem("addonsData")) || []);
  // JSON.parse(sessionStorage.getItem("adonsJSON")) ||
  console.log(selectedOccasions);

  // const additionalImagesRef = useRef(null);



  const navigate = useNavigate();

  useEffect(() => {
  
    GetTheatersData();
    GetAddOns();
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

        // sessionStorage.setItem("addons", sum);
        sessionStorage.setItem("paymentkey", "partialpayment");     // updated
        //console.log(IDSvar, "IDS load124578");
      });
    //  sessionStorage.getItem("IDSvar")?JSON.parse(sessionStorage.getItem("IDSvar")):[];
    // console.log(IDSvar, "IDS load");
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
      setIsOpen(window.innerWidth > 768); // 768 mobile siz
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

  const [advanceAmount, setAdvanceAmount] = useState(0);
  console.log(advanceAmount);
  useEffect(() => {
    getOneGst();
  }, []);

  const getOneGst = async () => {
    try {
      const res = await axios.post(URLS.GetCharges, {});
      if (res.status === 200) {
        console.log(res.data.charges.advancePayment,"response");
        // setGst(Number(res.data.charges.bookingGst));
        setAdvanceAmount(Number(res.data.charges.advancePayment));
         sessionStorage.setItem('advancePayment',res.data.charges.advancePayment);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // setGst(0);
      }
    }
  }; 

  const handleCashOptionClick = (e) => {
    setOnline(e.target.value);
    //toast("Payment received via cash.")
    //history.push("/PendingBookings")
  };

  // const [totalAmountOption, setTotalAmountOption] = useState("fullpayment");


  const [totalAmountOption1, setTotalAmountOption1] = useState("");

  // const slecthandleChange = (e) => {
  //   const myChange = { ...totalAmountOption };
  //   myChange[e.target.name] = e.target.value;
  //   sessionStorage.setItem("paymentkey", e.target.value);
  //   setTotalAmountOption(myChange);
  //   if (e.target.value == "partialpayment") {
  //     const advanceamountkey =
  //       parseFloat(sessionStorage.getItem("TotalPrice")) -
  //       parseFloat(advanceAmount);
  //     setTotalAmountOption1(advanceamountkey);
  //     // sessionStorage.setItem("TotalPrice2", advanceamountkey);
  //     sessionStorage.setItem("advancePayment", parseFloat(advanceAmount));
  //   } else {
  //     const advanceamountkey = parseFloat(sessionStorage.getItem("TotalPrice"));
  //     setTotalAmountOption1(advanceamountkey);
  //     // sessionStorage.setItem("TotalPrice2", advanceamountkey);
  //   }
  // };

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

  const handleImageClick = (occasion) => {
    console.log(occasion.price);
    var addons = sessionStorage.getItem("addons");
    var TotalPrice = sessionStorage.getItem("TotalPrice");

    // totalAmountOption !== "fullpayment"
    //   ? remainingAmountFixed
    //   : totalAmountFixed;

    var subtotal = sessionStorage.getItem("subtotal");

    setSelectedOccasions((prevSelected) => {

      const isSelected = prevSelected.some(soccasion=>occasion._id===soccasion._id);

      console.log(isSelected,"isSelectednoone");
      console.log(occasion,"occasion");
      console.log(prevSelected,"prevSelected");

      if (isSelected) {
        // sessionStorage.setItem("addons", parseFloat(addons) - occasion.price);
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
        // sessionStorage.setItem("TotalPrice", TotalPrice);
        // sessionStorage.setItem("subtotal", subtotal);
        console.log(isSelected);
        return prevSelected.filter(soccasion=>occasion._id!==soccasion._id);
      } else {
        // sessionStorage.setItem("addons", occasion.price + parseFloat(addons));
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
      
        // sessionStorage.setItem("TotalPrice", parseFloat(TotalPrice));
        return [...prevSelected, occasion];
      }
    });

    if (IDS.length > 0) {
      const index = IDS.findIndex(
        (obj) => String(obj.id) === String(occasion._id)
      );

      if (index !== -1) {
        // Create a new array without the matched object
        const newIDS = [...IDS.slice(0, index), ...IDS.slice(index + 1)];
        setIDS(newIDS); // Update state
      } else {
        // If not found, push a new object with occasion._id into the existing array
        setIDS([
          ...IDS,
          { id: occasion._id, price: occasion.price, name: occasion.name },
        ]);
      }
    } else {
      // If IDS is empty, push an object with occasion._id into the array
      setIDS([
        { id: occasion._id, price: occasion.price, name: occasion.name },
      ]);
    }

    console.log(selectedOccasions, "selectedOccasions");

    // sessionStorage.setItem("adonsJSON", JSON.stringify(selectedOccasions));
    // sessionStorage.setItem("adonsJSON", JSON.stringify([...selectedOccasions, occasion]));

    // setTimeout(() => {
    //   additionalImagesRef?.current?.scrollIntoView({
    //     behavior: "smooth",
    //     block: "start",
    //   });
    // }, 200);
  };

  const totalPrice = selectedOccasions.reduce((total, item) => total + item.price, 0);


  const handleSubmit = () => {
    const productMap = selectedOccasions.map((e, i) => {
      return {
        _id: e._id,
        name: e.name,
        type: "other",
        price: e.price,
        quantity: 1,
      };
    });
    const bodyData = {
      products: productMap,
      // products: JSON.stringify(productMap),
      addons: JSON.stringify(IDS),
      subTotal: sessionStorage.getItem("subtotal"),
      bookingId: sessionStorage.getItem("bookingid"),
    };
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updateaddons",
        bodyData
      )
      .then(
        (res) => {
          console.log(res.status,"res.status");
          if (res.status === 200) {
            navigate("/BookingSummary");
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
            toast.error(error.response.message)
          } else if (error.response && error.response.status === 406) {
           
            toast.error(error.response.message);
            setTimeout(()=>{
              navigate("/theaters");
            }, 2000)
          }
        }
      );
    sessionStorage.setItem("addonsData", JSON.stringify(selectedOccasions) || []);
    sessionStorage.setItem("addons", totalPrice)
  };

  const navigateCakes = useNavigate();
  const handleClick = () => {
    navigateCakes("/CakesComponent");
    // window.location.reload();
  };

  const cakecartdata = JSON.parse(sessionStorage.getItem("cartCakes"));
  const cakepricedata = cakecartdata.map((data) => data.price);
  const cakevalue = cakepricedata.reduce((acc, curr) => acc + curr, 0);

  const advanceAmount1 =
  totalAmountOption.amountOption === "partialpayment"
    ? displayedAdvanceAmount
    : 0;
const totalPrice1 = parseFloat(sessionStorage.getItem("TotalPrice")) || 0;


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
              className="shop-area pt-5 pb-5 p-relative bg-dark text-white "
              style={{ background: "white" }}
            >
              <div className="container">
                <button
                  type="button"
                  class="btn main-booknow"
                  onClick={handleClick}
                >
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>
                <div className="container mt-4">
                  <div className="row mb-4">
                    {/* Occasions */}
                    {/* <div className="col-md-8 shadow-lg"> */}
                    <div className="col-md-8 bg-light-grey gradient-border">
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
                                      border:"2px solid #E9BE5F",
                                      borderRadius: "10px",
                                      background: selectedOccasions?.some(
                                        (addIds) =>
                                          addIds._id === String(ele._id)
                                      )
                                        ? "var(--gold-gradient)"
                                        : "transparent",
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
                                        // className="rounded-circle img-fluid"
                                          className="img-fluid"
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
                       <div className="alert alert-warning mt-3">
                      <i className="fa fa-exclamation-triangle me-2" style={{ color: 'red' }}></i>
                           <span style={{ color: 'red' }}><b>Note:</b>The timing of the photography sessions is subject to the availability of our photographers. We strive to accommodate your preferred schedule and appreciate your understanding and flexibility. For specific booking inquiries, please contact us directly.</span>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="col-lg-4 col-md-5">
                      <div className="position-sticky" style={{ top: "20px" }}>
                        <div className="bg-light-grey mb-3">
                          <div className="card-body mt-3">
                            <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded gradient-border">
                              <div>Total:</div>
                              <div>₹

                              {parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("cakeprice") || 0) + parseFloat(sessionStorage.getItem("occprice") || 0) + (parseFloat(totalPrice || 0)) - parseFloat(sessionStorage.getItem("couponAmount") || 0)}

                              {/* {(parseFloat(sessionStorage.getItem("theaterPrice")) + parseFloat(sessionStorage.getItem("cakeprice")) + parseFloat(totalPrice)).toFixed(2)} */}
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
                                  className={`accordion-collapse collapse ${isOpen ? "show" : ""}`} // Conditional class for open state
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
                                          {sessionStorage.getItem("countPeople")}{" "}
                                          ppl)
                                        </div>
                                        <div>
                                          ₹
                                          {sessionStorage.getItem("theaterPrice")}
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

                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                          marginTop: "8px",
                                        }}
                                      >
                                        ₹ {totalPrice || 0}
                                        {/* ₹ {addonsvalue || 0} */}
                                      </div>

                                      <hr />
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
                                          ₹{sessionStorage.getItem("occprice")}
                                        </div>
                                      </div>
                                      <hr />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div> Cake</div>
                                        <div>₹ {sessionStorage.getItem(
                                              "cakeprice"
                                            ) || 0}</div>
                                        {/* <div>₹{cakevalue}</div> */}
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
                                          ₹ {parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("cakeprice") || 0) + parseFloat(sessionStorage.getItem("occprice") || 0) + (parseFloat(totalPrice || 0))}

                                          {/* {parseFloat(sessionStorage.getItem("TotalPrice")) + parseFloat(sessionStorage.getItem("cakeprice")) + parseFloat(totalPrice) + parseFloat(sessionStorage.getItem("couponAmount"))} */}
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
                                          ₹ {parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("cakeprice") || 0) + parseFloat(sessionStorage.getItem("occprice") || 0) + (parseFloat(totalPrice) || 0) - parseFloat(sessionStorage.getItem("couponAmount") || 0)}

                                        </div>
                                        {/* {totalAmountOption.amountOption ===
                                        "partialpayment" ? (
                                          <div>
                                             ₹{parseFloat(sessionStorage.getItem("TotalPrice")) + parseFloat(sessionStorage.getItem("cakeprice")) + parseFloat(totalPrice)}/-
                                       
                                          </div>
                                        ) : (
                                          parseFloat(sessionStorage.getItem("TotalPrice"))  + parseFloat(sessionStorage.getItem("cakeprice")) + parseFloat(totalPrice)
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
                                              <small>Advance Amount</small>
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
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <div>Advance Amount</div>
                                          <div>
                                            ₹{displayedAdvanceAmount}/-
                                          </div>
                                        </div>
                                      )}

                                    </div>
                                    <hr />
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div>Remaining Amount</div>
                                      ₹ {parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("cakeprice") || 0) + parseFloat(sessionStorage.getItem("occprice")|| 0) + (parseFloat(totalPrice) || 0) - (parseFloat(sessionStorage.getItem("couponAmount") || 0) +  parseFloat(displayedAdvanceAmount || 0))}

                                      {/* {totalAmountOption.amountOption ===
                                      "partialpayment" ? (
                                        <div>₹{remainingAmount1}/-</div>
                                      ) : (
                                        <div>₹{totalPrice1}/-</div>
                                      )} */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
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
