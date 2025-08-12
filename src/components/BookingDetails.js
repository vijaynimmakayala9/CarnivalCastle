import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Galleria } from "primereact/galleria";
import { Dialog } from "primereact/dialog";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";

function Theaters() {
  const navigate = useNavigate();
  const navigateTheatres = useNavigate();

  const [lgShow, setLgShow] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [Theaters, setTheaters] = useState([]);
  const [TheatersFeatures, setTheatersFeatures] = useState([]);

  const [form, setform] = useState({
    timeSlot: "",
    type: "",
    personName: "",
    occasionid: "",
    planId: "",
    categoryId: "",
    NoofPersons: "",
  });

  const formselectRef = useRef(null);

  const [SlotCount, setSlotCount] = useState([]);

  const [date, setDate] = useState([]);

  const [Theatersslots, setTheatersslots] = useState([]);

  const [shows, setshows] = useState(false);

  const [Occation, setOccation] = useState([]);
  const [Occasionsselect, setOccasionsselect] = useState(false);
  const [Occationprice, setOccationprice] = useState("");

  const PlanRef = useRef(null);
  const [Plans, setPlans] = useState([]);
  const [Planprice, setplanprice] = useState("");

  const [Plansselect, setPlansselect] = useState(false);
  const PlanBenifitsRef = useRef(null);

  const productSectionRef = useRef(null);
  const [Product, setProduct] = useState([]);
  const [Cakes, setCakes] = useState([]);
  const [PlanProduct, setPlanProduct] = useState([]);

  const [images, setImages] = useState([]);

  const [selectedOccasion, setSelectedOccasion] = useState(null);

  var totalCartPrice = 0;
  const handleOccasionClick = (data, i) => {
    OccationId(data, i);

    setSelectedOccasion(i);
    sessionStorage.setItem("PlanId", null);

    totalCartPrice = calculateTotalPrice() + data.price;
    setPlansselect(false);
    setform((prevForm) => ({
      ...prevForm,
      planId: "",
    }));
    setplanprice(0);
  };

  const [cart, setCart] = useState([]);

  const maxOptions =
    Theaters.extraPerson == "Yes"
      ? Number(Theaters.maxSeating)
      : Theaters.maxPeople;

  const options = [];
  for (let i = 1; i <= maxOptions; i++) {
    options.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const handlechange = (e) => {
    const myform = { ...form };
    myform[e.target.name] = e.target.value;
    setform(myform);
    console.log(form);
  };

  const [extra, setextra] = useState([]);

  const handlePersons = (e) => {
    const myform = { ...form };

    var maxprice = 0;
    if (Theaters.extraPerson == "Yes") {
      if (Number(e.target.value) > Number(Theaters.maxPeople)) {
        const people = Number(e.target.value) - Number(Theaters.maxPeople);
        maxprice = Number(people) * Theaters.extraPersonprice;
      }
      setextra(maxprice);
      myform[e.target.name] = e.target.value;
    } else {
      if (e.target.value <= Theaters.maxPeople) {
        setextra(maxprice);
        myform[e.target.name] = e.target.value;
      } else {
        myform[e.target.name] = null;
        setextra(maxprice);
      }
    }
    setform(myform);
  };

  const getid = sessionStorage.getItem("Theaterid");

  //TheatersById
  const GetOneTheaterData = () => {
    axios.post(URLS.GetByOneTheater, { id: getid }, {}).then(
      (res) => {
        if (res.status === 200) {
          setTheaters(res?.data?.theatre);
          setImages(res?.data?.theatre?.image);
          setTheatersFeatures(res?.data?.theatre?.features);
          setIsLoading(false);
        }
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          setTheaters([]);
          setImages([]);
          setTheatersFeatures([]);
        }
      }
    );
  };

  useEffect(() => {
    GetOneTheaterData();
    GetOccation();
    SlotsData();
    setDate(sessionStorage.getItem("date"));
  }, []);

  //Slots
  const SlotsData = () => {
    axios
      .post(
        URLS.GetByOneSlot,
        {
          theatreId: getid,
          slotDate: date ? sessionStorage.getItem("date") : date,
        },
        {}
      )
      .then(
        (res) => {
          if (res.status === 200) {
            setTheatersslots(res?.data?.slots);
            setSlotCount(res?.data?.falseCount);
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            setTheatersslots([]);
          }
        }
      );
  };

  //Occation
  const GetOccation = () => {
    axios.post(URLS.GetAllOccation, {}, {}).then(
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

  //OccationByPlans
  const OccationId = (data, i) => {
    setOccasionsselect(i);
    GetOneCategoryByIdProduct();

    setform((prevForm) => ({
      ...prevForm,
      occasionid: data._id,
    }));

    sessionStorage.setItem("OccationId", data._id);
    sessionStorage.setItem("occasionName", data.name);
    sessionStorage.setItem("occasionPrice", data.price);

    if (form.type == "combo") {
      // PlanRef?.current?.scrollIntoView({
      //   behavior: "smooth",
      //   block: "start",
      // });
      // GetOccationById
      axios
        .post(URLS.GetOccationById, { occasionId: data._id, theatreId: getid })
        .then(
          (res) => {
            if (res.status === 200) {
              setPlans(res?.data?.plans);
              setPlanProduct([]);
            }
          },
          (error) => {
            if (error.response && error.response.status === 400) {
              setPlans([]);
            }
          }
        );
    } else {
      setOccationprice(data.price);
    }
  };

  //PlanCategoriesId
  const PlanCategoriesId = (data, i) => {
    setPlansselect(i);
    PlanBenifitsRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setplanprice(data.offerPrice);

    setform((prevForm) => ({
      ...prevForm,
      planId: data._id,
    }));

    sessionStorage.setItem("PlanId", data._id);

    axios.post(URLS.GetByPlanIdProducts, { planId: data._id }).then(
      (res) => {
        if (res.status === 200) {
          setPlanProduct(res?.data?.planProducts);
        }
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          setPlanProduct([]);
        }
      }
    );
  };

  const GetOneCategoryByIdProduct = () => {
    axios.post(URLS.GetAllProducts, {}, {}).then(
      (res) => {
        if (res.status === 200) {
          setProduct(res?.data?.products);
        }
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          setProduct([]);
        }
      }
    );

    axios.post(URLS.GetGetAllCakes, {}, {}).then(
      (res) => {
        if (res.status === 200) {
          setCakes(res?.data?.products);
        }
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          setCakes([]);
        }
      }
    );
  };

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectedQuantity, setselectedQuantity] = useState();

  const handleCountUp = (
    array,
    setArray,
    index,
    quantity,
    type,
    serviceType
  ) => {
    let actionType;

    switch (type) {
      case "add":
        actionType = "add";
        break;
      case "minus":
        actionType = "minus";
        break;
      case "reset":
        actionType = "reset";
        break;
      default:
        actionType = "add";
    }
    var cka = "";
    if (serviceType == "cake") {
      cka = selectedValues?.cakevalue || 500;
    }
    addToCart(array[index], actionType, serviceType, cka);
  };

  const [selectedValues, setSelectedValues] = useState({});

  const handleCakeQuantity = (
    array,
    setArray,
    index,
    quantity,
    type,
    serviceType,
    e
  ) => {
    // Update the selectedValues state with the selected value for the specific index
    const updatedValues = { ...selectedValues, [index]: e.target.value };
    setSelectedValues(updatedValues);

    sessionStorage.setItem(`cakequantity_${index}`, e.target.value);

    console.log(`Selected value for index ${index}:`, e.target.value);

    let actionType;
    setselectedQuantity(e.target.value);

    if (e.target.value === "") {
      actionType = "reset";
    } else if (parseInt(e.target.value) > 0) {
      actionType = "add";
    } else {
      actionType = "minus";
    }

    const cartValue = e.target.value;
    addToCart(array[index], actionType, serviceType, cartValue);
  };

  useEffect(() => {
    let formCart = JSON.parse(sessionStorage.getItem("form")) || [];
    setform(formCart);
    let show = JSON.parse(sessionStorage.getItem("shows"));
    setshows(show);

    if (formCart.type === "combo") {
      axios
        .post(URLS.GetOccationById, {
          occasionId: formCart.occasionid,
          theatreId: sessionStorage.getItem("Theaterid"),
        })
        .then(
          (res) => {
            if (res.status === 200) {
              setPlans(res?.data?.plans);
              axios
                .post(URLS.GetByPlanIdProducts, { planId: formCart.planId })
                .then(
                  (res) => {
                    if (res.status === 200) {
                      setPlanProduct(res?.data?.planProducts);
                    }
                  },
                  (error) => {
                    if (error.response && error.response.status === 400) {
                      setPlanProduct([]);
                    }
                  }
                );
              setPlanProduct([]);
            }
          },
          (error) => {
            if (error.response && error.response.status === 400) {
              setPlans([]);
            }
          }
        );
    }

    if (formCart.occasionid != null) {
      axios.post(URLS.GetAllProducts, {}, {}).then(
        (res) => {
          if (res.status === 200) {
            setProduct(res?.data?.products);
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            setProduct([]);
          }
        }
      );

      axios.post(URLS.GetGetAllCakes, {}, {}).then(
        (res) => {
          if (res.status === 200) {
            setCakes(res?.data?.products);
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            setCakes([]);
          }
        }
      );
    }
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      sessionStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item, type, serviceType, cartValue) => {
    console.log(type, "itemtype");
    console.log(item);
    console.log(serviceType, "serviceType");

    const updatedCart = [...cart];
    const itemIndex = getObjectById(cart, item._id, serviceType);

    if (itemIndex !== null) {
      if (serviceType === "cake") {
        const quantity = cartValue ? parseInt(cartValue) : 500;
        console.log(quantity, "quantity");

        updatedCart[itemIndex] = {
          ...updatedCart[itemIndex],
          quantity: quantity,
        };

        if (updatedCart[itemIndex].quantity === 0) {
          updatedCart.splice(itemIndex, 1);
        }
      } else {
        updatedCart[itemIndex] = {
          ...updatedCart[itemIndex],
          quantity:
            type === "add"
              ? updatedCart[itemIndex].quantity + 1
              : updatedCart[itemIndex].quantity - 1,
        };

        if (updatedCart[itemIndex].quantity === 0) {
          updatedCart.splice(itemIndex, 1);
        }
      }

      setCart(updatedCart);
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const newCartItem = {
        id: item._id,
        name: item.name,
        price: item.price,
        quantity:
          serviceType === "cake" ? (cartValue ? parseInt(cartValue) : 500) : 1,
        type: serviceType,
      };

      const newCart = [...cart, newCartItem];
      setCart(newCart);
      sessionStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  const removeFromCart = (itemId, serviceType) => {
    const updatedCart = cart.filter(
      (cartItem) => cartItem.id !== itemId || cartItem.type !== serviceType
    );

    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const toggleSelection = (itemId, index, quantity, serviceType) => {
    const updatedSelectedItems = new Set(selectedItems);

    if (updatedSelectedItems.has(itemId)) {
      updatedSelectedItems.delete(itemId);
      handleCountUp(Product, setProduct, index, quantity, "minus", serviceType);

      removeFromCart(itemId, serviceType);
    } else {
      updatedSelectedItems.add(itemId);
      handleCountUp(Product, setProduct, index, quantity, "add", serviceType);

      addToCart(Product[index], "add", serviceType, selectedQuantity);
    }
    setSelectedItems(updatedSelectedItems);
  };

  const calculateTotalPrice = () => {
    let total = 0;

    if (cart.length > 0) {
      total = cart.reduce((total, item) => {
        if (item.type == "cake") {
          var price =
            item.quantity == "500"
              ? item.price
              : item.price * (2 * item.quantity);
          console.log(price);
          return total + price;
        } else {
          return total + item.price * item.quantity;
        }
      }, 0);
    }
    if (form.type === "combo") {
      total = Planprice;
    } else if (form.type === "normal") {
      total +=
        Number(Occationprice) + Number(Theaters.offerPrice) + Number(extra);
    }
    return total;
  };

  totalCartPrice = calculateTotalPrice();

  sessionStorage.setItem("totalprice", totalCartPrice);

  sessionStorage.setItem("coupondis", totalCartPrice);

  function getObjectById(array, targetId, serviceType) {
    var i = 0;
    //console.log(serviceType, "serviceType");
    for (const obj of array) {
      //  console.log(obj.type, "obj.type");

      if (obj.id === targetId) {
        console.log(i, "Add Ons");
        return i;
      }
      i++;
    }
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    AddBooking();
  };

  const AddBooking = () => {
    navigate("/Checkout");
    sessionStorage.setItem("form", JSON.stringify(form));
    sessionStorage.setItem("date", date);
  };

  const [visible, setVisible] = useState(false);

  const handlechanges = (e) => {
    const myform = { ...form };
    myform[e.target.name] = e.target.value;
    setOccasionsselect(false);
    GetOneTheaterData();
    setform(myform);
    setshows(true);
    sessionStorage.setItem("shows", true);
    formselectRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const responsiveOptions = [
    {
      breakpoint: "991px",
      numVisible: 4,
    },
    {
      breakpoint: "767px",
      numVisible: 3,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ];

  const thumbnailTemplate = (item) => {
    return (
      <>
        <img
          src={URLS.Base + item}
          alt={item.alt || "Image"}
          style={{ display: "block", width: "100%" }}
        ></img>
      </>
    );
  };

  const convertTo12HourFormat = (time24) => {
    const [hours, minutes] = time24.split(":");
    let hours12 = hours % 12 || 12;
    const period = hours < 12 ? "AM" : "PM";
    return `${hours12}:${minutes} ${period}`;
  };

  const handleDate = (e) => {
    setDate(e.target.value);
    const dateString = e.target.value;
    axios
      .post(
        URLS.GetByOneSlot,
        {
          theatreId: getid,
          slotDate: dateString,
        },
        {}
      )
      .then(
        (res) => {
          if (res.status === 200) {
            setTheatersslots(res?.data?.slots);
            setSlotCount(res?.data?.falseCount);
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            setTheatersslots([]);
          }
        }
      );
  };

  const handleMobile = (e) => {
    const myform = { ...form };
    myform[e.target.name] = e.target.value;
    setform(myform);
    if (e.target.value.length == 10 || e.target.value.length == "10") {
      const dataArray = {
        theatreId: getid,
        date: date,
        time: form.timeSlot,
        name: form.name,
        email: form.email,
        phone: e.target.value,
      };

      axios.post(URLS.AddLead, dataArray).then(
        (res) => {
          if (res.status === 200) {
            console.log("");
          }
        },
        (error) => {
          if (error.response && error.response.status === 400) {
            console.log("");
          }
        }
      );
    }
  };

  const handleTimeSlot = (e) => {
    const myform = { ...form };
    myform[e.target.name] = e.target.value;
    setform(myform);

    console.log(e.target.value);
    if (
      e.target.value == "16:00 / 17:30" ||
      e.target.value == "16:30 / 18:00"
    ) {
      setLgShow(true);
    }
  };

  const handleclose = () => {
    setLgShow(false);
  };

  return (
    <>
      {isLoading == true ? (
        <>
          <div
            className="text-center"
            style={{
              // background:
              //   "linear-gradient(329deg, rgba(191, 63, 249, 1) 0%, rgba(113, 51, 210, 1) 100%)",
              backgroundColor: 'var(--charcoal-black)',
                            height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div>
            <img src="assets/img/gipss.gif" style={{ height: "300px", color:"white"}}></img>
            <h6 style={{ color:"gold"}}>Loading...</h6>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="home-page indexsix">
            <Header />
            <main className="main-wrapper">
              <section
                id="parallax"
                className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
                // style={{ backgroundImage: "url(img/bgss.jpg)" }}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                      <div className="breadcrumb-wrap text-center">
                        <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                              <a href="/">Home</a>
                            </li>
                            <li
                              className="breadcrumb-item active"
                              aria-current="page"
                            >
                              {Theaters.name}
                            </li>
                          </ol>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <section className="pb-5">
                  {/* Theater Details */}
                  <div className="container">
                    <div className="row align-items-center mb-4" id="gback">
                      <div className="col-lg-6  pb-4">
                        <div
                          className="wow fadeInLeft text-center p-3"
                          data-animation="fadeInLeft"
                          data-delay=".2s"
                        >
                          <Galleria
                            value={images}
                            responsiveOptions={responsiveOptions}
                            numVisible={1}
                            style={{ maxWidth: "100%" }}
                            thumbnail={thumbnailTemplate}
                            circular
                            autoPlay
                            transitionInterval={2000}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 pb-3 pt-4">
                        <div className="about-content s-about-content pl-30">
                          <div className="about-title second-atitle mb-4">
                            <h2
                              className="wow fadeInUp animated"
                              data-animation="fadeInUp animated"
                              data-delay=".2s"
                              style={{ color: "white", fontWeight: "500" }}
                            >
                              {Theaters.name}
                            </h2>
                            <p className="text-white">{Theaters.description}</p>
                          </div>
                          {TheatersFeatures.map((data, i) => {
                            return (
                              <div className="mt-3" key={i}>
                                <p style={{ color: "white" }}>
                                  <span id="bgs4"></span>
                                  {data}
                                </p>
                              </div>
                            );
                          })}
                          <h4 style={{ color: "white" }} className="pt-4">
                            {form.type == "combo" ? (
                              <></>
                            ) : (
                              <>
                                <b>₹ {Theaters.offerPrice} /-</b>
                              </>
                            )}
                          </h4>
                          <button
                            className="btn course-btn mt-5"
                            type="button"
                            onClick={() => setVisible(true)}
                          >
                            Watch A Decoration Video
                          </button>
                          <Dialog
                            header=" Watch A Decoration Video"
                            visible={visible}
                            maximizable
                            className="watchs"
                            onHide={() => {
                              if (!visible) return;
                              setVisible(false);
                            }}
                          >
                            <iframe
                              style={{ height: "100%", width: "100%" }}
                              src={Theaters.link}
                              title="YouTube video player"
                              frameBorder={0}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen=""
                            />
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container-md">
                    {/* Slot Booking */}
                    <Col
                      md={12}
                      style={{
                        borderRight: "1px dashed #A020F0",
                        borderBottom: "1px dashed #A020F0",
                        borderLeft: "1px dashed #A020F0",
                        background: "#F8EBFF",
                      }}
                    >
                      <div
                        style={{
                          padding: "5px",
                          background: "#A020F0",
                        }}
                      >
                        <div className="row">
                          <div className="col">
                            <h5
                              style={{
                                color: "white",
                              }}
                            >
                              Slot Booking
                            </h5>
                          </div>
                          <div className="col">
                            <h5
                              style={{
                                color: "white",
                                float: "right",
                              }}
                            >
                              Total : ₹ {totalCartPrice}
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-3 p-2">
                        <div className="col-md-3 pt-3">
                          <div className="text-center">
                            <input
                              required
                              type="date"
                              className="form-control"
                              value={date}
                              name="date"
                              onChange={(e) => handleDate(e)}
                              min={formatDate(today)}
                              id="bgshadow"
                            />
                          </div>
                        </div>
                        <div className="col-md-3 pt-3">
                          <div className="text-center">
                            <select
                              id="bgshadow"
                              className="form-select"
                              aria-label="Default select example"
                              value={form.timeSlot}
                              name="timeSlot"
                              onChange={(e) => {
                                handleTimeSlot(e);
                              }}
                              required
                            >
                              <option value="">Select Time Slot</option>
                              {Theatersslots.map((data, key) => {
                                return (
                                  <option
                                    key={key}
                                    value={data.fromtime + " / " + data.totime}
                                    disabled={
                                      data.isBooked == true ||
                                      data.isActive == false
                                        ? true
                                        : false
                                    }
                                  >
                                    {convertTo12HourFormat(data.fromtime)} -
                                    {convertTo12HourFormat(data.totime)}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3 pt-3">
                          <div className="text-center">
                            <select
                              className="form-select"
                              id="bgshadow"
                              aria-label="Default select example"
                              value={form.NoofPersons}
                              name="NoofPersons"
                              onChange={(e) => {
                                handlePersons(e);
                              }}
                              required
                            >
                              <option selected="">No. of Persons</option>
                              {options}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3 pt-3">
                          <div className="text-center">
                            <select
                              className="form-select"
                              id="bgshadow"
                              aria-label="Default select example"
                              value={form.type}
                              name="type"
                              onChange={(e) => {
                                handlechanges(e);
                              }}
                              required
                            >
                              <option value="">Select </option>
                              <option value="combo">Combo </option>
                              <option value="normal">Normal </option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4">
                          {SlotCount == 0 ? (
                            <>
                              <h6 className="text-danger">
                                No Slots Available
                              </h6>
                            </>
                          ) : (
                            <>
                              <h6 className="text-success">
                                {SlotCount} Slots Available
                              </h6>
                            </>
                          )}
                        </div>
                      </div>
                    </Col>

                    {/* Person Information */}

                    {shows == true ? (
                      <>
                        <Col
                          md={12}
                          ref={formselectRef}
                          style={{
                            borderRight: "1px dashed #A020F0",
                            borderBottom: "1px dashed #A020F0",
                            borderLeft: "1px dashed #A020F0",
                            background: "#F8EBFF",
                          }}
                        >
                          <div
                            style={{
                              padding: "5px",
                              background: "#A020F0",
                            }}
                            className="mt-2 mb-4"
                          >
                            <div className="row">
                              <div className="col">
                                <h5
                                  style={{
                                    color: "white",
                                  }}
                                >
                                  Person Information
                                </h5>
                              </div>
                              <div className="col">
                                <h5
                                  style={{
                                    color: "white",
                                    float: "right",
                                  }}
                                >
                                  Total : ₹ {totalCartPrice}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-5 justify-content-center">
                            <div className="col-md-3 col-sm-12">
                              <div>
                                <label>Name</label>
                                <input
                                  id="bgshadow"
                                  className="form-control"
                                  type="text"
                                  placeholder="Enter Name"
                                  required
                                  name="name"
                                  onChange={(e) => {
                                    handlechange(e);
                                  }}
                                  value={form.name}
                                />
                              </div>
                            </div>
                            <div className="col-md-3 col-sm-12">
                              <div>
                                <label>Email</label>
                                <input
                                  id="bgshadow"
                                  className="form-control"
                                  type="email"
                                  name="email"
                                  placeholder="Enter Email"
                                  required
                                  onChange={(e) => {
                                    handlechange(e);
                                  }}
                                  value={form.email}
                                />
                              </div>
                            </div>
                            <div className="col-md-3 col-sm-12">
                              <div>
                                <label>Phone</label>
                                <input
                                  id="bgshadow"
                                  className="form-control"
                                  type="text"
                                  placeholder="Enter Phone"
                                  onChange={(e) => {
                                    handleMobile(e);
                                  }}
                                  required
                                  name="phone"
                                  value={form.phone}
                                  maxlength="10"
                                  minLength="10"
                                  pattern="[0-9]{10}"
                                  onKeyPress={(e) => {
                                    // Allow only numeric input
                                    const charCode = e.which
                                      ? e.which
                                      : e.keyCode;
                                    if (charCode < 48 || charCode > 57) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </Col>

                        {/* Occasions*/}

                        <Col
                          md={12}
                          style={{
                            borderRight: "1px dashed #A020F0",
                            borderBottom: "1px dashed #A020F0",
                            borderLeft: "1px dashed #A020F0",
                            background: "#F8EBFF",
                          }}
                        >
                          <div
                            style={{
                              padding: "5px",
                              background: "#A020F0",
                            }}
                            className="mt-2 mb-3"
                          >
                            <div className="row">
                              <div className="col">
                                <h5
                                  style={{
                                    color: "white",
                                  }}
                                >
                                  Occasions
                                </h5>
                              </div>
                              <div className="col">
                                <h5
                                  style={{
                                    color: "white",
                                    float: "right",
                                  }}
                                >
                                  Total : ₹ {totalCartPrice}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <Row className="p-3">
                            {Occation.map((data, i) => (
                              <div className="col-lg-3 col-12 mb-4" key={i}>
                                <div
                                  className={`text-center position-relative ${
                                    Occasionsselect === i ||
                                    form.occasionid === data._id
                                      ? "selected "
                                      : ""
                                  }`}
                                  style={{ cursor: "pointer" }}
                                  id="bgshadow"
                                >
                                  <div
                                    className="food-category item"
                                    data-type="occasions"
                                    data-id={8}
                                    data-name="Anniversary"
                                    data-price={0}
                                    data-qty={1}
                                  >
                                    <div className="food-img">
                                      <img
                                        src={URLS.Base + data.image}
                                        className="img-fluid"
                                        alt=""
                                        onClick={() =>
                                          handleOccasionClick(data, i)
                                        }
                                      />
                                    </div>
                                    <div className="food-desc">
                                      <p
                                        className="fd-title"
                                        style={{ color: "black" }}
                                      >
                                        {data.name}
                                      </p>
                                      {form.type === "combo" ? (
                                        <></>
                                      ) : (
                                        <>
                                          <p
                                            className="fd-title"
                                            style={{
                                              color: "#F6699E",
                                              borderTop: "1px dashed gray",
                                              paddingTop: "3px",
                                              paddingBottom: "3px",
                                            }}
                                          >
                                            <small> ₹</small>
                                            <b>{data.price}</b> /-
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {selectedOccasion === i && (
                                  <div
                                    className="mt-2"
                                    style={{
                                      width: "100%",
                                      margin: "0 auto",
                                    }}
                                  >
                                    <input
                                      className="form-control"
                                      id="bgshadow"
                                      type="text"
                                      placeholder="Enter Person Name"
                                      value={form.personName}
                                      name="personName"
                                      onChange={handlechange}
                                      required
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </Row>
                        </Col>

                        {console.log(form.type)}

                        {Plans.length == 0 || form.type == "normal" ? (
                          <></>
                        ) : (
                          <>
                            <Col
                              className="mt-2"
                              md={12}
                              style={{
                                borderRight: "1px dashed #A020F0",
                                borderBottom: "1px dashed #A020F0",
                                borderLeft: "1px dashed #A020F0",
                                background: "#F8EBFF",
                              }}
                            >
                              <div
                                style={{
                                  padding: "5px",
                                  background: "#A020F0",
                                }}
                                className="mt-2 mb-3"
                              >
                                <div className="row">
                                  <div className="col">
                                    <h5
                                      style={{
                                        color: "white",
                                      }}
                                    >
                                      Combo Plans
                                    </h5>
                                  </div>
                                  <div className="col">
                                    <h5
                                      style={{
                                        color: "white",
                                        float: "right",
                                      }}
                                    >
                                      Total : ₹ {totalCartPrice}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              <Row className="m-2">
                                <Col md={4} ref={PlanRef}>
                                  {form.type == "combo" && Plans.length > 0 ? (
                                    <>
                                      <div className="row mt-3 ">
                                        <div className="col-md-12">
                                          <section className="pt-3 pb-3">
                                            <div className="container-md">
                                              <div className="row">
                                                {Plans?.map((data, i) => {
                                                  return (
                                                    <div
                                                      className="col-lg-12 mt-2"
                                                      key={i}
                                                    >
                                                      <div
                                                        className="card"
                                                        id={
                                                          Plansselect === i ||
                                                          form.planId ===
                                                            data._id
                                                            ? "pricing-bodyss"
                                                            : "pricing-bodys"
                                                        }
                                                      >
                                                        <div className="card-body pt-2">
                                                          <div className="pt-3">
                                                            <h3
                                                              style={{
                                                                textDecoration:
                                                                  "underline",
                                                              }}
                                                            >
                                                              {data.name}
                                                            </h3>
                                                            <span>
                                                              (
                                                              {form.NoofPersons}
                                                              ) Members
                                                            </span>
                                                          </div>
                                                          <ul className="pt-4 opls">
                                                            {data?.benefits?.map(
                                                              (datas, is) => {
                                                                return (
                                                                  <li
                                                                    className="pb-2"
                                                                    key={is}
                                                                  >
                                                                    <img
                                                                      draggable="false"
                                                                      role="img"
                                                                      className="emoji m-1"
                                                                      alt="🌟"
                                                                      style={{
                                                                        height:
                                                                          "15px",
                                                                      }}
                                                                      src="https://s.w.org/images/core/emoji/15.0.3/svg/1f31f.svg"
                                                                    />
                                                                    {datas}
                                                                  </li>
                                                                );
                                                              }
                                                            )}
                                                          </ul>
                                                          <div className="price-count mb-30">
                                                            <del className="text-center">
                                                              <small>₹ </small>
                                                              {data.price}
                                                            </del>
                                                            <h3>
                                                              <small> ₹</small>
                                                              {data.offerPrice}
                                                              /-
                                                            </h3>
                                                          </div>
                                                          <div className="pricing-btn mt-5">
                                                            <a
                                                              onClick={() => {
                                                                PlanCategoriesId(
                                                                  data,
                                                                  i
                                                                );
                                                              }}
                                                              className="btn course-btn"
                                                              outline
                                                              style={{
                                                                background:
                                                                  "#F6699E",
                                                                border: "none",
                                                                width: "100%",
                                                              }}
                                                            >
                                                              Choose
                                                            </a>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          </section>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </Col>
                                {/* PlanBenifits */}
                                <Col md={8}>
                                  {PlanProduct?.length == 0 ? (
                                    <></>
                                  ) : (
                                    <>
                                      {form.type == "combo" ? (
                                        <>
                                          <Col md={12}>
                                            <div className="row mt-2 pt-4 pb-3">
                                              {PlanProduct?.map((data, i) => {
                                                return (
                                                  <div
                                                    className="col-lg-4 col-4 mb-4"
                                                    key={i}
                                                  >
                                                    <div
                                                      className="text-center position-relative"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                    >
                                                      <div
                                                        className="food-category item"
                                                        data-type="occasions"
                                                        data-id={8}
                                                        data-name="Anniversary"
                                                        data-price={0}
                                                        data-qty={1}
                                                      >
                                                        <div className="food-img">
                                                          <img
                                                            src={
                                                              URLS.Base +
                                                              data.image
                                                            }
                                                            className="img-fluid"
                                                            alt=""
                                                          />
                                                        </div>
                                                        <div className="food-desc">
                                                          <p
                                                            style={{
                                                              color: "black",
                                                            }}
                                                          >
                                                            <small>
                                                              {data.name}
                                                            </small>
                                                          </p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </Col>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          </>
                        )}

                        <Col
                          md={12}
                          ref={productSectionRef}
                          style={{
                            borderRight: "1px dashed #A020F0",
                            borderBottom: "1px dashed #A020F0",
                            borderLeft: "1px dashed #A020F0",
                            background: "#F8EBFF",
                          }}
                        >
                          {form.type == "normal" && Product.length > 0 ? (
                            <>
                              <div
                                style={{
                                  padding: "5px",
                                  background: "#A020F0",
                                }}
                                className="mt-2 mb-3"
                              >
                                <div className="row">
                                  <div className="col">
                                    <h5
                                      style={{
                                        color: "white",
                                      }}
                                    >
                                      Add Ons
                                    </h5>
                                  </div>
                                  <div className="col">
                                    <h5
                                      style={{
                                        color: "white",
                                        float: "right",
                                      }}
                                    >
                                      Total : ₹ {totalCartPrice}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              <div className="row m-1">
                                <div className="col-12">
                                  <small className="text-danger">
                                    <b>ATTENTION:</b> Decoration cannot be
                                    customized.{" "}
                                  </small>
                                </div>
                                <div className="col-12">
                                  <small className="text-danger">
                                    <b>Note:</b> You can add multiple names by
                                    comma seperated, if you have multiple
                                    special person.
                                  </small>
                                </div>
                              </div>

                              {/* <div className="p-3">
                                <div className="row mt-2">
                                  {Product.map((data, index) => (
                                    <div
                                      className="col-lg-3 col-12 mb-4 itemHolder pb-4 pt-2"
                                      key={index}
                                      style={{
                                        borderBottom: "1px dashed gray",
                                      }}
                                    >
                                      <h5 className="mb-3">
                                        {data.categoryName}
                                      </h5>
                                      <div
                                        id="bgshadow"
                                        className={
                                          selectedItems.has(data._id)
                                            ? "text-center position-relative selected"
                                            : "text-center position-relative"
                                        }
                                        style={{ height: "280px" }}
                                        onClick={() =>
                                          toggleSelection(
                                            data._id,
                                            index,
                                            data.quantity,
                                            data.dropdown ? "cake" : "other"
                                          )
                                        }
                                      >
                                        <div
                                          className="food-category item pb-5"
                                          data-type="cakes"
                                          data-id={5}
                                          data-name="Chocolate Truffle 500g"
                                          data-price={data.price}
                                        >
                                          <div className="food-img">
                                            <img
                                              src={URLS.Base + data.image}
                                              className="img-fluid"
                                              alt={data.name}
                                              style={{ cursor: "pointer" }}
                                            />
                                          </div>
                                          <div className="food-desc">
                                            <p
                                              className="fd-title"
                                              style={{ color: "#A020F0" }}
                                            >
                                              <b>{data.name}</b>
                                            </p>
                                            <p className="fw-semibold mb-0">
                                              ₹{data.price}
                                              {data.dropdown
                                                ? ` / 500gms -- ${data.cakeType.toUpperCase()}`
                                                : ""}
                                            </p>
                                          </div>
                                        </div>
                                        <div
                                          className="quantity d-flex align-items-center mx-2"
                                          style={{
                                            marginTop: "-40px",
                                            width: "100%",
                                          }}
                                        >
                                          {data.dropdown ? (
                                            <select
                                              className="form-select"
                                              name="cakevalue"
                                              style={{
                                                width: "95%",
                                                padding: "0.25rem 0.5rem",
                                                fontSize: "0.875rem",
                                                borderRadius: "0.25rem",
                                              }}
                                              value={
                                                cart[
                                                  getObjectById(
                                                    cart,
                                                    data._id,
                                                    "cake"
                                                  )
                                                ]?.quantity || ""
                                              }
                                              // value={selectedValue.cakevalue}
                                              onChange={(e) =>
                                                handleCakeQuantity(
                                                  Product,
                                                  setProduct,
                                                  index,
                                                  data.quantity,
                                                  "update",
                                                  "cake",
                                                  e
                                                )
                                              }
                                            >
                                              <option value="500">500Gm</option>
                                              <option value="1">1kg</option>
                                              <option value="2">2kg</option>
                                              <option value="3">3kg</option>
                                            </select>
                                          ) : data.increment ? (
                                            getObjectById(
                                              cart,
                                              data._id,
                                              "cake"
                                            ) === null ||
                                            cart[
                                              getObjectById(
                                                cart,
                                                data._id,
                                                "cake"
                                              )
                                            ].quantity === 0 ? (
                                              ""
                                            ) : (
                                              ""
                                            )
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div> */}

                              <div className="p-3">
                                <div className="row mt-2">
                                  {Product.map((data, index) => (
                                    <div
                                      className="col-lg-3 col-12 mb-4 itemHolder pb-4 pt-2"
                                      key={index}
                                      style={{
                                        borderBottom: "1px dashed gray",
                                      }}
                                    >
                                      <h5 className="mb-3">
                                        {data.categoryName}
                                      </h5>
                                      <div
                                        id="bgshadow"
                                        className={
                                          selectedItems.has(data._id)
                                            ? "text-center position-relative selected"
                                            : "text-center position-relative"
                                        }
                                        style={{ height: "280px" }}
                                        onClick={() =>
                                          toggleSelection(
                                            data._id,
                                            index,
                                            data.quantity,
                                            data.dropdown ? "cake" : "other",
                                            selectedQuantity
                                          )
                                        }
                                      >
                                        <div className="food-category item pb-5">
                                          <div className="food-img">
                                            <img
                                              src={URLS.Base + data.image}
                                              className="img-fluid"
                                              alt={data.name}
                                              style={{ cursor: "pointer" }}
                                            />
                                          </div>
                                          <div className="food-desc">
                                            <p
                                              className="fd-title"
                                              style={{ color: "#A020F0" }}
                                            >
                                              <b>{data.name}</b>
                                            </p>
                                            <p className="fw-semibold mb-0">
                                              ₹{data.price}
                                              {data.dropdown
                                                ? ` / 500gms -- ${data.cakeType.toUpperCase()}`
                                                : ""}
                                            </p>
                                          </div>
                                        </div>
                                        <div
                                          className="quantity d-flex align-items-center mx-2"
                                          style={{
                                            marginTop: "-40px",
                                            width: "100%",
                                          }}
                                        >
                                          {data.dropdown && (
                                            <select
                                              className="form-select"
                                              name="cakevalue"
                                              style={{
                                                width: "95%",
                                                padding: "0.25rem 0.5rem",
                                                fontSize: "0.875rem",
                                                borderRadius: "0.25rem",
                                              }}
                                              value={
                                                selectedValues[index] || ""
                                              }
                                              onChange={(e) =>
                                                handleCakeQuantity(
                                                  Product,
                                                  setProduct,
                                                  index,
                                                  data.quantity,
                                                  "update",
                                                  "cake",
                                                  e
                                                )
                                              }
                                            >
                                              <option value="500">500Gm</option>
                                              <option value="1">1kg</option>
                                              <option value="2">2kg</option>
                                              <option value="3">3kg</option>
                                            </select>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </Col>
                      </>
                    ) : (
                      <></>
                    )}

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

                      <div className="col-6">
                        <div className="row mt-5">
                          <div className="col-12">
                            <div
                              className="text-center m-2"
                              style={{ float: "right" }}
                            >
                              <button type="submit" className="btn course-btn">
                                Next ₹ {totalCartPrice} /-
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </form>
            </main>

            <Modal
              size="md"
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
                  Note :{" "}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row justify-content-md-center">
                  <div
                    className="col-lg-12 mt-40"
                    style={{ border: "1px solid white", background: "white" }}
                  >
                    <h4
                      className="p-4 text-center"
                      style={{ color: "#A020F0" }}
                    >
                      You have selected a slot with 1.5 hours duration and will
                      be charged accordingly. Proceed further if you are okay
                      with it!
                    </h4>
                    <div className="text-center">
                      <button
                        onClick={() => handleclose()}
                        type="button"
                        className="btn course-btn mb-3 text-center btn-outline"
                      >
                        okay !
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Theaters;
