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
        // block: "end",
        bottom: 0
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

  const [highlightInput, setHighlightInput] = useState(false);

  useEffect(() => {
    if (!additionalImagesRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHighlightInput(true);

            setTimeout(() => {
              setHighlightInput(false);
            }, 50000);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(additionalImagesRef.current);

    return () => observer.disconnect();
  }, [selectedOccasion]);

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
            {/* <section
              id="parallax"
              className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
            >
              <div className="container"></div>
            </section> */}
            <section
              className="shop-area pt-2 pb-5 p-relative lightest-back"
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
                                padding: "0",
                                transition:
                                  "background 0.3s ease, color 0.3s ease",
                              }}
                            >
                              <img
                                src={URLS.Base + ele.image}
                                alt="occasions images"
                                // className="rounded-circle img-fluid"
                                className="img-fluid rounded"
                                style={{
                                  height: "150px",
                                  width: "250px",
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
                              className={`form-control ${highlightInput ? "highlight-input" : ""}`}
                              placeholder="Special Person Name"
                              value={textFieldValue}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}
                      <style>
                        {`
                        .highlight-input{
                        border:2px solid #9D4DFF !important;
                        box-shadow:0 0 15px rgba(157,77,255,0.7);
                        animation:pulseGlow 1s ease-in-out infinite;
                      }

                      @keyframes pulseGlow{
                        0%{box-shadow:0 0 5px rgba(157,77,255,0.4);}
                        50%{box-shadow:0 0 20px rgba(157,77,255,0.9);}
                        100%{box-shadow:0 0 5px rgba(157,77,255,0.4);}
                      }
                        `}
                      </style>
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
                                          Decorations (
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


// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { ToastContainer, toast } from "react-toastify";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import Footer from "./Footer";
// import Header from "./Header";
// import { URLS } from "../Url";
// import axios from "axios";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import { useNavigate } from "react-router-dom";

// /* ── CarnivalCastle brand tokens ── */
// const C = {
//   bg      : "#F1E9FE",
//   lighter : "#E9DCFF",
//   mid     : "#9D4DFF",
//   dark    : "#4000BC",
//   midFill : "#C69FF4",
//   textDark: "#330C5F",
//   textMid : "#40008C",
//   warm    : "#FFFAFB",
// };

// /* ── Inline styles ── */
// const css = `
// @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

// .occ-page { font-family:'Outfit',sans-serif; background:${C.bg}; min-height:100vh; }

// /* occasion card */
// .occ-card {
//   cursor:pointer; border:2px solid ${C.midFill}; border-radius:12px;
//   padding:1rem; text-align:center;
//   background:linear-gradient(135deg,${C.warm},#BEBEBE);
//   transition: background .3s, box-shadow .3s, transform .2s, border-color .3s;
// }
// .occ-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(157,77,255,.18); }
// .occ-card.selected {
//   background:${C.midFill};
//   border-color:${C.dark};
//   box-shadow:0 8px 28px rgba(64,0,188,.22);
//   transform:translateY(-4px);
// }
// .occ-card img {
//   height:120px; width:120px; object-fit:cover;
//   border-radius:999px; margin-bottom:.5rem;
//   transition: transform .3s;
// }
// .occ-card:hover img, .occ-card.selected img { transform:scale(1.06); }
// .occ-card h6 { color:${C.textDark}; font-weight:600; margin:0; }

// /* summary sidebar */
// .summary-row { display:flex; justify-content:space-between; padding:6px 0; font-size:14px; }
// .summary-row + .summary-row { border-top:1px solid ${C.lighter}; }

// /* ── MODAL ── */
// .occ-modal-overlay {
//   position:fixed; inset:0; z-index:9999;
//   background:rgba(51,12,95,.45);
//   backdrop-filter:blur(6px);
//   display:flex; align-items:center; justify-content:center;
//   animation:fadeOverlay .22s ease;
// }
// @keyframes fadeOverlay { from{opacity:0} to{opacity:1} }

// .occ-modal {
//   background:${C.warm}; border-radius:24px;
//   padding:36px 32px 28px;
//   width:min(92vw,440px);
//   position:relative;
//   box-shadow:0 28px 70px rgba(64,0,188,.22), 0 4px 16px rgba(157,77,255,.12);
//   border:1.5px solid ${C.lighter};
//   animation:slideUp .28s cubic-bezier(.34,1.5,.64,1);
// }
// @keyframes slideUp { from{opacity:0;transform:translateY(32px) scale(.97)} to{opacity:1;transform:none} }

// .occ-modal-close {
//   position:absolute; top:14px; right:16px;
//   background:${C.bg}; border:1px solid ${C.lighter};
//   border-radius:50%; width:32px; height:32px;
//   display:flex; align-items:center; justify-content:center;
//   cursor:pointer; color:${C.textMid}; font-size:16px;
//   transition: background .2s;
// }
// .occ-modal-close:hover { background:${C.lighter}; }

// .occ-modal-stripe {
//   height:4px; border-radius:999px;
//   background:linear-gradient(90deg,${C.dark},${C.midFill});
//   margin-bottom:20px;
// }
// .occ-modal h5 {
//   font-weight:700; color:${C.textDark}; margin-bottom:4px; font-size:20px;
// }
// .occ-modal p { color:${C.midFill}; font-size:13px; margin-bottom:20px; }

// .occ-modal input {
//   width:100%; padding:11px 14px; border-radius:10px;
//   border:1.5px solid ${C.lighter};
//   font-family:'Outfit',sans-serif; font-size:14px; color:${C.textDark};
//   background:${C.bg}; outline:none;
//   transition:border-color .2s, box-shadow .2s;
// }
// .occ-modal input:focus {
//   border-color:${C.mid};
//   box-shadow:0 0 0 3px rgba(157,77,255,.12);
// }
// .occ-modal input::placeholder { color:${C.midFill}; }

// .occ-modal-hint { font-size:11.5px; color:#aaa; margin-top:7px; }

// .occ-modal-btn {
//   width:100%; margin-top:20px; padding:12px;
//   border:none; border-radius:12px;
//   background:linear-gradient(135deg,${C.dark},${C.mid});
//   color:#fff; font-family:'Outfit',sans-serif;
//   font-weight:700; font-size:14px; cursor:pointer;
//   box-shadow:0 5px 18px rgba(64,0,188,.3);
//   transition: transform .16s, box-shadow .16s;
//   display:flex; align-items:center; justify-content:center; gap:6px;
// }
// .occ-modal-btn:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(64,0,188,.4); }
// .occ-modal-btn:disabled { opacity:.45; cursor:not-allowed; transform:none; }

// .occ-preview {
//   display:flex; align-items:center; gap:12px;
//   background:${C.bg}; border-radius:12px; padding:10px 14px;
//   margin-bottom:18px; border:1px solid ${C.lighter};
// }
// .occ-preview img { width:44px; height:44px; border-radius:50%; object-fit:cover; }
// .occ-preview-name { font-weight:600; color:${C.textDark}; font-size:14px; }
// .occ-preview-price { font-size:12px; color:${C.mid}; }
// `;

// /* ── OccasionModal ── */
// function OccasionModal({ occasion, onClose, onProceed }) {
//   const [name, setName] = useState(sessionStorage.getItem("specialPersonName") || "");

//   const handleProceed = () => {
//     if (!name.trim()) { toast.error("Please enter the special person's name!"); return; }
//     sessionStorage.setItem("specialPersonName", name);
//     onProceed(name);
//   };

//   return (
//     <div className="occ-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className="occ-modal">
//         <button className="occ-modal-close" onClick={onClose}>×</button>
//         <div className="occ-modal-stripe" />

//         {/* occasion preview */}
//         <div className="occ-preview">
//           <img src={URLS.Base + occasion.image} alt={occasion.name} />
//           <div>
//             <div className="occ-preview-name">{occasion.name}</div>
//             <div className="occ-preview-price">₹{occasion.price || 0} added</div>
//           </div>
//         </div>

//         <h5>Who's the special person? 🎉</h5>
//         <p>We'll personalise the decoration just for them.</p>

//         <input
//           type="text"
//           placeholder="Enter name(s) e.g. Riya, Arjun"
//           value={name}
//           onChange={e => setName(e.target.value)}
//           onKeyDown={e => e.key === "Enter" && handleProceed()}
//           autoFocus
//         />
//         <div className="occ-modal-hint">Separate multiple names with a comma</div>

//         <button className="occ-modal-btn" onClick={handleProceed} disabled={!name.trim()}>
//           Proceed to Cakes →
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ── Main Component ── */
// const Occassions = () => {
//   const [isLoading, setIsLoading]             = useState(false);
//   const [isOpen, setIsOpen]                   = useState(window.innerWidth > 768);
//   const [occasions, setOccasions]             = useState([]);
//   const [selectedOccasion, setSelectedOccasion] = useState(
//     JSON.parse(sessionStorage.getItem("selectedOccasion")) || null
//   );
//   const [modalOccasion, setModalOccasion]     = useState(null); // occasion queued for modal

//   const navigate = useNavigate();

//   useEffect(() => {
//     const onResize = () => setIsOpen(window.innerWidth > 768);
//     window.addEventListener("resize", onResize);
//     GetOccasions();
//     GetTheatersData();
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   const GetTheatersData = () => {
//     axios.post(URLS.GetAllTheaters, {}).then(res => { if (res.status === 200) setIsLoading(false); });
//   };

//   const GetOccasions = () => {
//     axios.post(URLS.GetAllOccation, {}).then(
//       res  => { if (res.status === 200) setOccasions(res?.data?.occasions || []); },
//       err  => { if (err.response?.status === 400) setOccasions([]); }
//     );
//   };

//   /* clicking a card opens the modal */
//   const handleCardClick = (occ) => setModalOccasion(occ);

//   /* modal "Proceed" → save + API + navigate */
//   const handleModalProceed = (personName) => {
//     sessionStorage.setItem("occasionName",       modalOccasion.name);
//     sessionStorage.setItem("selectedOccasion",   JSON.stringify(modalOccasion));
//     sessionStorage.setItem("specialPersonName",  personName);

//     const prevOccPrice = parseFloat(sessionStorage.getItem("occprice") || 0);
//     const newOccPrice  = parseFloat(modalOccasion?.price || 0);
//     const subtotal     = parseFloat(sessionStorage.getItem("subtotal")    || 0) + newOccPrice - prevOccPrice;
//     const total        = parseFloat(sessionStorage.getItem("TotalPrice")  || 0) + newOccPrice - prevOccPrice;

//     sessionStorage.setItem("subtotal",    subtotal);
//     sessionStorage.setItem("TotalPrice",  total);
//     sessionStorage.setItem("occprice",    newOccPrice);

//     setSelectedOccasion(modalOccasion);
//     setModalOccasion(null);

//     axios.post(
//       "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updateocasion",
//       {
//         occasionId: modalOccasion._id,
//         personName,
//         subTotal:   subtotal,
//         totalPrice: total,
//         bookingId:  sessionStorage.getItem("bookingid"),
//       }
//     ).then(
//       res => {
//         if (res.status === 200)      navigate("/CakesComponent");
//         else if (res.status === 403) { toast.error("Access Denied."); navigate("/theaters"); }
//       },
//       err => { if (err.response?.status === 400) console.log(err.response); }
//     );
//   };

//   /* helpers for summary */
//   const ss   = (k, fallback = 0) => parseFloat(sessionStorage.getItem(k) || fallback);
//   const total = ss("theaterPrice") + ss("cakeprice") + ss("addons")
//               + parseFloat(selectedOccasion?.price || 0) - ss("couponAmount");

//   return (
//     <>
//       <style>{css}</style>

//       {isLoading ? (
//         <div style={{ background:"#1a1a1a", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
//           <img src="assets/img/gipss.gif" style={{ height:300 }} alt="Loading" />
//           <h6 style={{ color:"#fff", marginTop:12 }}>Loading...</h6>
//         </div>
//       ) : (
//         <div className="occ-page home-page indexsix">
//           <Header />

//           <main className="main-wrapper">
//             <section className="pt-2 pb-5 p-relative" style={{ background: C.bg }}>
//               <div className="container-fluid px-4">

//                 {/* Back */}
//                 <button
//                   className="btn text-light shadow-lg"
//                   style={{ background: C.mid }}
//                   onClick={() => navigate("/Basicplan")}
//                 >
//                   <i className="far fa-arrow-alt-circle-left me-2" />Back
//                 </button>

//                 {/* Heading */}
//                 <div className="text-center my-4">
//                   <h2 style={{ color: C.textDark, fontWeight: 700 }}>What's the celebration?</h2>
//                   <p style={{ color: C.textMid }}>Choose the occasion so we can set the perfect mood!</p>
//                 </div>

//                 <div className="container-fluid mt-2">
//                   <div className="row mb-4">

//                     {/* ── Left: Occasions ── */}
//                     <div className="col-md-8 rounded p-3" style={{ background: C.lighter }}>
//                       <h5 style={{ color: C.textDark, fontWeight: 700, marginBottom: 16 }}>Select Occasion</h5>

//                       <div className="row g-3">
//                         {occasions.map((occ, i) => (
//                           <div className="col-6 col-md-3" key={i}>
//                             <div
//                               className={`occ-card${selectedOccasion?._id === occ?._id ? " selected" : ""}`}
//                               onClick={() => handleCardClick(occ)}
//                             >
//                               <img src={URLS.Base + occ.image} alt={occ.name} />
//                               <h6>{occ.name}</h6>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Attention banner */}
//                       <div className="alert mt-3 mb-0" style={{ background: C.mid, color: "#fff", borderRadius: 10 }}>
//                         <i className="fa fa-exclamation-triangle me-2" />
//                         <b>ATTENTION:</b> Decoration cannot be customized.<br />
//                         <b>Note:</b> You can add multiple names by comma separated, if you have multiple special persons.
//                       </div>
//                     </div>

//                     {/* ── Right: Summary ── */}
//                     <div className="col-lg-4 col-md-4 mt-4 mt-md-0">
//                       <div className="position-sticky" style={{ top: 20 }}>

//                         {/* Total pill */}
//                         <div className="d-flex justify-content-between align-items-center rounded-3 p-3 mb-3"
//                           style={{ background: C.lighter, fontWeight: 700, color: C.textDark }}>
//                           <span>Total</span>
//                           <span style={{ color: C.dark, fontSize: 18 }}>₹{total}</span>
//                         </div>

//                         {/* Accordion summary */}
//                         <div className="rounded-3 overflow-hidden shadow-sm" style={{ background: "#fff" }}>
//                           <div className="accordion" id="summaryAccordion">
//                             <div className="accordion-item border-0">
//                               <h2 className="accordion-header">
//                                 <button
//                                   className="accordion-button"
//                                   style={{ background: C.bg, color: C.textDark, fontWeight: 600 }}
//                                   type="button"
//                                   data-bs-toggle="collapse"
//                                   data-bs-target="#summaryCollapse"
//                                   aria-expanded={isOpen}
//                                   onClick={() => setIsOpen(o => !o)}
//                                 >
//                                   Summary Details
//                                 </button>
//                               </h2>
//                               <div id="summaryCollapse" className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}>
//                                 <div className="accordion-body p-3" style={{ fontSize: 14 }}>
//                                   {[
//                                     [`Theatre (${sessionStorage.getItem("countPeople")} ppl)`, `₹${ss("theaterPrice")}`],
//                                     [`Decorations (${sessionStorage.getItem("occasionName") || "–"})`, `₹${selectedOccasion?.price || 0}`],
//                                     ["Cake",           `₹${ss("cakeprice")}`],
//                                     ["Addons",         `₹${ss("addons")}`],
//                                     ["Sub Total",      `₹${ss("theaterPrice") + ss("cakeprice") + ss("addons") + parseFloat(selectedOccasion?.price||0)}`],
//                                     ["Coupon Discount",`–₹${ss("coupondis")}`],
//                                     ["Total Amount",   `₹${total}`],
//                                   ].map(([label, val], i) => (
//                                     <div key={i} className="summary-row">
//                                       <span style={{ color: C.textMid }}>{label}</span>
//                                       <span style={{ fontWeight: 600, color: C.textDark }}>{val}</span>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Proceed (only active if occasion selected) */}
//                         <button
//                           className="btn w-100 mt-3 text-white"
//                           style={{
//                             background: selectedOccasion ? `linear-gradient(135deg,${C.dark},${C.mid})` : C.lighter,
//                             border: "none", borderRadius: 12, padding: "12px",
//                             fontWeight: 700, fontSize: 14,
//                             boxShadow: selectedOccasion ? `0 5px 18px rgba(64,0,188,.28)` : "none",
//                             color: selectedOccasion ? "#fff" : C.textMid,
//                             cursor: selectedOccasion ? "pointer" : "not-allowed",
//                             transition: "all .2s",
//                           }}
//                           disabled={!selectedOccasion}
//                           onClick={() => selectedOccasion && setModalOccasion(selectedOccasion)}
//                         >
//                           {selectedOccasion ? "Proceed to Cakes →" : "Select an Occasion First"}
//                         </button>
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </section>
//             <Footer />
//           </main>

//           <ToastContainer />

//           {/* ── Modal ── */}
//           {modalOccasion && (
//             <OccasionModal
//               occasion={modalOccasion}
//               onClose={() => setModalOccasion(null)}
//               onProceed={handleModalProceed}
//             />
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Occassions;