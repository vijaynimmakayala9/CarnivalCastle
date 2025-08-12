import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faStickyNote,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import logo from "../components/carnival_footer_logo-2-removebg-preview.png";
function Enquiry() {
  const [form, setform] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    description: "",
    eventName: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [Contact, setContact] = useState([]);

  useEffect(() => {
    GetFooterData();
  }, []);

  const GetFooterData = () => {
    axios.post(URLS.GetFooter, {}, {}).then((res) => {
      if (res.status === 200) {
        setContact(res.data.contactus);
        setIsLoading(false);
      }
    });
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

  return (
    <>
          <Helmet>
        <meta charSet="utf-8" />
        <title>Private Theater in Hyderabad | Carnival Castle</title>
        <meta
          name="description"
          content="Experience perfect venue for Birthday surprises, Anniversary surprises, Bride to Be celebrations, Mom To Be, Baby Shower etc with Ultra HD and Dolby Atmos Sound"
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
          <div className="home-page indexsix">
            <Header />
            <main className="main-wrapper">
              <section
                id="parallax"
                className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix lighter-back"
                // style={{ backgroundImage: "url(img/bgss.jpg)" }}
                style={{ backgroundColor: "#AD3DF0" }}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                      <div className="breadcrumb-wrap text-center">
                        <div className="breadcrumb-title mb-30">
                          {/* <h1 className="text-gold-gradient"> Enquiry Now</h1> */}
                          {/* <h1 style={{ color: "white", marginTop: "20px" }}>
                            {" "}
                            Enquiry Now
                          </h1> */}
                        </div>
                        {/* <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                              <a href="/">Home</a>
                            </li>
                            <li
                              className="breadcrumb-item active"
                              aria-current="page"
                            >
                              Enquiry Now
                            </li>
                          </ol>
                        </nav> */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="  pb-3 p-relative lighter-back">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-lg-12">
                      <div className=" pl-30">
                        <div>
                          <h3
                            // style={{ color: "#54127B" }}
                            className="wow fadeInUp animated text-center dark-text py-3"
                            data-animation="fadeInUp animated"
                            data-delay=".3s"
                          >
                            Enquiry Now
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-md-center mt-3">
                    <div className="col-lg-8 mt-40  rounded-3" style={{ border: "1px solid #9D4DFF"}}>
                      <div className="row">
                        <div className="col-lg-6 ">
                          <div className="contactsops bg-dark">
                            <img
                              src={logo}
                              alt="logo"
                              style={{ height: "100px" }}
                            />

                            <p style={{ color: "white" }}>
                              {/* <p className="text-gold-gradient"> */}A
                              Planning a memorable celebration at Carnival Castle Private Theatre? We are ready to make your vision to reality! Whether it's a birthday, anniversary, bride to be, mom to be, groom to be, baby shower, private movie screening, special surprises or corporate event, we offer tailored packages to make each occasion special. To enquire, simply contact us to discuss your specific needs, from theme decor, food options to seating arrangements and custom add-ons.
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="booking-form align-items-center justify-content-center">
                            <form
                              className="mt-5 mb-3"
                              onSubmit={(e) => {
                                formsubmit(e);
                              }}
                            >
                              <div className="mb-4 input-group">
                                <span className="input-group-text">
                                  <FontAwesomeIcon icon={faUser} />
                                </span>
                                <input
                                  required
                                  type="text"
                                  name="name"
                                  value={form.name}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  placeholder="Enter Full Name*"
                                  className="form-control"
                                />
                              </div>

                              <div className="mb-4 input-group">
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

                              <div className="mb-4 input-group">
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
                                  value={form.email}
                                  placeholder="Enter Email*"
                                  className="form-control"
                                />
                              </div>

                              <div className="mb-4 input-group">
                                <span className="input-group-text">
                                  <FontAwesomeIcon icon={faCalendarAlt} />
                                </span>
                                <input
                                  required
                                  type="text"
                                  name="eventName"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  value={form.eventName}
                                  className="form-control"
                                  placeholder="Enter Event Name*"
                                />
                              </div>

                              <div className="mb-4 input-group">
                                <span className="input-group-text">
                                  <FontAwesomeIcon icon={faStickyNote} />
                                </span>
                                <input
                                  required
                                  type="text"
                                  name="description"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  value={form.description}
                                  className="form-control"
                                  placeholder="Enter Description*"
                                />
                              </div>

                              <button
                                type="submit"
                                className="btn  mb-2 dark-back text-light"
                                style={{ float: "right" }}
                              >
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="lighter-back">
                <h3
                  // style={{ color: "#54127B" }}
                  className="wow fadeInUp animated text-center dark-text py-3"
                  data-animation="fadeInUp animated"
                  data-delay=".3s"
                >
                  Our Address
                </h3>
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-12 mt-0 ">
                      <iframe
                        className=""
                        src={Contact.map}
                        width="100%"
                        height={480}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </main>
            <ToastContainer />
            <Footer />
          </div>{" "}
        </>
      )}
    </>
  );
}

export default Enquiry;
