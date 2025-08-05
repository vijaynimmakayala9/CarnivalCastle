import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import { Helmet } from "react-helmet";
function About() {
  const [About, setAbout] = useState([]);
  const [AboutFeatures, setAboutFeatures] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetAboutdata();
    GetAboutFeaturesdata();
  }, []);

  const GetAboutdata = () => {
    axios.post(URLS.GetAbout, {}, {}).then((res) => {
      if (res.status === 200) {
        setAbout(res.data.aboutus);
        setIsLoading(false);
      }
    });
  };

  const GetAboutFeaturesdata = () => {
    axios.post(URLS.GetAboutFeatures, {}, {}).then((res) => {
      if (res.status === 200) {
        setAboutFeatures(res.data.features);
      }
    });
  };
  const BaseUrl = "https://api.carnivalcastle.com/v1/carnivalApi/";
    const ImageBase = "https://api.carnivalcastle.com/";
  
    const [addresses, setAddresses] = useState([]);
  
    useEffect(() => {
      const fetchAddresses = async () => {
        try {
          const res = await axios.get(`${BaseUrl}admin/address/alladdress`);
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
      fetchAddresses();
    }, []);
  

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
        Best Private Theater in Hyderabad | Carnival Castle
        </title>
        <meta
          name="description"
          content="Experience the magic of private theatre for your celebrations. Create unforgettable moments with exclusive screenings and personalized service just for you"
        />
      </Helmet>

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
          <div class="home-page indexsix">
            <main class="main-wrapper">
              <Header  />
              <section
                id="parallax"
                className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix lighter-back"
                // style={{ backgroundImage: "url(img/bgss.jpg)" }}
                // style={{background: 'linear-gradient(329deg, rgba(191, 63, 249, 1) 0%, rgba(113, 51, 210, 1) 100%)'}}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                      <div className="breadcrumb-wrap text-center">
                        <div className="breadcrumb-title mb-30 dark-text">
                          <h1 style={{ marginTop: "20px"  }}>About Us</h1>
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
                              News
                            </li>
                          </ol>
                        </nav> */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="pt-4 pb-4 p-relative lighter-back">
              {/* <section className="pt-4 pb-4 p-relative mt-4"> */}
                <div className="container-md">
                  <div className="row align-items-center">                    
                    <div className="col-lg-6">
                      <div className="">
                        <h3 className="dark-text">
                          <b> {About.title}</b>
                        </h3>
                      </div>
                      <p className="light-text pt-3">
                        {About.description}
                      </p>
                    </div>
                    <div className="col-lg-6">
                      <div>
                        <img
                          src={URLS.Base + About.image}
                          alt="Testimonial"
                          style={{
                            borderRadius: "20px",
                            height: "400px",
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="bg-white" >
                  <div className="container-fluid text-center py-5 lighter-back">
                    <h2 className="fw-bold mb-5 dark-text">Our Branches</h2>

                    <div className="row justify-content-center">
                      {addresses.map((addr, idx) => (
                        <div className="col-md-6 col-lg-5 mb-4" key={idx}>
                          <div
                            className="p-4 shadow-lg lighter-back h-100"
                            style={{
                              borderRadius: "2rem",
                              transition: "0.3s",
                            }}
                          >
                            <h4 className="fw-bold text-center mb-3" style={{ color: "#5b179b" }}>
                              {addr.name}
                            </h4>
                            <p
                              className="text-muted mb-3 text-center"
                              style={{ fontStyle: "italic", fontSize: "0.95rem" }}
                            >
                              {addr.addressLine1}, {addr.addressLine2}
                            </p>

                            <div className="text-center">
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  `${addr.addressLine1}, ${addr.addressLine2}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none fw-semibold"
                                style={{ color: "#6d28d9" }}
                              >
                                <i className="bi bi-geo-alt-fill me-2 light-text"></i>See on map
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>


                  <style jsx>{`
                  .text-purple {
                   color: #5b179b;
                    }
                 `}</style>
                </section>
            </main>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default About;
