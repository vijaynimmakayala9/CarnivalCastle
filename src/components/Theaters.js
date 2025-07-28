import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Calendar } from "primereact/calendar";
import Modal from "react-bootstrap/Modal";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import { Carousel } from 'react-bootstrap';

function Theaters() {
  const [theaters, setTheaters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({});
  const [modalPop, setModalPop] = useState(false);
  
  const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  
  const [date, setDate] = useState(getTodayDateString());
  const [activeshow, setActiveshow] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [nintymin, setnintymin] = useState(0);
  const [addresses, setAddresses] = useState([]);

  const [locationModalOpen, setLocationModalOpen] = useState(true);
  const [comingSoonModalOpen, setComingSoonModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [activeIndices, setActiveIndices] = useState({});

  const BaseUrl = "https://api.carnivalcastle.com/";
  const navigate = useNavigate();

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const dd = dateObj.getDate().toString().padStart(2, "0");
    const mm = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const formattedDateString = formatDate(date);

  const handleLocationSelect = async (address) => {
    setLocation(address);
    if (address._id) {
      setLocationModalOpen(false);
      await fetchTheatersByAddressId(address._id);
    } else {
      setLocationModalOpen(false);
      setComingSoonModalOpen(true);
    }
  };

  const fetchTheatersByAddressId = async (addressId) => {
  setIsLoading(true);
  try {
    if (!addressId) {
      console.warn("No addressId provided. Skipping theater filtering.");
      setTheaters([]);
      return;
    }

    const res = await axios.post(
      "https://api.carnivalcastle.com/v1/carnivalApi/web/getalltheatres/forweb",
      { slotDate: formattedDateString }
    );

    if (res.data && res.data.success) {
      // Filter theaters by matching addressId
      const filteredTheaters = res.data.theatres.filter(theater => {
        const theaterAddressId = typeof theater.address === 'string'
          ? theater.address
          : theater.address?._id;

        return theaterAddressId?.toString() === addressId?.toString();
      });

      const now = new Date();

      const processedTheaters = filteredTheaters.map(theater => {
  const processedSlots = (theater.availableSlots || []).map(slot => {
    const [slotHours, slotMinutes] = slot.fromTime.split(':').map(Number);
    const [endHours, endMinutes] = slot.toTime.split(':').map(Number);

    // Convert slot times to full DateTime objects
    const slotStart = new Date(date);
    slotStart.setHours(slotHours, slotMinutes, 0, 0);

    const slotEnd = new Date(date);
    slotEnd.setHours(endHours, endMinutes, 0, 0);

    const now = new Date();
    const selectedDate = new Date(date);

    const isToday =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();

    const isBooked = slot.isBooked || false;

    // Calculate past/disable only if it's today
    const isPast = isToday && now > slotEnd;
    const isAlmostOver = isToday && !isPast && (slotEnd - now <= 10 * 60 * 1000);
    const isDisabled = isBooked || isPast || isAlmostOver;

    return {
      ...slot,
      isBooked,
      isPast,
      isAlmostOver,
      isDisabled
    };
  });

  return {
    ...theater,
    availableSlots: processedSlots,
    availableSlotsCount: processedSlots.filter(s => !s.isDisabled).length
  };
});

      setTheaters(processedTheaters);

      // Set carousel indices
      const initialIndices = {};
      processedTheaters.forEach((_, index) => {
        initialIndices[index] = 0;
      });
      setActiveIndices(initialIndices);
    } else {
      setTheaters([]);
    }
  } catch (error) {
    console.error("Error fetching theaters:", error);
    setTheaters([]);
    toast.error("Failed to fetch theaters. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  


  const closeComingSoonModal = () => {
    setComingSoonModalOpen(false);
    navigate(-1);
  };

  const databyid = (data) => {
    axios.post(URLS.GetUnicId, {}, {}).then((res) => {
      if (res.status === 200) {
        sessionStorage.setItem("UserId", res.data.userId);
        sessionStorage.setItem("theaterId", data._id);
        sessionStorage.setItem("theatreName", data.name);
        sessionStorage.setItem("theatrePrices", data.offerPrice);
        sessionStorage.setItem("date", formattedDateString);
        window.location.href = "/BookingDetails";
      }
    });
  };

  useEffect(() => {
    // Always use today's date when component mounts
    setDate(getTodayDateString());
    fetchAddresses();
    
    // Clean up session storage
    const itemsToRemove = [
      "bookingid", "specialPersonName", "TotalPrice", "TotalPrice2", "addons",
      "addonsData", "adonsJSON", "userDetails", "theaterName", "theaterId",
      "subtotal", "slot", "selectedOccasion", "planType", "paymentkey",
      "orderId", "occprice", "occasionName", "occasion", "invoicePath",
      "extraPersonprice", "extraPersonperprice", "extraAddedPersonsForTheatre",
      "date", "data", "coupondis", "cakeprice", "advancePayment", "countPeople",
      "theaterPrice", "theatrePrices", "comboAdvancePayment", "maxPeople"
    ];
    itemsToRemove.forEach(item => sessionStorage.removeItem(item));
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(
        "https://api.carnivalcastle.com/v1/carnivalApi/admin/address/alladdress"
      );
      if (res.data && res.data.success) {
        setAddresses(res.data.data || []);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleView = () => {
    setIsExpanded(!isExpanded);
  };

  const [form, setform] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    description: "",
    eventName: "",
  });

  const [lgShow, setLgShow] = useState(false);
  const modelshow = () => {
    setLgShow(!false);
  };

  const formsubmit = (e) => {
    e.preventDefault();
    EnquiryNow();
  };

  const handleChange = (e) => {
    let myUser = { ...form };
    myUser[e.target.name] = e.target.value;
    setform(myUser);
  };

  const [isDisabled, setIsDisabled] = useState(false);

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      console.error("No date selected");
      return;
    }
    
    // Don't allow dates before today
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDateObj < today) {
      toast.error("Please select today's or a future date");
      return;
    }
    
    setDate(selectedDate);
    const formattedDate = formatDate(selectedDate);
    sessionStorage.setItem("date", formattedDate);
    
    if (location && location._id) {
      await fetchTheatersByAddressId(location._id);
    }
  };

  const EnquiryNow = () => {
    const dataArray = {
      name: form.name,
      email: form.email,
      mobileNumber: form.mobileNumber,
      description: form.description,
      eventName: form.eventName,
    };

    axios.post(URLS.AddEnquiry, dataArray).then(
      (res) => {
        if (res.status === 200) {
          toast(res.data.message);
          setLgShow(false);
          setform({
            name: "",
            email: "",
            mobileNumber: "",
            description: "",
            eventName: "",
          });
        }
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          toast(error.response.data.message);
        }
      }
    );
  };

  const [Contact, setContact] = useState([]);

  useEffect(() => {
    GetFooterData();
    sessionStorage.setItem("date", formattedDateString);
  }, []);

  const GetFooterData = () => {
    axios.post(URLS.GetFooter, {}, {}).then((res) => {
      if (res.status === 200) {
        setContact(res.data.contactus || []);
      }
    });
  };

  const cardHeaderStyle = {
    position: "relative",
    padding: "10px",
  };

  const convertTo12HourFormat = (time24) => {
    const [hoursStr, minutes] = time24.split(":");
    const hours = parseInt(hoursStr, 10);
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    const period = hours < 12 ? "AM" : "PM";
    return `${hours12}:${minutes.padStart(2, "0")} ${period}`;
  };

  const handleSlot = (e, data, index) => {
    e.preventDefault();

    if (!data.isBooked) {
      setSelectedSlot((prevState) => ({
        ...prevState,
        [index]: data,
      }));
    }

    setActiveshow(data);
    setActiveSlot(data);

    const fromTime12 = convertTo12HourFormat(data.fromTime);
    const toTime12 = convertTo12HourFormat(data.toTime);

    sessionStorage.setItem("slot", `${fromTime12} - ${toTime12}`);

    const selectedValue = (e.target.value || `${fromTime12} / ${toTime12}`).trim();
    console.log("Selected Value:", selectedValue);

    const durationInMinutes = calculateSlotDuration(data.fromTime, data.toTime);
    setnintymin(durationInMinutes || 0);
    sessionStorage.setItem("nintymin", durationInMinutes || 0);
    if (durationInMinutes === 90) {
      setModalPop(true);
    }
  };

  const calculateSlotDuration = (fromTime, toTime) => {
    const fromDate = new Date(`1970-01-01T${fromTime}:00`);
    const toDate = new Date(`1970-01-01T${toTime}:00`);
    const durationInMilliseconds = toDate - fromDate;
    return durationInMilliseconds / (1000 * 60);
  };

  const handleclose = () => {
    setModalPop(false);
  };

  const handleBasicPlan = (data, i) => {
    const price = nintymin === 90 ? data.oneandhalfslotPrice : data.offerPrice;
    sessionStorage.setItem("theaterId", data._id);
    sessionStorage.setItem("maxPeople", data.maxPeople);
    sessionStorage.setItem(
      "extraPersonprice",
      nintymin === 90
        ? data.onehalfanhourExtraPersonPrice || 0
        : data.extraPersonprice
    );
    sessionStorage.setItem("theaterName", data.name);
    sessionStorage.setItem("theatermaxSeating", data.maxSeating);
    sessionStorage.setItem("theaterPrice", price);
    sessionStorage.setItem("theatrePrices", price);
    sessionStorage.setItem("TotalPrice", price);
    sessionStorage.setItem("subtotal", price);
    sessionStorage.setItem("cartCakes", JSON.stringify([]));
    sessionStorage.setItem("selectedOccasion", JSON.stringify([]));
    sessionStorage.setItem("occprice", "0");
    sessionStorage.setItem("cakeprice", "0");
    sessionStorage.setItem("cartcakeslength", "500");
    sessionStorage.setItem("addons", "0");
    sessionStorage.setItem("coupondis", "0");
    sessionStorage.setItem("planType", "normal");
    navigate("/Basicplan");
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Best Surprise Party Places in Hyderabad | Private Theater</title>
        <meta
          name="description"
          content="Celebrate at Bing Enjoy Private Theatres in Hyderabad. Perfect for birthdays, anniversaries, & special events with custom decor, food & privacy. Book now!!"
        />
      </Helmet>

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
              style={{ height: "300px", color: "white" }}
              alt="Loading..."
            />
            <h6 style={{ color: "gold" }}>Loading...</h6>
          </div>
        </div>
      ) : (
        <div className="home-page indexsix">
          <Header />

          {locationModalOpen && (
            <div
              className="modal fade show"
              tabIndex="-1"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.7)" }}
              aria-modal="true"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div
                  className="modal-content p-3 p-md-4 bg-light-grey text-white"
                  style={{ border: "2px solid white", borderRadius: "12px" }}
                >
                  <h5 className="text-center mb-3 mb-md-4 fs-5 fs-md-4">Select Your Location</h5>
                  <div className="row">
                    {addresses && addresses.length > 0 ? (
                      addresses.map((address, index) => (
                        <div className="col-12 col-md-6 mb-4" key={index}>
                          <div
                            className="card h-100 text-white shadow-sm"
                            style={{
                              backgroundColor: "#2c2c2c",
                              borderRadius: "1rem",
                              overflow: "hidden",
                              border: "2px solid white",
                            }}
                          >
                            {address.image ? (<>
                              <img
                                src={BaseUrl + address.image}
                                alt={address.city}
                                className="img-fluid"
                                style={{
                                  width: "100%",
                                  objectFit: "cover",
                                  minHeight: "250px",
                                  maxHeight: "300px",
                                }}
                              />

                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  `${address.addressLine1}, ${address.addressLine2}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  position: "absolute",
                                  bottom: "130px",
                                  right: "10px",
                                  borderRadius: "50%",
                                  padding: "0px",
                                  zIndex: 10,
                                }}
                                title="View on Google Maps"
                              >
                                <img
                                  src="https://bnbtplstorageaccount.blob.core.windows.net/googleicons/map (1).svg"
                                  alt="Google Maps"
                                  style={{ width: "75px", height: "75px", display: "block" }}
                                />
                              </a>
                            </>
                            ) : (
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  minHeight: "250px",
                                  width: "100%",
                                  backgroundColor: "#444",
                                  fontSize: "3rem",
                                }}
                              >
                                <i className="bi bi-image text-white"></i>
                              </div>
                            )}

                            <div className="card-body d-flex flex-column justify-content-between p-3">
                              <div>
                                <h5 className="card-title fw-semibold mb-1 text-white">
                                  <i className="fa-solid fa-map-location-dot me-2" style={{ color: "green" }}></i>
                                  {address.name}, {address.city}
                                </h5>
                                {address.landmark && (
                                  <p className="mb-0 text-white" style={{ fontSize: "0.9rem" }}>
                                    <i className="fa-solid fa-location-dot me-2" style={{ color: "#ccc" }}></i>
                                    {address.landmark}
                                  </p>
                                )}
                              </div>
                              <button
                                className="btn btn-light text-dark w-100 mt-3"
                                onClick={() => handleLocationSelect(address)}
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center">
                        <p>No locations available at the moment.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {comingSoonModalOpen && (
            <div
              className="modal fade show"
              tabIndex="-1"
              style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
              aria-modal="true"
              role="dialog"
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
              >
                <div
                  className="modal-content p-4 bg-light-grey text-white"
                  style={{
                    border: "2px solid white",
                    borderRadius: "12px",
                  }}
                >
                  <h5 className="text-center mb-3">Coming Soon</h5>
                  <p className="text-center" style={{ fontSize: "1rem" }}>
                    We're launching in more locations soon. Stay tuned!
                  </p>
                  <div className="text-center mt-4">
                    <button
                      className="btn btn-danger px-4"
                      onClick={closeComingSoonModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {location && (
            <>
              <main className="main-wrapper">
                <section
                  id="parallax"
                  className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix bg-dark border-gradient border-gradient-gold only-bottom-border"
                >
                  <div className="container">
                    <div className="row">
                      <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                        <div className="breadcrumb-wrap text-center">
                          <div className="breadcrumb-title mb-30">
                            <h1 style={{ color: "white", marginTop: "20px" }}>
                              Theaters in {location.city}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section
                  className="shop-area pt-5 pb-5 p-relative bg-dark"
                  style={{ background: "#F8EBFF" }}
                >
                  <div className="container-md">
                    <div className="row mb-3">
                      <div className="col-12">
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <div className="text-center">
                            <label className="mb-2 servicesLink bright-all-links">
                              Check Slot Availability
                            </label>
                            <br />
                            <input
                              type="date"
                              id="buttondisplay"
                              name="theaterdate"
                              className={`form-control border-primary ${isDisabled ? "bg-light" : ""
                                }`}
                              disabled={isDisabled}
                              value={date}
                              min={getTodayDateString()}
                              onChange={handleDateChange}
                            />
                          </div>
                        </div>
                        <hr />
                      </div>
                    </div>
                    <hr />

                    <div className="container">
                      <div className="row">
                        {theaters && theaters.length > 0 ? (
                          theaters.map((data, i) => {
                            const isBookNowActive = selectedSlot[i] !== undefined;

                            return (
                              <div
                                className="col-12 col-sm-6 col-md-4 mb-4 d-flex"
                                key={i}
                              >
                                <div
                                  className="card rounded bg-light-grey text-white flex-fill"
                                  style={{
                                    minHeight: "820px",
                                    overflow: "hidden",
                                    border: "2px solid white",
                                  }}
                                >
                                  <div style={cardHeaderStyle}>
                                    <div
                                      className="course-img"
                                      data-label={data.batchType}
                                      id="ort"
                                      style={{ position: "relative" }}
                                    >
                                      <div className="doc-img">
                                        <Carousel
                                          interval={3000}
                                          controls={false}
                                        >
                                          {data.image &&
                                            data.image.map((img, idx) => (
                                              <Carousel.Item key={idx}>
                                                <img
                                                  src={BaseUrl + img}
                                                  alt=""
                                                  className="img-fluid"
                                                  style={{
                                                    height: "250px",
                                                    borderRadius: "10px",
                                                    width: "100%",
                                                    cursor: "pointer",
                                                    objectFit: "cover",
                                                  }}
                                                />
                                              </Carousel.Item>
                                            ))}
                                          {data.video && (
                                            <Carousel.Item>
                                              <video
                                                src={URLS.Base + data.video}
                                                className="img-fluid video-mobile"
                                                style={{
                                                  height: "250px",
                                                  borderRadius: "10px",
                                                  width: "100%",
                                                  cursor: "pointer",
                                                  display: "block",
                                                  objectFit: "cover",
                                                }}
                                                autoPlay
                                                loop
                                                muted
                                                preload="auto"
                                              />
                                            </Carousel.Item>
                                          )}
                                        </Carousel>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                      <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5
                                          className="card-title m-0"
                                          style={{ fontSize: "1.05rem" }}
                                        >
                                          {data.name}
                                        </h5>
                                        <span
                                          className="badge bg-danger text-white"
                                          style={{ fontSize: "0.75rem" }}
                                        >
                                          {data.availableSlotsCount > 0
                                            ? `${data.availableSlotsCount} slots available`
                                            : "0 slots available"}
                                        </span>
                                      </div>
                                      <p
                                        className="card-price mb-2"
                                        style={{ fontSize: "0.875rem" }}
                                      >
                                        ₹ <del>{data.price}</del> {data.offerPrice}{" "}
                                        /-
                                      </p>
                                      <div className="row mb-2">
                                        <div className="col-6">
                                          <p
                                            className="card-details mb-2"
                                            style={{ fontSize: "0.75rem" }}
                                          >
                                            <i className="bi bi-currency-exchange"></i>{" "}
                                            Extra Person Price:{" "}
                                            {data.extraPersonprice}
                                          </p>
                                        </div>
                                        <div className="col-6">
                                          <p
                                            className="card-details mb-2"
                                            style={{ fontSize: "0.75rem" }}
                                          >
                                            <i className="bi bi-person"></i> Max
                                            People: {data.maxPeople}
                                          </p>
                                        </div>
                                      </div>
                                      <p
                                        className="card-details mb-2"
                                        style={{ fontSize: "0.75rem" }}
                                      >
                                        <i className="bi bi-tv"></i> Features
                                        <ul style={{ paddingLeft: "1.5rem" }}>
                                          {isExpanded
                                            ? data.features.map(
                                              (feature, index) => (
                                                <li key={index}>{feature}</li>
                                              )
                                            )
                                            : data.features
                                              .slice(0, 3)
                                              .map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                              ))}
                                          <span
                                            onClick={toggleView}
                                            style={{
                                              cursor: "pointer",
                                              color: "white",
                                              textDecoration: "underline",
                                              fontSize: "0.75rem",
                                            }}
                                          >
                                            {isExpanded ? "View Less" : "View More"}
                                          </span>
                                        </ul>
                                      </p>
                                      <p
                                        className="card-details mb-2"
                                        style={{ fontSize: "0.75rem" }}
                                      >
                                        <i className="bi bi-info-circle"></i>{" "}
                                        Description:{" "}
                                        {data.description
                                          .split(" ")
                                          .slice(0, 15)
                                          .join(" ")}
                                        {data.description.split(" ").length > 25 &&
                                          "..."}
                                      </p>
                                      <p>
                                        <a
                                          href={data.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn btn-sm btn-danger ms-2"
                                        >
                                          Watch Now
                                        </a>
                                      </p>
                                    </div>

                                    <div>
                                      <div className="slot-selection mb-3">
                                        <p
                                          className="slot-title mb-2"
                                          style={{ fontSize: "0.875rem" }}
                                        >
                                          Choose Your Slot:
                                        </p>
                                        <div className="row">
                                          {data.availableSlots.map((slot, index) => {
                                          const fromTime12 = convertTo12HourFormat(slot.fromTime);
                                          const toTime12 = convertTo12HourFormat(slot.toTime);

                                          return (
                                            <div className="col-6 mb-2" key={index}>
                                              <button
                                                className={`btn w-100 ${slot.isBooked
                                                  ? "btn-secondary"
                                                  : slot.isPast
                                                    ? "btn-light"
                                                    : "btn-light"
                                                  } ${selectedSlot[i] === slot ? "selectedbtns" : ""}`}
                                                onClick={(e) => !slot.isDisabled && handleSlot(e, slot, i)}
                                                style={{
                                                  textDecoration: slot.isBooked ? "line-through" : "none",
                                                  fontSize: "0.8rem",
                                                  padding: "5px",
                                                  opacity: slot.isDisabled ? 0.7 : 1,
                                                  cursor: slot.isDisabled ? "not-allowed" : "pointer"
                                                }}
                                                disabled={slot.isDisabled}
                                                title={slot.isBooked
                                                  ? "This slot is already booked"
                                                  : slot.isPast
                                                    ? "This slot has already passed"
                                                    : "Available slot"}
                                              >
                                                {fromTime12} - {toTime12}
                                                {slot.isPast && !slot.isBooked && (
                                                  <span className="ms-1">(Passed)</span>
                                                )}
                                              </button>
                                            </div>
                                          );
                                        })}
                                        </div>
                                      </div>

                                      <div className="col-12 mt-3">
                                        <button
                                          disabled={!isBookNowActive}
                                          onClick={() => handleBasicPlan(data, i)}
                                          className="btn main-booknow"
                                          style={{
                                            width: "100%",
                                            color: "black",
                                            border: "none",
                                            boxShadow: "none",
                                          }}
                                        >
                                          Book Now
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-12 text-center">
                            <p>No theaters available for the selected location and date.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </main>

              <Modal
                size="md"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header
                  closeButton
                  className="bg-light-grey gradient-border"
                >
                  <Modal.Title
                    id="example-modal-sizes-title-lg gradient-border"
                    style={{ textAlign: "center" }}
                    className="text-gold-gradient"
                  >
                    REQUEST CALLBACK
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark gradient-border">
                  <div className="row justify-content-md-center">
                    <div className="col-lg-12 mt-40 gradient-border">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="booking-form align-items-center justify-content-center">
                            <form
                              className="mt-4 mb-3"
                              onSubmit={(e) => {
                                formsubmit(e);
                              }}
                            >
                              <>
                                <div className="section-title text-center">
                                  <h2 className="title">Enquiry Now</h2>
                                  <hr className="gradient-border"></hr>
                                </div>
                                <div className="mb-3 input-group">
                                  <span className="input-group-text">
                                    <FontAwesomeIcon icon={faUser} />
                                  </span>
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    placeholder="Enter Full Name*"
                                    value={form.name}
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    className="form-control "
                                  />
                                </div>

                                <div className="mb-3 input-group">
                                  <span className="input-group-text">
                                    <FontAwesomeIcon icon={faPhone} />
                                  </span>
                                  <input
                                    required
                                    placeholder="Enter Mobile Number*"
                                    type="text"
                                    name="mobileNumber"
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    maxLength="10"
                                    minLength="10"
                                    pattern="[0-9]{10}"
                                    value={form.mobileNumber}
                                    onKeyPress={(e) => {
                                      const charCode = e.which
                                        ? e.which
                                        : e.keyCode;
                                      if (charCode < 48 || charCode > 57) {
                                        e.preventDefault();
                                      }
                                    }}
                                    className="form-control "
                                  />
                                </div>

                                <div className="mb-3 input-group">
                                  <span className="input-group-text">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                  </span>
                                  <input
                                    required
                                    type="email"
                                    name="email"
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    placeholder="Enter Email*"
                                    value={form.email}
                                    className="form-control"
                                  />
                                </div>

                                <div className="mb-3 input-group">
                                  <span className="input-group-text">
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                  </span>
                                  <input
                                    required
                                    type="text"
                                    name="description"
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    placeholder="Enter Description*"
                                    value={form.description}
                                    className="form-control"
                                  />
                                </div>

                                <div className="mb-3 input-group">
                                  <span className="input-group-text">
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                  </span>
                                  <input
                                    required
                                    type="text"
                                    name="eventName"
                                    placeholder="Enter Event Name*"
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    value={form.eventName}
                                    className="form-control"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="btn main-booknow mb-3 float-end"
                                >
                                  Submit
                                </button>
                              </>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>

              <Modal
                size="md"
                show={modalPop}
                onHide={() => setModalPop(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header
                  closeButton
                  className=" gradient-border bg-light-grey"
                >
                  <Modal.Title
                    id="example-modal-sizes-title-lg gradient-border"
                    style={{ textAlign: "center" }}
                  >
                    <span className="text-gold-gradient"> Note : </span>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark gradient-border">
                  <div className="row justify-content-md-center text-white">
                    <div className="col-lg-12 mt-40 gradient-border bg-dark">
                      <h6 className="p-4 text-center">
                        You have selected a slot with 1.5 hours duration and will
                        be charged accordingly. Proceed further if you are okay
                        with it!
                      </h6>
                      <div className="text-center">
                        <button
                          onClick={() => handleclose()}
                          type="button"
                          className="btn course-btn mb-4 text-center btn-outline text-white"
                        >
                          okay !
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </>
          )}

          <ToastContainer />
          <Footer />
        </div>
      )}
    </>
  );
}

export default Theaters;