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

const CakesComponent = () => {
  const [IDS, setIDS] = useState([]);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768); // Open on desktop by default

  // const selectCakes = JSON.parse(sessionStorage.getItem("cartCakes")) || [];


  const [selectedCakes, setSelectedCakes] = useState(
    JSON.parse(sessionStorage.getItem("cartCakes")) || []
  );
  console.log(selectedCakes, "selectedCakes");
  const [isLoading, setIsLoading] = useState(false);
  const [normalCakes, setNormalCakes] = useState([]); // EGG
  const [premiumCakes, setPremiumCakes] = useState([]); // EGGLESS
  const [isEggless, setIsEggless] = useState(false); // Toggleeeee


  const [selectedCakesupdate, setSelectedCakesupdate] = useState([]); //  Select Cakes
  console.log(selectedCakes);
  console.log(selectedCakesupdate);
  const [addons, setAddons] = useState(
    JSON.parse(sessionStorage.getItem("adonsJSON")) || []
  );
  console.log(addons);

  const [newCakes, setNewCakes] = useState([]);
  console.log(newCakes);

  const additionalImagesRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    GetAllCakes();
  }, []);

  const GetAllCakes = () => {
    axios.post(URLS.GetGetAllCakes).then((res) => {
      if (res.status === 200) {
        const eggCakes = [
          ...(res?.data?.normalCakes?.filter(cake => cake.cakeType === "egg") || []),
          ...(res?.data?.premiumCakes?.filter(cake => cake.cakeType === "egg") || [])
        ];
        const egglessCakes = [
          ...(res?.data?.normalCakes?.filter(cake => cake.cakeType === "eggless") || []),
          ...(res?.data?.premiumCakes?.filter(cake => cake.cakeType === "eggless") || [])
        ];
        setNormalCakes(eggCakes);
        setPremiumCakes(egglessCakes);
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

  const combineCakes = isEggless ? premiumCakes : normalCakes;

  // Initialize CartCakes as an empty array by default
  const [CartCakes, setCartCakes] = useState(() => {
    const savedCartCakes = sessionStorage.getItem("cartCakes");
    return savedCartCakes ? JSON.parse(savedCartCakes) : [];
  });

  const [selectedWeights, setSelectedWeights] = useState(JSON.parse(sessionStorage.getItem("selectedWeights")) || {});
  console.log(selectedWeights)
  
  const handleImageClick = (cake, index) => {
    // const { _id } = cake;
    // setSelectedWeights((prevWeights) => ({
    //   ...prevWeights,
    //   [_id]: "500", // Default weight
    // }));
    console.log(cake)
    setSelectedWeights((prevWeights) => {
      const updatedWeights = {
        ...prevWeights,
        [cake._id]: "500",
      };
  
      // Store the updated weights in sessionStorage
      sessionStorage.setItem("selectedWeights", JSON.stringify(updatedWeights || "500"));
      return updatedWeights;
    });
    
  
    // Update selected cakes
    setSelectedCakes((prevSelectedCakes) => {
      console.log(prevSelectedCakes, "prevSelectedCakes");
  
      // Check if the cake is already selected based on _id
      const isSelected = prevSelectedCakes.some((selectedCake) => selectedCake._id === cake._id);
  
      // If the cake is already selected, remove it; otherwise, add it
      const newSelectedCakes = isSelected
        ? prevSelectedCakes.filter((selectedCake) => selectedCake._id !== cake._id)
        : [...prevSelectedCakes, cake];
  
      // Log the new selection
      console.log(newSelectedCakes, "newSelectedCakes");
  
      return newSelectedCakes;
    });
  };
  

  // const handleImageClick = (cake, index) => {
  //   setSelectedWeights((prevWeights) => ({
  //     ...prevWeights,
  //     [index]: "500", // Default weight when image is clicked
  //   }));
  //   // Retrieve cake price and total price from localStorage (initialize if not available)
  //   var cakeprice = parseFloat(sessionStorage.getItem("cakeprice")) || 0;
  //   var TotalPrice = parseFloat(sessionStorage.getItem("TotalPrice")) || 0;

  //   var subtotal = parseFloat(sessionStorage.getItem("subtotal")) || 0;


  //   // Toggle selected cakes
  //   setSelectedCakes((prevSelectedCakes) => {
  //     console.log(prevSelectedCakes, "prevSelectedCakes");

  //     if (prevSelectedCakes.includes(cake)) {
  //       TotalPrice = TotalPrice - cake.price;
  //       subtotal = subtotal - cake.price;
  //       var CouponData = JSON.parse(sessionStorage.getItem("CouponData"));
  //       if (CouponData) {
  //         if (CouponData.couponCodeType === "Percentage") {
  //           var discount = (subtotal * CouponData.couponAmount) / 100;
  //           sessionStorage.setItem("coupondis", discount);
  //           TotalPrice = subtotal - discount;
  //         }
  //       }
  //       // Deselect: update prices and remove from selectedCakes
  //       // sessionStorage.setItem("cakeprice", cakeprice - cake.price);
  //       // sessionStorage.setItem("TotalPrice", TotalPrice);
  //       // sessionStorage.setItem("subtotal", subtotal);
  //       const updcart = prevSelectedCakes.filter((item) => item._id !== cake._id);

  //       // console.log(updcart, "updcart");
  //       // sessionStorage.setItem("cartCakes", JSON.stringify(updcart));

  //       return updcart;
  //     } else {
  //       TotalPrice = TotalPrice + cake.price;
  //       subtotal = parseFloat(subtotal) + cake.price;
  //       var CouponData = JSON.parse(sessionStorage.getItem("CouponData"));

  //       if (CouponData) {
  //         if (CouponData.couponCodeType === "Percentage") {
  //           var discount = (subtotal * CouponData.couponAmount) / 100;
  //           sessionStorage.setItem("coupondis", discount);
  //           console.log("coupondis", discount);
  //           TotalPrice = subtotal - discount;
  //         }
  //       }

  //       // Select: update prices and add to selectedCakes
  //       // sessionStorage.setItem("cakeprice", cakeprice + cake.price);

  //       // sessionStorage.setItem("TotalPrice", TotalPrice);

  //       // sessionStorage.setItem("subtotal", subtotal);

  //       return [...prevSelectedCakes, cake];
  //     }
  //   });

  //   if (IDS.length > 0) {
  //     // Check if occasion._id is already in the IDS array of objects
  //     const index = IDS.findIndex((obj) => String(obj.id) === String(cake._id));

  //     if (index !== -1) {
  //       // Create a new array without the matched object
  //       const newIDS = [...IDS.slice(0, index), ...IDS.slice(index + 1)];
  //       setIDS(newIDS); // Update state
  //     } else {
  //       // If not found, push a new object with cake._id into the existing array
  //       setIDS([...IDS, { id: cake._id, price: cake.price, name: cake.name }]);
  //     }
  //   } else {
  //     // If IDS is empty, push an object with cake._id into the array
  //     setIDS([{ id: cake._id, price: cake.price, name: cake.name }]);
  //   }

  //   // Update CartCakes with add/remove logic
  //   setCartCakes((prevCartCakes) => {
  //     const cakeInCart = prevCartCakes.some(
  //       (item) => item._id === cake._id.toString()
  //     );

  //     if (cakeInCart) {
  //       // Deselect: remove cake from CartCakes
  //       const updatedCart = prevCartCakes.filter(
  //         (item) => item._id !== cake._id.toString()
  //       );
  //       // sessionStorage.setItem("cartCakes", JSON.stringify(updatedCart));
  //       return updatedCart;
  //     } else {
  //       // Select: add cake to CartCakes with default quantity
  //       const newCake = {
  //         id: cake._id.toString(),
  //         name: cake.name,
  //         quantity: "500", // Default quantity or based on user's input
  //         price: cake.price,
  //       };
  //       const updatedCart = [...prevCartCakes, newCake];
  //       setSelectedCakesupdate(updatedCart);
  //       // sessionStorage.setItem("cartCakes", JSON.stringify(updatedCart));
  //       return updatedCart;
  //     }
  //   });

  //   // Smooth scroll to additional images
  //   setTimeout(() => {
  //     additionalImagesRef.current?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //     });
  //   }, 200);
  // };


  const navigateCakes = useNavigate();
  const handleClick = () => {
    navigateCakes("/Occassions");
  };

  // const handleChange = (event, cake) => {
  //   const selectedWeight = event.target;
    
  //   setSelectedWeights((prevWeights) => ({
  //     ...prevWeights,
  //     [cake._id]: selectedWeight,
  //   }));
  // };
  


  const handleChange = async (event, index, cake) => {
    setCartCakes(JSON.parse(sessionStorage.getItem("cartCakes")));
    const { value } = event.target;
    const weightMultiplier = {
      500: 1,
      1: 2,
      2: 4,
      3: 6,
    };

    const selectedWeight = value || "500"; // Default to "500 gms" if no weight is selected
    const weightPriceMultiplier = weightMultiplier[selectedWeight] || 1;

    // Update the selected weight
    setSelectedWeights((prevWeights) => {
      const updatedWeights = {
        ...prevWeights,
        [cake._id]: selectedWeight,
      };
  
      // Store the updated weights in sessionStorage
      sessionStorage.setItem("selectedWeights", JSON.stringify(updatedWeights));
      return updatedWeights;
    });

    // Calculate the new price for the selected weight
    const newPrice = parseFloat(cake.price) * parseFloat(weightPriceMultiplier);

    // Retrieve the previous prices from local storage
    let cakeprice = parseFloat(sessionStorage.getItem("cakeprice") || 0);
    let TotalPrice = parseFloat(sessionStorage.getItem("TotalPrice") || 0);
    let subtotal = parseFloat(sessionStorage.getItem("subtotal") || 0);

    // Retrieve the previously selected weight for the current cake
    const prevWeight = selectedWeights[index] || "500";
    const prevMultiplier = weightMultiplier[prevWeight] || 1;
    const prevPrice = parseFloat(cake.price) * parseFloat(prevMultiplier);

    // Update the prices in local storage by subtracting the previous price and adding the new price
    cakeprice = cakeprice - parseFloat(prevPrice) + parseFloat(newPrice);
    TotalPrice = TotalPrice - prevPrice + newPrice;
    subtotal = subtotal - prevPrice + newPrice;

    var CouponData = JSON.parse(sessionStorage.getItem("CouponData"));
    if (CouponData) {
      if (CouponData.couponCodeType === "Percentage") {
        var discount = (subtotal * CouponData.couponAmount) / 100;
        sessionStorage.setItem("coupondis", discount);
        console.log("coupondis", discount);
        TotalPrice = subtotal - discount;
      }
    }

    // Set the updated prices back to local storage
    // sessionStorage.setItem("cakeprice", cakeprice);
    // sessionStorage.setItem("TotalPrice", TotalPrice);
    // sessionStorage.setItem("subtotal", subtotal);

    var cakes = JSON.parse(sessionStorage.getItem("cartCakes"));
    // Update the selected cake in the cart with the new weight and price
    setCartCakes((cakes) =>
      cakes.map((item) =>
        item.id === cake._id.toString()
          ? { ...item, quantity: selectedWeight, price: newPrice }
          : item
      )
    );
    const updatedCakes = await cakes.map((item) =>
      item.id === cake._id.toString()
        ? { ...item, quantity: selectedWeight, price: newPrice }
        : item
    );
    // Ensure the cart is updated in local storage
    setSelectedCakesupdate(updatedCakes);
    // sessionStorage.setItem("cartCakes", JSON.stringify(updatedCakes));
  };

  useEffect(() => {
    axios
      .post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/bookings/getallbookings",
        { bookingId: sessionStorage.getItem("bookingid") }
      )
      .then((res) => {
        console.log(res);
        // var subTotal=res.data.booking.subTotal;

        // console.log(subTotal,"subTotal");
        // var totalPrice=res.data.booking.totalPrice;
        // sessionStorage.setItem("subtotal",subTotal);
        // sessionStorage.setItem("TotalPrice",totalPrice);

        setNewCakes(res.data.booking.products);
        // setSelectedCakes(res.data.booking.products);
        setIDS(res?.data?.booking?.cakes || []); // NewOne
      });
  }, []);

  const totalPrice = selectedCakes.reduce((total, cake) => {
    const weight = selectedWeights[cake._id];
    const priceFactor = weight === "500" ? 1 : weight === "1" ? 2 : weight === "2" ? 4 : weight === "3" ? 6 : 1;
    return total + (cake.price * priceFactor);
  }, 0);
  

  
  const handleSubmit = async () => {

    sessionStorage.setItem("cartCakes", JSON.stringify(selectedCakes))
    sessionStorage.setItem("cartcakeslength", JSON.stringify(selectedWeights[selectedCakes.map((data)=>(data))._id]))
    sessionStorage.setItem("cakeprice", totalPrice)
    navigate("/AddOnscomponent");
  
    // const bodyData = {
    //   products: selectedCakes,
    //   subTotal: sessionStorage.getItem("subtotal"),
    //   cakes: JSON.stringify(IDS),
    //   // products : JSON.stringify(productMap),
    //   bookingId: sessionStorage.getItem("bookingid"),
    // };
    // axios
    //   .post(
    //     "https://api.carnivalcastle.com/v1/carnivalApi/web/booking/new/updatecakes",
    //     bodyData
    //   )
    //   .then(
    //     (res) => {
    //       if (res.status === 200) {
    //         navigate("/AddOns");
    //       }
    //     },
    //     (error) => {
    //       if (error.response && error.response.status === 400) {
    //         console.log(error.response);
    //         toast.error(error.response.message);
    //       } else if (error.response && error.response.status === 406) {
    //         toast.error(error.response.message);
    //         setTimeout(() => {
    //           navigate("/theaters");
    //         }, 2000);
    //       }
    //     }
    //   );
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
              className="shop-area pt-5 pb-5 p-relative bg-dark text-white"
              style={{ background: "white" }}
            >
              <div className="container">
                <button
                  type="button"
                  className="btn main-booknow"
                  onClick={handleClick}
                >
                  {" "}
                  <i className="far fa-arrow-alt-circle-left"></i> Back
                </button>
                <div className="row mb-4">
                  {/* Cakes Selection */}
                  <div className="col-md-8 ">
                    <div className="d-flex align-items-center m-3 ">
                      <h5 style={{ marginRight: "20px" }}>Select Cake</h5>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="egglessSwitch"
                          checked={isEggless}
                          onChange={() => setIsEggless(!isEggless)}
                        />
                        <label
                          className="form-check-label ms-2"
                          htmlFor="egglessSwitch"
                        >
                          {isEggless ? "Egg" : "Eggless"}
                        </label>
                      </div>
                    </div>
                    {/* <span style={{color:"red"}}>ATTENTION:The images presented are solely for display purposes. The actual cake may vary in appearance."</span> */}
                  </div>

                  {/* Cakes Display */}
                  <div className="col-lg-8 col-md-6 mx-auto gradient-border bg-light-grey ">
                    <div className="alert alert-warning m-3">
                      <i
                        className="fa fa-exclamation-triangle me-2"
                        style={{ color: "red" }}
                      ></i>
                      <span style={{ color: "red" }}>
                        <b>ATTENTION:</b> The images presented are solely for
                        display purposes. The actual cake may vary in
                        appearance."
                      </span>
                    </div>
                    <div className="row justify-content-center">
                      {combineCakes.map((cake, index) => (
                        <div
                          // className="col-lg-4 col-sm-12 col-12 mb-1 mt-2"
                          // className="col-6 col-md-3 mb-1 mt-3 text-center"
                          className="col-lg-4 col-sm-6 col-6 mb-1 mt-2"
                          key={index}
                        >
                          <div
                            className="card shadow-lg mx-auto"
                            style={{
                              // height: "74%",
                              height: "auto",
                              cursor: "pointer",
                              width: "90%",
                              position: "relative",
                              marginBottom: "12px",
                              cursor: "pointer",
                              border: "2px solid #F5E7B6",
                            }}
                            onClick={() => handleImageClick(cake, index)}
                          >
                            <img
                              src={URLS.Base + cake.image}
                              className="card-img-top"
                              alt={cake.name}
                              style={{
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />

                            <div
                              className={selectedCakes.some(
                                  (cake2) =>
                                    String(cake2._id) === String(cake._id)
                                )
                                  ? "card-body bg-dark text-white cakebackground"
                                  : "card-body bg-dark text-white"
                              }
                              // className="card-body bg-dark text-white "
                              // style={{
                              //   background:
                              //     selectedCakes.includes(cake) ||
                              //     newCakes.find(
                              //       (cartCake) =>
                              //         String(cartCake._id) === cake._id
                              //     )
                              //       ? "var(--gold-gradient) !important" // MILK
                              //       : "#212529", // dark
                              //   borderRadius: "3px",
                              // }}

                              // className=
                            >
                              <h6 className="card-title d-flex align-items-center">
                                {cake.name}
                                {isEggless && (
                                  <span
                                    className="badge bg-success ms-2"
                                    style={{
                                      position: "absolute",
                                      top: "10px",
                                      right: "10px",
                                    }}
                                  >
                                    Eggless
                                  </span>
                                )}
                                <img
                                  src={
                                    isEggless
                                      ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVR4nGNgGDZAdH6Fh9iCisfiCyv+k40XVPwTW1hxRnRBiTKGBWILyx9RZPhCFIuWYlgAk6QoFBaVWUEtOEoTC8QXVZiDzBBbUH6CJhZILqgwBluwsOIMSRaILSz3F1tYsV9sQcUXMF5Yvk98YYUPujrRReX60CC6QLQFYgsrOvBEaDOKGYsqdaBBdJkoC8QWVQYQSjESCyu84EE0v1IDEkTl14mzYEH5AcLJsnwPTL3IvFJVqPgt4ixYWP6ViHT/Aa5+boUSNIjuEemDii9E+OA9PIgWlstBLKh4SL0gWlCxG6ZeeE6pFFT8KbFB5E8wkheUecLVL6sUh/rgJVEWQIOpHY/rG5HVSi2sEIbGwRuiLQAB8UXlvmILKvaKLyj/LL6w4hMo5SAnTxgQnFnOjx7x1C3sVtXzQHxW/pkmFsisKuSExsE3mljAMDONFWrOL9pWOAsr7mKvMqlgidiC8gdiCytcKAqJQQUAHGz+5dhaYC0AAAAASUVORK5CYII="
                                      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABW0lEQVR4nN2VP0sDQRDF01gIgoWFYGGhCBaCxRWGS/LeXXKFihK/kljoF/FT+LcRLFIIFoKgaDTZPRUVEy0sjOSYO84YzWruQBzYZvYxP+bNsJvJ/JvwyXkNXGmy9dujyDcNVHzXnfwE0GS1n+L6I2izGyC47MuFQsEWwEEqAOU4c0Ed4DAVQN11LQFUfgTQjlPWwJ4GmsEhdxW51KnzXXc2sAg4MgZocuPLYQJrca0iZ6SDYyOAJld6bUwdWAz1NXJaACdmAGC/50oC26H+BpiSLTo17eDZAPAY6fP5Ccmfm3bQNAA8RBblcuOSv0zSoq1Qf2vbY2JRzQzgOGWDIS9E+mJxVPK+EUC6WP/mzVmNa69LpRHZojtjQDsUsKzJHQU0FPnU3pz4eoZx73nDnYNP9rEjhwTQSAVQzWYHpc5LKoCWZQ3IbF7T/nDOun+ZSUCAC016/Tjxt+IdjFUzfH0mcf4AAAAASUVORK5CYII="
                                  }
                                  style={{ width: "20px", height: "auto" }}
                                  className="ms-2"
                                  alt="icon"
                                />
                              </h6>
                            </div>
                          </div>
                          <div style={{ padding: "0px 15px 15px 15px" }}>
                            <select
                              className="form-select form-select-sm"
                              // disabled={!selectedCakes.length || !selectedCakes.includes(cake)}
                              disabled={
                                !selectedCakes.some(
                                  (cake2) =>
                                    String(cake2._id) === String(cake._id)
                                )
                              }
                              value={selectedWeights[cake._id] || "500"}
                              // value={
                              //   selectedCakes.includes(cake)
                              //     ? selectedWeights[index] ||
                              //       newCakes.find(
                              //         (cartCake) =>
                              //           String(cartCake._id) ===
                              //           String(cake._id)
                              //       )?.quantity
                              //     : "500"
                              // }
                              onChange={(event) =>
                                handleChange(event, index, cake)
                              }
                            >

                              {/* {cake?.cakelengths.map((data, index)=>(

                              <option key={index} value={data.value}>{data.value}</option>
                              ))} */}
                              <option value="500">500 gm</option>
                              <option value="1">1 kg</option>
                              <option value="2">2 kg</option>
                              <option value="3">3 kg</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="alert alert-warning mt-3">
                      <i
                        className="fa fa-exclamation-triangle me-2"
                        style={{ color: "red" }}
                      ></i>
                      <span style={{ color: "red" }}>
                        <b>Note :</b>
                        <div >
                               <span>Customized cakes must be ordered 3days Prior..</span><br/>
                               <span> For customized cakes plz contact us...</span>
                               </div>
                      </span>
                    </div>
                    <div className="alert alert-warning mt-3">
                      <i
                        className="fa fa-exclamation-triangle me-2"
                        style={{ color: "red" }}
                      ></i>
                      <span style={{ color: "red" }}>
                        <b>ATTENTION :</b> The images presented are solely for
                        display purposes. The actual cake may vary in
                        appearance.
                      </span>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="col-lg-4 col-md-5">
                    <div className="position-sticky" style={{ top: "20px" }}>
                      <div className="bg-light-grey mb-3">
                        <div className="card-body mt-3">
                          <div className="d-flex justify-content-between align-items-center shadow-none p-3 mb-2 rounded gradient-border">
                            <div>Total:</div>
                            <div>
                              ₹
                              {parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("occprice") || 0) + parseFloat(sessionStorage.getItem("addons")|| 0) + parseFloat(totalPrice || 0) - parseFloat(sessionStorage.getItem("couponAmount") || 0)}

                              {/* {(parseFloat(sessionStorage.getItem("theaterPrice")) + parseFloat(sessionStorage.getItem("addons")|| 0) + parseFloat(totalPrice)).toFixed(2)} */}
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
                                  aria-expanded={isOpen ? "true" : "false"} // Controlled by state
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
                                }`} // Conditional class for open state
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
                                      <div>Cakes:</div>
                                    </div>
                                    {selectedCakes.length === 0 ? (
                                      <div style={{ marginBottom: "8px" }}>
                                        No cakes in the cart
                                      </div>
                                    ) : (selectedCakes.map((cake, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          <div>
                                            {cake.name} (x {selectedWeights[cake._id] == "500"?selectedWeights[cake._id] + "Gm":selectedWeights[cake._id] + "Kg"})
                                          </div>
                                          <div>₹  {selectedWeights[cake._id] == "500"
                                                ? cake.price
                                                : selectedWeights[cake._id] ==1 ? cake.price * 2
                                                : selectedWeights[cake._id] == 2
                                                ?cake.price * 4
                                                : selectedWeights[cake._id] == 3
                                                ?cake.price * 6
                                                : 1 || 1}
                                            
                                            {/* {cake.price * selectedWeights[cake._id]} */}
                                            
                                            {/* {cake.quantity == "500"
                                              ? cake.price
                                              : cake.price} */}
                                          </div>
                                        </div>
                                      ))
                                    )}
                                    <hr />
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      <div>Addons</div>
                                      <div>{sessionStorage.getItem("addons")|| 0}</div>
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
                                        
                                        ₹
                                        {parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("occprice") || 0) + parseFloat(sessionStorage.getItem("addons")|| 0) + parseFloat(totalPrice || 0)}
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
                                        {parseFloat(sessionStorage.getItem("theaterPrice") || 0) + parseFloat(sessionStorage.getItem("occprice") || 0) + parseFloat(sessionStorage.getItem("addons")|| 0) + parseFloat(totalPrice || 0) - parseFloat(sessionStorage.getItem("couponAmount") || 0)}

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

export default CakesComponent;
