// src/components/Theaters.js
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "primereact/calendar";
import Modal from "react-bootstrap/Modal";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import { FaBirthdayCake, FaCar, FaParking, FaPhone } from "react-icons/fa";

function Theaters() {
  const { slug } = useParams(); // e.g., "hyderabad-banjara-hills"
  const locationState = useLocation();
  const [theaters, setTheaters] = useState([]);
  const [allTheatersByLocation, setAllTheatersByLocation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({});
  const [modalPop, setModalPop] = useState(false);
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  const [expandedCards, setExpandedCards] = useState({});
  const toggleView1 = (cardIndex) => {
    setExpandedCards((prev) => ({ ...prev, [cardIndex]: !prev[cardIndex] }));
  };
  const [date, setDate] = useState(getTodayDateString());
  const [activeshow, setActiveshow] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [nintymin, setnintymin] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [location, setLocation] = useState(null);
  const [activeIndices, setActiveIndices] = useState({});
  const BaseUrl = "https://api.carnivalcastle.com/";
  const navigate = useNavigate();

  // Get all addresses on component mount
  useEffect(() => {
    const fetchAllAddresses = async () => {
      try {
        const res = await axios.get(
          "https://api.carnivalcastle.com/v1/carnivalApi/admin/address/alladdress"
        );
        if (res.data?.success) {
          setAddresses(res.data.data || []);
          console.log("All addresses loaded:", res.data.data);
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };
    fetchAllAddresses();
  }, []);

  // Get location from state or refetch
  useEffect(() => {
    const fetchLocation = async () => {
      if (locationState.state?.address) {
        setLocation(locationState.state.address);
        await fetchTheatersByAddressId(locationState.state.address._id, date);
        await fetchAllTheatersGroupedByLocation(date);
      } else {
        // Fallback: fetch all addresses and match by slug
        try {
          const res = await axios.get(
            "https://api.carnivalcastle.com/v1/carnivalApi/admin/address/alladdress"
          );

          setAddresses(res.data.data || []);
          if (res.data?.success) {

            const matched = res.data.data.find(addr =>
              addr.name.toLowerCase().replace(/\s+/g, '-') === slug
            );

            console.log("All addresses:", res.data.data);
            if (matched) {
              setLocation(matched);
              await fetchTheatersByAddressId(matched._id, date);
              await fetchAllTheatersGroupedByLocation(date);
            } else {
              toast.error("Location not found");
              navigate("/locations");
            }
          }
          console.log("Fetched addresses for location matching");
        } catch (err) {
          console.error("Failed to load location", err);
          navigate("/locations");
        }
      }
    };

    if (slug) {
      fetchLocation();
    }
  }, [slug, date]);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const dd = dateObj.getDate().toString().padStart(2, "0");
    const mm = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const formattedDateString = formatDate(date);

  const fetchTheatersByAddressId = async (addressId, selectedDate = date) => {
    setIsLoading(true);
    try {
      if (!addressId) return;
      const formattedDate = formatDate(selectedDate);
      const res = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/getalltheatres/forweb",
        { slotDate: formattedDate }
      );
      if (res.data?.success) {
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
            const slotStart = new Date(selectedDate);
            slotStart.setHours(slotHours, slotMinutes, 0, 0);
            const slotEnd = new Date(selectedDate);
            slotEnd.setHours(endHours, endMinutes, 0, 0);
            const currentSelectedDate = new Date(selectedDate);
            const isToday =
              currentSelectedDate.getFullYear() === now.getFullYear() &&
              currentSelectedDate.getMonth() === now.getMonth() &&
              currentSelectedDate.getDate() === now.getDate();
            const isBooked = slot.isBooked || false;
            const isPast = isToday && now > slotEnd;
            const isAlmostOver = isToday && !isPast && (slotEnd - now <= 10 * 60 * 1000);
            const isDisabled = isBooked || isPast || isAlmostOver;
            return { ...slot, isBooked, isPast, isAlmostOver, isDisabled };
          });
          return { ...theater, availableSlots: processedSlots };
        });
        setTheaters(processedTheaters);
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
      toast.error("Failed to fetch theaters.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllTheatersGroupedByLocation = async (selectedDate = date) => {
    try {
      const formattedDate = formatDate(selectedDate);
      const res = await axios.post(
        "https://api.carnivalcastle.com/v1/carnivalApi/web/getalltheatres/forweb",
        { slotDate: formattedDate }
      );
      if (res.data?.success) {
        const now = new Date();
        const processedTheaters = res.data.theatres.map(theater => {
          const processedSlots = (theater.availableSlots || []).map(slot => {
            const [slotHours, slotMinutes] = slot.fromTime.split(':').map(Number);
            const [endHours, endMinutes] = slot.toTime.split(':').map(Number);
            const slotStart = new Date(selectedDate);
            slotStart.setHours(slotHours, slotMinutes, 0, 0);
            const slotEnd = new Date(selectedDate);
            slotEnd.setHours(endHours, endMinutes, 0, 0);
            const currentSelectedDate = new Date(selectedDate);
            const isToday =
              currentSelectedDate.getFullYear() === now.getFullYear() &&
              currentSelectedDate.getMonth() === now.getMonth() &&
              currentSelectedDate.getDate() === now.getDate();
            const isBooked = slot.isBooked || false;
            const isPast = isToday && now > slotEnd;
            const isAlmostOver = isToday && !isPast && (slotEnd - now <= 10 * 60 * 1000);
            const isDisabled = isBooked || isPast || isAlmostOver;
            return { ...slot, isBooked, isPast, isAlmostOver, isDisabled };
          });
          return { ...theater, availableSlots: processedSlots };
        });

        const grouped = {};
        processedTheaters.forEach(theater => {
          const addrId = typeof theater.address === 'string' ? theater.address : theater.address?._id;
          if (!grouped[addrId]) {
            // Find the address object from the addresses array
            const addressObj = addresses.find(addr => addr._id === addrId) || theater.address;
            grouped[addrId] = { addressObj, theaters: [] };
          }
          grouped[addrId].theaters.push(theater);
        });
        setAllTheatersByLocation(grouped);
        console.log("Grouped theaters by location:", grouped);
      }
    } catch (error) {
      console.error("Error fetching all theaters:", error);
    }
  };

  const handleCarouselSelect = (selectedIndex, theaterIndex) => {
    setActiveIndices(prev => ({ ...prev, [theaterIndex]: selectedIndex }));
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
    sessionStorage.setItem("date", formattedDateString);
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleView = () => setIsExpanded(!isExpanded);

  const [form, setform] = useState({
    name: "", email: "", mobileNumber: "", description: "", eventName: "",
  });
  const [lgShow, setLgShow] = useState(false);
  const modelshow = () => setLgShow(true);
  const formsubmit = (e) => {
    e.preventDefault();
    EnquiryNow();
  };
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    if (!selectedDate) return;
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
    if (location?._id) {
      await fetchTheatersByAddressId(location._id, selectedDate);
      await fetchAllTheatersGroupedByLocation(selectedDate);
    }
  };

  const EnquiryNow = () => {
    const dataArray = { ...form };
    axios.post(URLS.AddEnquiry, dataArray).then(
      (res) => {
        if (res.status === 200) {
          toast(res.data.message);
          setLgShow(false);
          setform({ name: "", email: "", mobileNumber: "", description: "", eventName: "" });
        }
      },
      (error) => {
        if (error.response?.status === 400) {
          toast(error.response.data.message);
        }
      }
    );
  };

  const [Contact, setContact] = useState([]);
  useEffect(() => {
    GetFooterData();
  }, []);
  const GetFooterData = () => {
    axios.post(URLS.GetFooter, {}, {}).then((res) => {
      if (res.status === 200) {
        setContact(res.data.contactus || []);
      }
    });
  };

  const convertTo12HourFormat = (time24) => {
    const [hoursStr, minutes] = time24.split(":");
    const hours = parseInt(hoursStr, 10);
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    const period = hours < 12 ? "AM" : "PM";
    return `${hours12}:${minutes.padStart(2, "0")} ${period}`;
  };

  const calculateDuration = (fromTime, toTime) => {
    const [fromH, fromM] = fromTime.split(":").map(Number);
    const [toH, toM] = toTime.split(":").map(Number);
    let start = fromH * 60 + fromM;
    let end = toH * 60 + toM;
    if (end <= start) end += 24 * 60;
    const diffMinutes = end - start;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}:${minutes === 0 ? "00" : minutes} hr`;
  };

  const handleSlot = (e, data, index) => {
    e.preventDefault();
    if (!data.isBooked) {
      setSelectedSlot((prevState) => ({ ...prevState, [index]: data }));
    }
    setActiveshow(data);
    setActiveSlot(data);
    const fromTime12 = convertTo12HourFormat(data.fromTime);
    const toTime12 = convertTo12HourFormat(data.toTime);
    sessionStorage.setItem("slot", `${fromTime12} - ${toTime12}`);
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
    return (toDate - fromDate) / (1000 * 60);
  };

  const handleclose = () => setModalPop(false);

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

  const getAddressNameById = (id) => {
    if (!id) return "Unknown Location";

    // First check if it's the current location
    if (location && location._id === id) {
      return `${location.name}, ${location.city}`;
    }

    // Check in addresses array
    const addr = addresses.find(a => a._id === id);
    if (addr) {
      return `${addr.name}, ${addr.city}`;
    }

    // If not found in addresses, check if it's in the grouped data
    const group = allTheatersByLocation[id];
    if (group && group.addressObj) {
      const addrObj = group.addressObj;
      if (typeof addrObj === 'object') {
        return `${addrObj.name}, ${addrObj.city}`;
      }
    }

    return "Unknown Location";
  };

  useEffect(() => {
    getOneGst();
  }, []);
  const getOneGst = async () => {
    try {
      const res = await axios.post(URLS.GetCharges, {});
      if (res.status === 200) {
        sessionStorage.setItem("advancePayment", res.data.charges.advancePayment);
      }
    } catch (error) {
      console.error("Error fetching GST:", error);
    }
  };

  // Refresh all theaters when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && location?._id) {
      fetchAllTheatersGroupedByLocation(date);
    }
  }, [addresses, location, date]);

  const [showModal, setShowModal] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");

  const handleOpenModal = (url) => {
    const videoId = extractYouTubeID(url);
    setEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmbedUrl(""); // stops video playback
  };

  const extractYouTubeID = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const dateRef = useRef(null);

  const openCalendar = () => {
    if (dateRef.current) {
      if (dateRef.current.showPicker) {
        dateRef.current.showPicker(); // For modern browsers
      } else {
        dateRef.current.focus(); // Fallback
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center" style={{ padding: "100px" }}>
        <div className="spinner-border text-purple" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="text-center" style={{ padding: "100px" }}>
        <p>Loading location...</p>
      </div>
    );
  }

  // Theater card component to avoid code duplication
  const TheaterCard = ({ data, i, locationName, isOtherLocation = false }) => {
    const isBookNowActive = selectedSlot[i] !== undefined;
    const colors = ["danger", "success", "warning", "primary"];
    const bgColor = colors[i % colors.length];
    const theaterCapacities = {
      "Iris Theatre": 20,
      "Joy Theatre": 20,
      "Ruby Theatre": 2,
      "Vibe Theatres": 15,
      "Carnival Den": 15,
      "Amora Theatre": 6,
    };
    const maxPeople = theaterCapacities[data.name] || data.maxPeople;

    return (
      <div className="col-12 col-sm-6 col-md-4 mb-4 d-flex" key={i}>
        <div
          className="card rounded-5 bg-white shadow-lg text-dark flex-fill"
          style={{ minHeight: "100%", overflow: "hidden" }}
        >
          <div style={{ position: "relative", padding: "10px" }}>
            <div className="course-img" style={{ position: "relative" }}>
              <div className="doc-img">
                <Carousel
                  interval={3000}
                  controls={false}
                  activeIndex={activeIndices[i] || 0}
                  onSelect={(selectedIndex) => handleCarouselSelect(selectedIndex, i)}
                >
                  {data.image?.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <div style={{ position: "relative" }}>
                        <span
                          className={`badge bg-${bgColor} text-white`}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            zIndex: 2,
                            fontSize: "0.75rem",
                          }}
                        >
                          {data.availableSlotsCount > 0
                            ? `${data.availableSlotsCount} slots available`
                            : "0 slots available"}
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "10px",
                            zIndex: 2,
                            fontSize: "0.75rem",
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-light ms-2 fw-bold d-flex align-items-center"
                            onClick={() => handleOpenModal(data.link)}
                          >
                            <i className="fa-brands fa-youtube text-danger fa-xl me-2"></i>
                            Watch Now
                          </button>
                        </span>

                        <img
                          src={BaseUrl + img}
                          alt=""
                          className="img-fluid"
                          style={{
                            height: "250px",
                            borderRadius: "10px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </Carousel.Item>
                  ))}
                  {data.video && (
                    <Carousel.Item>
                      <div style={{ position: "relative" }}>
                        <span
                          className={`badge bg-${bgColor} text-white`}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            zIndex: 2,
                            fontSize: "0.75rem",
                          }}
                        >
                          {data.availableSlotsCount > 0
                            ? `${data.availableSlotsCount} slots available`
                            : "0 slots available"}
                        </span>
                        <video
                          src={URLS.Base + data.video}
                          className="img-fluid video-mobile"
                          style={{
                            height: "200px",
                            borderRadius: "10px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          autoPlay
                          loop
                          muted
                          preload="auto"
                        />
                      </div>
                    </Carousel.Item>
                  )}
                </Carousel>
              </div>
            </div>
          </div>
          <div className="card-body" >
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title m-0 dark-text" style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                    {data.name}
                  </h5>
                  <p className="fs-7">
                    <strong>
                      <i className="fa-solid fa-location-dot" style={{ color: "#000" }}></i>
                      {locationName}
                    </strong>
                  </p>
                </div>
                <div>
                  <p className="card-price mb-2 dark-text" style={{ fontFamily: "'Fraunces', serif" }}>
                    <span style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                      ₹{" "}
                      {selectedSlot[i]
                        ? selectedSlot[i].duration === "1:30 hr"
                          ? data.oneandhalfslotPrice
                          : selectedSlot[i].offerPrice ?? data.offerPrice
                        : data.offerPrice}
                      /-
                    </span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 400, marginLeft: "0.5rem" }}>
                      for upto {data.maxPeople} {data.maxPeople > 1 ? "people" : "person"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="row align-items-center mb-2 text-center text-md-start g-2">
                <div className="col-6 col-sm-6">
                  <p className="card-details mb-2 light-text" style={{ fontSize: "0.85rem", display: "flex", justifyContent: "center" }}>
                    <span className="fw-semibold px-3 py-1 rounded-pill dark-text d-inline-block" style={{ whiteSpace: "nowrap" }}>
                      Extra Person: ₹
                      {selectedSlot[i]
                        ? selectedSlot[i].duration === "1:30 hr"
                          ? data.onehalfanhourExtraPersonPrice
                          : data.extraPersonprice
                        : data.extraPersonprice}
                      /-
                    </span>
                  </p>
                </div>
                <div className="col-6 col-sm-6">
                  <p className="card-details mb-2 light-text" style={{ fontSize: "0.85rem", display: "flex", justifyContent: "center" }}>
                    <span className="fw-semibold px-3 py-1 rounded-pill dark-text d-inline-block" style={{ whiteSpace: "nowrap" }}>
                      <i className="bi bi-person-fill me-1"></i> Max {data.maxSeating} People
                    </span>
                  </p>
                </div>
              </div>
              <p className="card-details light-text" style={{ fontSize: "0.75rem" }}>
                <span className="fw-bold"><i className="bi bi-tv-fill"></i> Features</span>
                <div className="row mt-1">
                  {(expandedCards[i] ? data.features : data.features.slice(0, 4)).map((feature, idx) => (
                    <div key={idx} className="col-6 mb-1 d-flex align-items-start">
                      <i className="bi bi-star-fill" style={{ fontSize: "0.65rem", color: "#40008C", marginRight: "6px", marginTop: "2px" }}></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                {data.features.length > 4 && (
                  <div
                    onClick={() => toggleView1(i)}
                    style={{
                      cursor: "pointer",
                      color: "#40008C",
                      textDecoration: "underline",
                      fontSize: "0.75rem",
                      marginTop: "4px",
                    }}
                  >
                    {expandedCards[i] ? "View Less" : "View More"}
                  </div>
                )}
              </p>
            </div>
            <div>
              <div className="slot-selection mb-3">
                <p className="slot-title mb-2 dark-text" style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                  Select Time Slot
                </p>
                <div style={{ display: "flex", gap: "0.6rem", overflowX: "auto", paddingBottom: "6px" }}>
                  {data.availableSlots?.map((slot, idx) => {
                    const fromTime12 = convertTo12HourFormat(slot.fromTime);
                    const toTime12 = convertTo12HourFormat(slot.toTime);
                    const duration = calculateDuration(slot.fromTime, slot.toTime);
                    const isSelected = selectedSlot[i] && selectedSlot[i]._id === slot._id;
                    let discount = null;
                    if (duration === "1:30 hr" && data.offerPrice && data.oneandhalfslotPrice) {
                      discount = data.offerPrice - data.oneandhalfslotPrice;
                    }
                    return (
                      <div key={idx} style={{ flex: "0 0 auto", textAlign: "center" }}>
                        <button
                          className="btn"
                          onClick={(e) => handleSlot(e, { ...slot, duration }, i)}
                          style={{
                            minWidth: "50px",
                            height: "60px",
                            padding: "0px 0px",
                            fontSize: "0.7rem",
                            fontWeight: "500",
                            lineHeight: "1.2",
                            borderRadius: "8px",
                            border: isSelected ? "2px solid #40008C" : "1px solid #ccc",
                            backgroundColor: slot.isBooked ? "#f1f1f1" : isSelected ? "#40008C" : "#fff",
                            color: slot.isBooked ? "#888" : isSelected ? "#fff" : "#000",
                            textDecoration: slot.isBooked ? "line-through" : "none",
                            cursor: slot.isBooked ? "not-allowed" : "pointer",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          disabled={slot.isBooked}
                        >
                          <span>{fromTime12}</span>-
                          <span>{toTime12}</span>
                        </button>
                        {discount !== null && !slot.isBooked && (
                          <div style={{ fontSize: "0.65rem", color: "#28a745", marginTop: "4px", fontWeight: "600" }}>
                            Rs {discount} less
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {selectedSlot[i] ? (
                <div className="mt-3">
                  <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#000" }}>
                    ₹{selectedSlot[i].duration === "1:30 hr" ? data.oneandhalfslotPrice : selectedSlot[i].offerPrice ?? data.offerPrice}
                    <span style={{ fontSize: "0.85rem", fontWeight: "500" }}> for up to {data.maxPeople} people</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "2px" }}>
                    Additional ₹
                    {selectedSlot[i]
                      ? selectedSlot[i].duration === "1:30 hr"
                        ? data.onehalfanhourExtraPersonPrice
                        : data.extraPersonprice
                      : data.extraPersonprice}
                    /- per person after {data.maxPeople} people
                  </div>
                </div>
              ) : (
                <div className="mt-3" style={{ fontSize: "0.8rem", color: "#666" }}>
                  Select a slot to check price
                </div>
              )}
              <div className="col-12 mt-3">
                <button
                  disabled={!isBookNowActive}
                  onClick={() => handleBasicPlan(data, i)}
                  className="btn"
                  style={{
                    width: "100%",
                    color: "white",
                    border: "none",
                    fontWeight: "600",
                    borderRadius: "8px",
                    padding: "10px",
                    backgroundColor: isBookNowActive ? "#40008C" : "#A88FC7",
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
  };

  return (
    <>
      <Helmet>
        <title>Best Surprise Party Places in {location.name} | Private Theater</title>
        <meta
          name="description"
          content={`Celebrate at Bing Enjoy Private Theatres in ${location.name}. Perfect for birthdays, anniversaries, & special events with custom decor, food & privacy. Book now!!`}
        />
      </Helmet>
      <div className="home-page indexsix">
        <Header />
        <main className="main-wrapper">
          <section
            id="parallax"
            className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix lightdark-back position-relative"
            style={{ minHeight: "200px", background: "#C69FF4" }}
          >
            <div className="container-fluid position-relative">
              {/* Back Button */}
              <button
                type="button"
                className="btn dark-back shadow-lg text-light position-absolute back-btn"
                style={{
                  top: "10px",
                  left: "15px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  fontSize: "14px",
                  padding: "6px 12px",
                  zIndex: 10
                }}
                onClick={() => navigate(-1)}
              >
                <i className="far fa-arrow-alt-circle-left me-2"></i> Back
              </button>

              <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                  <div className="breadcrumb-wrap text-center px-3 px-md-0">
                    <div className="breadcrumb-title mb-20 mb-md-30 dark-text">
                      <h1 className="display-5 display-md-4 display-lg-3 display-xl-2 fw-bold"
                        style={{ marginTop: "40px", marginBottom: "15px" }}>
                        Choose your dream theatre setup in {location.name}
                      </h1>
                    </div>
                    <p className="light-text fs-6 fs-md-5 mb-0">
                      <i>From royal vibes to romantic corners - pick your perfect match!</i>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <style jsx>{`
    /* Mobile First Approach */
    .back-btn {
      font-size: 14px;
      padding: 6px 12px;
      top: 10px;
      left: 15px;
    }

    /* Small devices (landscape phones, 576px and up) */
    @media (min-width: 576px) {
      .back-btn {
        font-size: 15px;
        padding: 8px 16px;
        top: 15px;
        left: 20px;
      }
    }

    /* Medium devices (tablets, 768px and up) */
    @media (min-width: 768px) {
      .back-btn {
        font-size: 16px;
        padding: 10px 20px;
        top: 20px;
        left: 25px;
      }
    }

    /* Large devices (desktops, 992px and up) */
    @media (min-width: 992px) {
      .back-btn {
        top: 20px;
        left: 30px;
      }
    }

    /* Extra large devices (large desktops, 1200px and up) */
    @media (min-width: 1200px) {
      .back-btn {
        top: 25px;
        left: 35px;
      }
    }
  `}</style>
          </section>

          <section
            className="shop-area pt-0 pb-5 p-relative"
            style={{ background: "#C69FF4" }}
          >
            <div className="container-fluid">
              <div className="row mb-3">
                <div className="col-12">

                  {/* CLICKABLE CONTAINER */}
                  <div
                    className="p-3 rounded shadow-sm"
                    
                    style={{
                      backgroundColor: "#FAF9F7",
                      border: "1px solid #E0E0E0",
                      borderRadius: "8px",
                      maxWidth: "500px",
                      margin: "0 auto",           // shows pointer cursor
                    }}
                  >
                    <label
                      className="fw-bold text-dark mb-2"
                      style={{ fontSize: "18px" }}
                    >
                      Select Your Date
                    </label>

                    <div className="d-flex gap-2" style={{ cursor: "pointer"}} onClick={openCalendar}>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-calendar-event"></i>
                        </span>

                        {/* Date Input */}
                        <input
                          type="date"
                          ref={dateRef}                    // <-- ref attached here
                          className="form-control border-start-0"
                          value={date}
                          min={getTodayDateString()}
                          onChange={handleDateChange}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </div>

                    <p
                      className="mt-2 mb-0"
                      style={{
                        fontStyle: "italic",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      <i className="fa-solid fa-burger light-text"></i> Food and Beverages can be ordered at theater
                    </p>
                  </div>
                </div>
              </div>
              <br />

              <div className="container-fluid">
                <div className="row">
                  {theaters.length > 0 ? (
                    theaters.map((data, i) => (
                      <TheaterCard
                        key={i}
                        data={data}
                        i={i}
                        locationName={`${location.name}, ${location.city}`}
                      />
                    ))
                  ) : (
                    <div className="col-12 text-center">
                      <p>No theaters available for the selected location and date.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Other Locations Section */}
          {Object.keys(allTheatersByLocation).length > 0 && (
            <section className="shop-area pt-5 pb-5 p-relative" style={{ background: "#E9DCFF" }}>
              <div className="container-fluid">
                <h3 className="text-center mb-4" style={{ color: "#40008C" }}>Theaters in Other Locations</h3>
                {Object.entries(allTheatersByLocation)
                  .filter(([addrId]) => addrId !== location._id)
                  .map(([addrId, group]) => {
                    const locationName = getAddressNameById(addrId);
                    console.log("Rendering location:", locationName, "for ID:", addrId);

                    return (
                      <div key={addrId} className="mb-5">
                        <h4 className="mb-3" style={{ borderBottom: "2px solid #E9DCFF", paddingBottom: "8px", color: "#40008C" }}>
                          {locationName}
                        </h4>
                        <div className="row">
                          {group.theaters?.map((data, i) => (
                            <TheaterCard
                              key={i}
                              data={data}
                              i={i}
                              locationName={locationName}
                              isOtherLocation={true}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}

          <section className="p-5 px-2 px-md-4 d-flex justify-content-center lighter-back">
            <div
              className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 p-4 bg-white shadow-lg"
              style={{ borderRadius: '12px' }}
            >
              <div>
                <h5 className="fw-bold mb-1 text-dark">Hurry! Slots get booked fast.</h5>
                <p className="fst-italic text-secondary m-0">Extra charges apply if guests exceed max limit.</p>
              </div>
              <div>
                <button
                  className="btn text-white fw-semibold"
                  style={{
                    backgroundColor: '#a341e0',
                    padding: '10px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                  }}
                  onClick={() => navigate('/locations')}
                >
                  Book Your Experience Now
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Modals */}
        <Modal size="md" show={lgShow} onHide={() => setLgShow(false)}>
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>REQUEST CALLBACK</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={formsubmit}>
              <div className="mb-3 input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                <input required type="text" name="name" placeholder="Enter Full Name*" value={form.name} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3 input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faPhone} /></span>
                <input required placeholder="Enter Mobile Number*" type="text" name="mobileNumber" onChange={handleChange} maxLength="10" pattern="[0-9]{10}" value={form.mobileNumber} className="form-control" />
              </div>
              <div className="mb-3 input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                <input required type="email" name="email" onChange={handleChange} placeholder="Enter Email*" value={form.email} className="form-control" />
              </div>
              <div className="mb-3 input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                <input required type="text" name="description" onChange={handleChange} placeholder="Enter Description*" value={form.description} className="form-control" />
              </div>
              <div className="mb-3 input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                <input required type="text" name="eventName" placeholder="Enter Event Name*" onChange={handleChange} value={form.eventName} className="form-control" />
              </div>
              <button type="submit" className="btn main-booknow mb-3 float-end">Submit</button>
            </form>
          </Modal.Body>
        </Modal>

        <Modal show={modalPop} onHide={handleclose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6 className="p-4 text-center">
              You have selected a slot with 1.5 hours duration and will be charged accordingly. Proceed further if you are okay with it!
            </h6>
            <div className="text-center">
              <button onClick={handleclose} className="btn light-back text-light mb-4">Okay!</button>
            </div>
          </Modal.Body>
        </Modal>

        {/* Video Modal */}
        {showModal && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
            tabIndex="-1"
            onClick={handleCloseModal}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              onClick={(e) => e.stopPropagation()} // prevents modal close when clicking inside
            >
              <div className="modal-content bg-dark border-0">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-white">Now Playing</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body p-0">
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={embedUrl}
                      title="YouTube Video"
                      allowFullScreen
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        <ToastContainer />
        <Footer />
      </div>
    </>
  );
}

export default Theaters;