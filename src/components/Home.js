import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import Accordion from "react-bootstrap/Accordion";
import Modal from "react-bootstrap/Modal";
import Slider from "react-slick";
import { URLS } from "../Url";
import Footer from "./Footer";
import Header from "./Header";
import Typer from "./Typer";
import axios from "axios";
import roses from "./images/roses.jpg";
import cake4 from "./images/cake 4.jpg";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Galleria } from "primereact/galleria";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import beverages from "./images/foodbeverages.jpg";
import screening from "./images/screening.jpg";
import { Helmet } from "react-helmet";
import {
  faUser,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../components/carnival_footer_logo-2-removebg-preview.png";
function Home() {

  const [isLoading, setIsLoading] = useState(false);

  const [form, setform] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    description: "",
    eventName: "",
  });

  useEffect(() => {
    GetHomePage();
    GetAllGalleryDate();
  }, []);

  const [Faqs, setFaqs] = useState([]);
  const [Sliders, setSliders] = useState([]);
  console.log(Sliders);
  const [Howtojoin, setHowtojoin] = useState([]);
  const [LatestInfo, setLatestInfo] = useState([]);
  const [LatestInfos, setLatestInfos] = useState([]);
  console.log(LatestInfos);
  const [Highlights, setHighlights] = useState([]);
  const [Testimonial, setTestimonial] = useState([]);
  const [Howtojoinpoints, setHowtojoinpoints] = useState([]);
  const [HighlightsPoints, setHighlightsPoints] = useState([]);

  const [Offers, setOffers] = useState([]);
  const [services, setservices] = useState([]);

  const [Contact, setContact] = useState([]);

  const [PopUp, setPopUp] = useState([]);

  const GetHomePage = () => {
    axios.post(URLS.AllModules, {}, {}).then((res) => {
      if (res.status === 200) {
        setFaqs(res?.data?.faqs);
        setContact(res?.data?.contactus[0]);
        setSliders(res?.data?.homesliders);
        setTestimonial(res?.data?.testimonials);
        setHowtojoin(res?.data?.howtojoin[0]);
        setHighlights(res?.data?.highlight[0]);
        setLatestInfo(res?.data?.latestinfo[0]);
        setLatestInfos(res?.data?.latestinfo[0]?.count);
        setHighlightsPoints(res?.data?.highlight[0]?.features);
        setHowtojoinpoints(res?.data?.howtojoin[0]?.benefits);
        setPopUp(res?.data?.popup[0]);
        setOffers(res?.data?.offer);
        setservices(res?.data?.occasions);
        setLgShow(res?.data?.popup[0]?.popupBoolean);
        setIsLoading(false);
      }
    });
    sessionStorage.clear();
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

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  const settings4 = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          dots: false,
        },
      },
    ],
  };

  const settings2 = {
    dots: false,
    infinite: true,
    arrows: true,
    autoplay: false,
    speed: 1000,
    // slidesToShow: 4,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const settings3 = {
    dots: false,
    autoplay: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [images, setImages] = useState([]);

  const GetAllGalleryDate = () => {
    axios.post(URLS.GetAllGallery, {}, {}).then((res) => {
      if (res.status === 200) {
        setImages(res?.data?.gallerys?.slice(0, 3));
      }
    });
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const galleria = useRef(null);

  const itemTemplate = (item) => {
    return (
      <img
        src={URLS.Base + item.image}
        alt={item.alt}
        style={{ width: "100%", display: "block" }}
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        src={URLS.Base + item.image}
        alt={item.alt}
        style={{ display: "block" }}
      />
    );
  };

  const [timeLeft, setTimeLeft] = useState(39639);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  const [Theaters, setTheaters] = useState([]);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    GetTheatersData();
  }, []);

  const GetTheatersData = () => {
    axios.post(URLS.GetAllTheaters, {}, {}).then((res) => {
      if (res.status === 200) {
        setTheaters(res.data.theatres);
      }
    });
  };

  const today = new Date();

  const [date, setDate] = useState(today);

  const dateString = date;

  const dateObject = new Date(dateString);

  const dd = dateObject.getDate().toString().padStart(2, "0");
  const mm = (dateObject.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = dateObject.getFullYear();

  const formattedDateString = `${yyyy}-${mm}-${dd}`;

  const databyid = (data) => {
    sessionStorage.clear();
    axios.post(URLS.GetUnicId, {}, {}).then((res) => {
      if (res.status === 200) {
        sessionStorage.setItem("UserId", res.data.userId);
        sessionStorage.setItem("Theaterid", data._id);
        sessionStorage.setItem("theatreName", data.name);
        sessionStorage.setItem("theatrePrice", data.offerPrice);
        sessionStorage.setItem("date", formattedDateString);
        window.location.href = "/BookingDetails";
      }
    });
  };

  const navigateTheater = useNavigate();
  const handleTheater = () => {
    navigateTheater("./theaters");
  };

  const [PopUp1, setPopUp1] = useState([]);

  useEffect(() => {
    GetFooterData();
  }, []);

  const GetFooterData = () => {
    axios.post(URLS.GetFooter, {}, {}).then((res) => {
      if (res.status === 200) {
        setContact(res.data.contactus);
        setPopUp1(res.data.popup[0]);
      }
    });
  };

  const [lgvis, setLgVis] = useState(false);

  const modelShow = () => {
    setLgVis(!false);
  };


    const [lgShow, setLgShow] = useState(false);




useEffect(() => {
  const isModalShown = localStorage.getItem("popupShown");
  if (!isModalShown) {
    setLgShow(true);
  }
}, []);

const handleClose = () => {
  setLgShow(false);
  localStorage.setItem("popupShown", "true");
};
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          Carnival Castle | Best Private Theaters for Celebrations in Hyderabad
        </title>
        <meta
          name="description"
          content="Experience the magic of celebrations at Carnival Castle Private Theatres in Hyderabad. Perfect for Birthdays, Anniversaries, Bride To Be, Surprise Parties, etc"
        />
      </Helmet>

      {isLoading == true ? (
        <>
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
                style={{ height: "300px", color: "white" }}
              ></img>
              <h6 style={{ color: "gold" }}>Loading...</h6>
            </div>
          </div>
        </>
      ) : (
        <>
          <div class="home-page indexsix bg-dark">
            <div class="main-wrapper bg-dark">
              <>
                <Header />
                <div className="scrollbar">
                  <Slider {...settings}>
                    {Sliders?.map((data, i) => {
                      return (
                        <div key={i}>
                          {PopUp1.modalEnabled == true ? (
                            <div className="marquee-bg border-gradient border-gradient-gold only-bottom-border bg-danger">
                              <div className="p-1">
                                <marquee
                                  className="text-white"
                                  style={{ marginTop: "10px" }}
                                >
                                  <span style={{ color: "white" }}>
                                    LAST MINUTE OFFER: {PopUp1.title}
                                  </span>
                                </marquee>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <section
                            className="section section-banner"
                            id="Zoomed"
                            style={{
                              background: `#f9f9f9 url(${
                                URLS.Base + data.image
                              })`,
                              backdropFilter: "blur(12px)",
                              minHeight: "100vh",
                              position: "relative",
                              padding: "30px 0 0",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              width: "100%",
                              zIndex: 0,
                              color: "#fff",
                            }}
                          >
                            <div className="container">
                              <div className="banner-wrapper">
                                <div className="wrapper-content text-center">
                                  <div className="banner-header container-md">
                                    <h1>
                                      <Typer
                                        text={data.title}
                                        typingSpeed={100}
                                      />
                                    </h1>
                                    <p>{data?.description}</p>
                                  </div>
                                  <li
                                    className="nav-item contact-item"
                                    style={{ listStyle: "none" }}
                                  >
                                    <div className="col-6 mb-1 w-100 gap-3 d-flex justify-content-center flex-wrap">
                                      <a
                                        href="/theaters"
                                        className="btn main-booknow mb-2 d-inline-block"
                                      >
                                        {/* <i className="fas fa-ticket-alt" />{" "} */}
                                        <span className="fs-20 fw-bold">
                                          Book Now
                                        </span>
                                      </a>

                                      <a
                                        className="btn main-booknow mb-2 d-inline-block"
                                        href="tel:'9059382797"
                                      >
                                        {/* <i className="fas fa-ticket-alt" />{" "} */}
                                        <span
                                          className="fs-20 fw-bold"
                                          // onClick={() => {
                                          //   modelShow();
                                          // }}
                                        >
                                          Book Via Call
                                        </span>
                                      </a>
                                    </div>
                                  </li>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      );
                    })}
                  </Slider>
                </div>

                {/* Timings */}

                <section className="pt-2 pb-2 p-relative bg-dark">
                  {Offers.length == 0 ? (
                    ""
                  ) : (
                    <div className="container-md">
                      <Slider {...settings4}>
                        {Offers?.map((data, i) => (
                          <div className="timer-container   box-dark" key={i}>
                            <div className="row" >
                              <div className="col-md-8 col-12">
                                <div className="offer-text text-gold-gradient">
                                  {data.title}
                                </div>
                                <div className="sub-text">
                                  {data.description}
                                </div>
                              </div>
                              <div className="col-md-4 col-12">
                                <div className="timer">
                                  <div className="time-part">
                                    {hours} <span>Hrs</span>
                                  </div>
                                  <div className="time-part">
                                    : {minutes} <span>Mins</span>
                                  </div>

                                  <div className="time-part">
                                    : {seconds} <span>Sec</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  )}
                </section>
                <Modal
                  size="md"
                  show={lgvis}
                  onHide={() => setLgVis(false)}
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
                            <div class="booking-form align-items-center justify-content-center">
                              {/* <form
                            className="mt-4 mb-3"
                            onSubmit={(e) => {
                              formsubmit(e);
                            }}
                          >
                            <>
                              <div className="mb-4">
                                <input
                                  required
                                  type="text"
                                  name="name"
                                  placeholder="Enter Full Name"
                                  value={form.name}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  className="form-control "
                                />
                              </div>
                              <div className="mb-4">
                                <input
                                  required
                                  placeholder="Enter Mobile Number"
                                  type="text"
                                  name="mobileNumber"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  maxlength="10"
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
                              <div className="mb-4">
                                <input
                                  required
                                  type="email"
                                  name="email"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  placeholder="Enter Email"
                                  value={form.email}
                                  className="form-control"
                                />
                              </div>
                              <div className="mb-4">
                                <input
                                  required
                                  type="text"
                                  name="description"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  placeholder="Enter Description"
                                  value={form.description}
                                  className="form-control"
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn course-btn mb-3 text-white"
                                style={{ float: "right" }}
                              >
                                Submit
                              </button>
                            </>
                          </form> */}
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
                                      maxlength="10"
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

                {/* Birthdays, annverydays, etc  */}
                {/* <section className="pt-2 pb-5">
                  <div className="container-md">
                    <div className="row align-items-center">
                      <div className="col-lg-12">
                      </div>
                      <div className="col-lg-12">
                        <div>
                          <div>
                            <div
                              style={{
                                backgroundImage: `url(${backgroundImageUrl})`,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                height: "80px",
                                width: "100%",
                              }}
                            >
                              <div className="row m-4">
                                {LatestInfos?.map((data, i) => {
                                  return (
                                    <>
                                      <div
                                        className="col"
                                        key={i}
                                        style={{ textAlign: "center" }}
                                      >
                                        <div className="pt-2">
                                          <h6
                                            style={{
                                              color: "black",
                                              fontSize: "12px",
                                            }}
                                          >
                                            {data?.title}
                                          </h6>
                                          <b style={{ color: "black" }}>
                                            {data?.count}
                                          </b>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section> */}

                <section className="pt-2 bg-dark">
                  <div className="container-md">
                    <div className="row align-items-center">
                      <div className="col-lg-12">
                        <div className="row">
                          {LatestInfos?.map((data, i) => {
                            return (
                              <div
                                className="col-lg-3 col-md-6 col-sm-12 text-center mb-1"
                                key={i}
                              >
                                <div className="card  card-dark-bg p-3 box-dark">
                                  <div className="card-body">
                                    <h4 className="text-white">
                                      {data?.title}
                                    </h4>
                                    <b className="text-white">{data?.count}</b>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="pb-4 pt-1 bg-dark">
                  <div className="container-md">
                    <div className="section-wraper row d-flex align-items-center">
                      <div className="col-md-6 section-header mb-0">
                        <h2 className="text-gold-gradient">Our Theaters</h2>
                      </div>
                      <div className="col-md-6 text-end">
                        <a
                          href="/Theaters"
                          className=" bright-all-links fw-bold"
                          style={{ marginRight: "25px" }}
                        >
                          View all
                        </a>
                      </div>
                    </div>
                    <div className="row">
                      <Slider {...settings2}>
                        {Theaters?.map((data, i) => (
                          <div className="col-md-4" key={i}>
                            <div className="item">
                              <div className="profile-widget m-1">
                                <div className="doc-img">
                                  <a
                                    href="/Theaters"
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                  >
                                    {/* when there is no video dispalying the same image in the the */}
                                    {data.video ? (
                                      <video
                                        src={URLS.Base + data.video}
                                        className="img-fluid video-mobile"
                                        id="theaters"
                                        style={{
                                          height: "250px", // Same height as image
                                          borderRadius: "10px",
                                          width: "100%", // Same width as image
                                          cursor: "pointer",
                                          display: "block",
                                          objectFit: "cover",
                                        }}
                                        autoPlay
                                        loop
                                        muted
                                      />
                                    ) : (
                                      <img
                                        // src={URLS.Base + data.image[0]}
                                        src={URLS.Base + data.image}
                                        alt=""
                                        className="img-fluid video-theatres"
                                        id="theaters"
                                        style={{
                                          height: "250px", // Same height as video
                                          borderRadius: "10px",
                                          width: "100%", // Same width as video
                                          cursor: "pointer",
                                        }}
                                      />
                                    )}
                                    {data.video ? (
                                      <img
                                        // src={URLS.Base + data.image[0]}
                                        src={URLS.Base + data.image}
                                        alt=""
                                        className="img-fluid theatres"
                                        id="theaters"
                                        style={{
                                          height: "250px", // Same height as video
                                          borderRadius: "10px",
                                          width: "100%", // Same width as video
                                          cursor: "pointer",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        // src={URLS.Base + data.image[0]}
                                        src={URLS.Base + data.image}
                                        alt=""
                                        className="img-fluid  vdeoimage"
                                        id="theaters"
                                        style={{
                                          height: "280px", // Same height as video
                                          borderRadius: "10px",
                                          width: "100%", // Same width as video
                                          cursor: "pointer",
                                          objectFit: "cover",
                                        }}
                                      />
                                    )}
                                  </a>
                                </div>
                                <div className="row row-sm text-center">
                                  <div className="col-12 mt-2 mb-2 me-2 d-flex justify-content-between align-items-center">
                                    <h5
                                      className="title"
                                      style={{ marginLeft: "20px" }}
                                    >
                                      {data.name}
                                    </h5>
                                    <button
                                      className="btn main-booknow theaters-btn"
                                      style={{
                                        boxShadow: "none",
                                        marginRight: "20px",
                                      }}
                                      onClick={handleTheater}
                                    >
                                      Book Now
                                    </button>
                                  </div>

                                  {/* Uncomment if you want to show offer price
              <div className="col-12 mt-2">
                <h5 className="title" style={{ color: "#A020F0" }}>
                  ₹ {data.offerPrice}/-
                </h5>
              </div>
              */}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                </section>
                {/* servives */}
                <section className="container-md mt-2 pb-3 bg-dark">
                  <div className="section-wraper row d-flex align-items-center">
                    <div className="col-md-6 section-header mb-0">
                      <h2 className="text-gold-gradient">Our Services</h2>
                    </div>
                    {/* <div className="col-md-6 text-end">
                      <a href="/cakes" className=" bright-all-links fw-bold">
                        View all
                      </a>
                    </div> */}
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-3 text-center">
                      <img
                        className="mx-auto rounded-full mb-3"
                        src={beverages}
                        style={{
                          height: "150px",
                          width: "150px",
                          borderRadius: "99999px",
                        }}
                      />
                      <h4 className="title">Food & Bevarages</h4>
                      <p className="text-white">
                        Choose the perfect cake for your celebration from our
                        selection.
                      </p>
                      <a href="/Food" className=" bright-all-links">
                        <span>View more </span>
                        <i className="fas fa-arrow-right"></i>
                      </a>
                    </div>{" "}
                    <div className="col-12 col-lg-3 text-center">
                      <img
                        className="mx-auto rounded-full mb-3"
                        src={screening}
                        style={{
                          height: "150px",
                          width: "150px",
                          borderRadius: "99999px",
                        }}
                      />
                      <h4 className="title">Screening</h4>
                      <p className="text-white">
                        Bring your own OTT accounts and relive the theatre
                        magic!
                      </p>
                    </div>{" "}
                    <div className="col-12 col-lg-3 text-center">
                      <img
                        className="mx-auto rounded-full mb-3"
                        src={cake4}
                        alt="image"
                        style={{
                          height: "150px",
                          width: "150px",
                          borderRadius: "99999px",
                        }}
                      />
                      <h4 className="title">Cakes</h4>
                      <p className="text-white">
                        Choose the perfect cake for your celebration from our
                        selection.
                      </p>
                      <a href="/cakes" className=" bright-all-links">
                        <span>View more </span>
                        <i className="fas fa-arrow-right"></i>
                      </a>
                    </div>{" "}
                    <div className="col-12 col-lg-3 text-center">
                      <img
                        className="mx-auto rounded-full mb-3"
                        src={roses}
                        alt="image"
                        style={{
                          height: "150px",
                          width: "150px",
                          borderRadius: "99999px",
                        }}
                      />
                      <h4 className="title">Bouquets</h4>
                      <p className="text-white">
                        Add a beautiful rose bouquet to enhance your
                        celebration.
                      </p>
                    </div>{" "}
                  </div>
                </section>
                {/* WHY US? */}
                <section className=" pt-5 pb-5 p-relative bg-light-grey">
                  <div className="container-md">
                    <div className="row align-items-center">
                      <div className="col-lg-6">
                        <div
                          className="wow fadeInLeft"
                          data-animation="fadeInLeft"
                          data-delay=".2s"
                        >
                          <img
                            src={URLS?.Base + Highlights?.image}
                            alt="shape"
                            style={{ width: "100%", borderRadius: "20px" }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="about-content s-about-content pl-30">
                          <div className="about-title second-atitle">
                            <h1
                              className="wow fadeInUp animated"
                              data-animation="fadeInUp animated"
                              data-delay=".2s"
                              style={{ color: "white" }}
                            >
                              WHY Us?
                            </h1>
                            <h3
                              className="wow fadeInUp animated"
                              data-animation="fadeInUp animated"
                              data-delay=".2s"
                              style={{ color: "white", fontWeight: "500" }}
                            >
                              {Highlights?.title}
                            </h3>
                          </div>
                          <p style={{ color: "white" }}>
                            {Highlights?.description}
                          </p>
                          {HighlightsPoints?.map((data, i) => {
                            return (
                              <>
                                <div className="mt-3" key={i}>
                                  <p style={{ color: "white" }}>
                                    <span id="bgs4"></span>
                                    {data?.features}
                                  </p>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div className="text-end text-white">
                        <a href="/theaters" className="btn main-booknow">
                          <i className="fas fa-ticket-alt" />{" "}
                          <span className="">Book Now</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </section>


                {/* Gallery */}
                <section className="pb-3 pb-3 bg-light-grey">
                  <div className="container-md">
                    <div className="section-wraper row d-flex align-items-center">
                      <div className="col-md-6 section-header mb-0 mt-3 mb-3">
                        <h2 className="text-gold-gradient">Gallery</h2>
                      </div>
                      <div className="col-md-6 text-end">
                        <a href="/gallery" className="bright-all-links fw-bold">
                          View all
                        </a>
                      </div>
                      <div className="row justify-content-center">
                        {/* <div>
                          <div className="row mb-4">
                            {images?.map((image, index) => {
                              return (
                                <div
                                  className="col-md-4 col-12 mt-3 mb-4"
                                  key={index}
                                >
                                  <div className="image-container">
                                    <img
                                      src={URLS?.Base + image?.image}
                                      alt={image.alt}
                                    />
                                    <i
                                      className="fa fa-search-plus zoom-icon"
                                      aria-hidden="true"
                                    ></i>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div> */}
                        <div className="container-md">
                          <div>
                            <Galleria
                              ref={galleria}
                              value={images}
                              numVisible={7}
                              style={{ maxWidth: "850px" }}
                              activeIndex={activeIndex}
                              onItemChange={(e) => setActiveIndex(e.index)}
                              circular
                              fullScreen
                              showItemNavigators
                              showThumbnails={false}
                              item={itemTemplate}
                              thumbnail={thumbnailTemplate}
                            />
                            <div>
                              <div className="row mb-4">
                                {images.map((image, index) => {
                                  return (
                                    <div
                                      className="col-lg-4 col-md-4 mt-3 mb-4"
                                      key={index}
                                    >
                                      <div
                                        className="zoom-container"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          setActiveIndex(index);
                                          galleria.current.show();
                                        }}
                                      >
                                        <img
                                          src={URLS.Base + image.image}
                                          alt={image.alt}
                                          style={{
                                            width: "100%",
                                            height: "300px",
                                            border: "1px solid #F5E7B6",
                                          }}
                                        />
                                        {/* Zoom Icon */}
                                        <span className="zoom-icon">
                                          <i className="fas fa-search-plus"></i>
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 text-end">
                        <a
                          href="https://www.instagram.com/carnival_castle_hyderabad/"
                          target="_blank"
                          className="bright-all-links fw-bold"
                        >
                          Our Instagram <i className="fab fa-instagram" />
                        </a>
                      </div>
                    </div>
                  </div>
                </section>

                {/* FAQS */}
                <section className="pb-3 pb-3 bg-dark">
                  <div className="container">
                    <div className="section-wraper row d-flex align-items-center">
                      <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-8">
                          <div className="section-title text-center mb-5 pt-3">
                            <h2 className="text-gold-gradient">
                              ​​​​​​​Frequently Asked Questions
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        <div className="col-md-8">
                          <Accordion defaultActiveKey="0">
                            {Faqs?.map((data, i) => {
                              return (
                                <Accordion.Item
                                  className="mt-3"
                                  eventKey={i.toString()}
                                  key={i}
                                  style={{ background: "white" }}
                                >
                                  <Accordion.Header>
                                    <b>
                                      {i + 1}.{data.question}
                                    </b>
                                  </Accordion.Header>
                                  <Accordion.Body>{data.answer}</Accordion.Body>
                                </Accordion.Item>
                              );
                            })}
                          </Accordion>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ENQUIRY */}
                <section className="pt-5 pb-5 p-relative bg-light-grey">
                  <div className="p-3">
                    <div className="row justify-content-md-center">
                      <div className=" pl-30">
                        <div className="row justify-content-center">
                          <div className="col-xl-6 col-lg-8"></div>
                        </div>
                      </div>
                      <div className="col-lg-6 mt-3">
                        <iframe
                          src={Contact.map}
                          width="100%"
                          height={480}
                          style={{ borderRadius: "20px" }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      <div className="col-lg-6 mt-3">
                        <div>
                          <div className="row gradient-border">
                            <div className="col-lg-6 ">
                              <div className="contactsops bg-dark">
                                <img
                                  // src="img/logo.png"
                                  src={logo}
                                  alt="logo"
                                  style={{ height: "85px" }}
                                />
                                <p style={{ color: "white" }}>
                                  {/* At CarnivalCastle, we craft memorable theater
                                  events in elegant venues, tailored just for
                                  you. Find your venue, plan your event, and
                                  enjoy your special day. */}
                                  Planning a memorable celebration at Carnival
                                  Castle Private Theatre? We are ready to make
                                  your vision to reality! Whether it's a
                                  birthday, anniversary, bride to be, mom to be,
                                  groom to be, baby shower, private movie
                                  screening, special surprises or corporate
                                  event, we offer tailored packages to make each
                                  occasion special. To enquire, simply contact
                                  us to discuss your specific needs, from theme
                                  decor, food options to seating arrangements
                                  and custom add-ons.
                                </p>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div class="booking-form align-items-center justify-content-center">
                                <form
                                  className="mt-4 mb-3"
                                  onSubmit={(e) => {
                                    formsubmit(e);
                                  }}
                                >
                                  <>
                                    <div className="section-title text-center mb-5">
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
                                        value={form.name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Full Name*"
                                      />
                                    </div>

                                    <div className="mb-3 input-group">
                                      <span className="input-group-text">
                                        <FontAwesomeIcon icon={faPhone} />
                                      </span>
                                      <input
                                        required
                                        type="text"
                                        name="mobileNumber"
                                        onChange={handleChange}
                                        maxLength="10"
                                        minLength="10"
                                        pattern="[0-9]{10}"
                                        value={form.mobileNumber}
                                        placeholder="Enter Mobile Number*"
                                        className="form-control"
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
                                        placeholder="Enter Email*"
                                        onChange={handleChange}
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
                                        name="eventName"
                                        placeholder="Enter Event Name*"
                                        onChange={handleChange}
                                        value={form.eventName}
                                        className="form-control"
                                      />
                                    </div>

                                    <div className="mb-3 input-group">
                                      <span className="input-group-text">
                                        <FontAwesomeIcon icon={faClipboard} />
                                      </span>
                                      <input
                                        type="text"
                                        name="description"
                                        required
                                        onChange={handleChange}
                                        value={form.description}
                                        placeholder="Enter Description*"
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
                    </div>
                  </div>
                </section>
<Modal
  size="md"
  show={lgShow}
  onHide={handleClose}
  aria-labelledby="example-modal-sizes-title-lg"
  centered
>
  <div style={{ position: "relative", width: "100%" }}>
    <img
      src={URLS.Base + PopUp.image}
      alt="image"
      style={{ width: "100%", objectFit: "cover" }}
    />
    <button
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "rgba(0, 0, 0, 0.5)",
        border: "none",
        color: "white",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={handleClose}
    >
      &times;
    </button>
  </div>
</Modal>
                <ToastContainer />
                <Footer />
              </>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;
