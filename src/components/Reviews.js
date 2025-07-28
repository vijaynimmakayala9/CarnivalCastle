import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { Helmet } from "react-helmet";

function Gallery() {
  // const [Testimonial, setTestimonial] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetReviews();
  }, []);

  const GetReviews = () => {
    axios.post(URLS.AllModules, {}, {}).then((res) => {
      if (res.status === 200) {
        // setTestimonial(res.data.testimonials);
        setIsLoading(false);
      }
    });
  };

  const Testimonial = [
  {
    name: "Priyanka Devasath",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    description: "We had a very good experience at Bingen & Joy private theatres. Budget friendly, food taste was really awesome. Staff was very good and approached very well. Thank you Bingen & Joy.",
  },
  {
    name: "Santosh Santosh",
    image: "https://randomuser.me/api/portraits/men/25.jpg",
    rating: 5,
    description: "Really amazing event! Haven't seen such ambience in any part of Hyderabad. Really worth what we paid. The ambience is truly amazing.",
  },
  {
    name: "Shubham Khirade",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    rating: 5,
    description: "It was an amazing experience here! Worth every single penny! You guys must visit. They will organize everything! Best place in Hyderabad to surprise your loved ones!",
  },
  {
    name: "Priyanka Chodisetti",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    rating: 4,
    description: "Nice place to celebrate any occasion.",
  },
  {
    name: "Khadar RGM Basha",
    image: "https://randomuser.me/api/portraits/men/53.jpg",
    rating: 5,
    description: "Celebrated my nephew’s birthday here. It was wonderful — a top-rated place for birthday parties.",
  },
];


  return (
    <>

<Helmet>
        <meta charSet="utf-8" />
        <title>
        Private Theater in Hyderabad For Birthday's & Anniversaries 
        </title>
        <meta
          name="description"
          content="Looking for a unique celebration venue in Hyderabad? Bing Enjoy offers luxury private theaters with Lavish decor & food options for any special occasion."
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
            <Header />
            <main class="main-wrapper">
              <section
                id="parallax"
                className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix bg-dark border-gradient border-gradient-gold only-bottom-border"
                // style={{ backgroundImage: "url(img/bgss.jpg)" }}
                // style={{background: 'linear-gradient(329deg, rgba(191, 63, 249, 1) 0%, rgba(113, 51, 210, 1) 100%)'
                // }}
              >
                <div className="container-md">
                  <div className="row">
                    <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                      <div className="breadcrumb-wrap text-center">
                        <div className="breadcrumb-title mb-30">
                          <h1 style={{ color: "white", marginTop: "20px"  }}>Reviews</h1>
                        </div>
                        {/* <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                              <a href="/" style={{ color: "white" }}>
                                Home
                              </a>
                            </li>
                            <li
                              className="breadcrumb-item active"
                              aria-current="page"
                            >
                              Reviews
                            </li>
                          </ol>
                        </nav> */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="popular-events bg-dark">
                  <div className="container-md">
                    <div className="section-wrapper row d-flex align-items-center mb-4">
                      <div className="col-md-6 section-header mb-0">
                        <h2 className="text-black text-gold-gradient">Google Reviews</h2>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <a href="/Reviews" className="view-all">
                          View all
                        </a>
                      </div>
                    </div>
                    {/* Reviews */}
                    <div className="row">
                      {Testimonial?.map((data, i) => (
                        <div className="col-md-4 col-sm-6 mb-4" key={i}>
                          <div
                            className="testimonial-card d-flex flex-column flex-sm-row align-items-start"
                            style={{
                              padding: "20px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              borderRadius: "8px",
                              backgroundColor: "#ffffff",
                              fontFamily: "Arial, sans-serif",
                            }}
                          >
                            <div
                              className="testimonial-image mb-3 mb-sm-0"
                              style={{
                                marginRight: "15px",
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={data.image}/*src={`${URLS.Base}${data.image}`} */
                                alt={data.name}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                }}
                              />
                            </div>
                            <div
                              className="testimonial-content d-flex flex-column"
                              style={{ flexGrow: 1 }}
                            >
                              <div
                                className="testimonial-stars mb-2"
                                style={{ color: "#28a745" }}
                              >
                                {Array.from({ length: 5 }, (_, index) => (
                                  <FaStar
                                    key={index}
                                    style={{
                                      color:
                                        index < Math.round(data.rating)
                                          ? "#28a745"
                                          : "#ddd",
                                    }}
                                  />
                                ))}
                              </div>
                              <h5
                                className="mb-2"
                                style={{
                                  fontWeight: "bold",
                                }}
                              >
                                {data.name}
                              </h5>
                              <p
                                className="mb-0"
                                style={{
                                  fontSize: "14px",
                                  color: "#333",
                                }}
                              >
                                {data.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
            </main>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Gallery;
