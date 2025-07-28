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
                className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix bg-dark border-gradient border-gradient-gold only-bottom-border"
                // style={{ backgroundImage: "url(img/bgss.jpg)" }}
                // style={{background: 'linear-gradient(329deg, rgba(191, 63, 249, 1) 0%, rgba(113, 51, 210, 1) 100%)'}}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                      <div className="breadcrumb-wrap text-center">
                        <div className="breadcrumb-title mb-30">
                          <h1 style={{ color: "white",marginTop: "20px"  }}>About Us</h1>
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
              <section className="pt-4 pb-4 p-relative bg-dark">
              {/* <section className="pt-4 pb-4 p-relative mt-4"> */}
                <div className="container-md">
                  <div className="row align-items-center">
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
                    <div className="col-lg-6">
                      <div className="">
                        <h3 className="text-white">
                          <b> {About.title}</b>
                        </h3>
                      </div>
                      <p className="text-white pt-3">
                        {About.description}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="blog-wrapper bg-dark"
                style={{ background: "#F8EBFF" }}
              >
                <div className="container-md">
                  <div className="row justify-content-center">
                    <div className="col-xl-6 col-lg-8">
                      <div className="section-title text-center mb-5 pt-3">
                        <h2 className="text-gold-gradient">Our Features</h2>
                      </div>
                    </div>
                  </div>
                  <div className="row blog-grid-row">
                    {AboutFeatures.map((data, i) => {
                      return (
                        <div className="col-md-6 col-lg-4 col-sm-12" key={i}>
                          <div className="content-wrapper">
                            <div className="blog-image">
                              <a href="/theaters">
                                <img
                                  className="img-fluid"
                                  src={URLS.Base + data.image}
                                  alt="Post Image"
                                />
                              </a>
                            </div>
                            <div className="blog-content">
                              <a
                                href="javascript:void(0);"
                                className="post-date"
                              >
                                <span className="btn bg-sunray">
                                  <a href="/theaters">
                                  <b className="title-name">{data.name}</b>
                                  </a>
                                </span>
                              </a>
                              <p className="mb-3 text-white">{data.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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

export default About;
