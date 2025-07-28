import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";

function Gallery() {
  const [policys, setpolicys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetPoliciesData();
  }, []);

  const GetPoliciesData = () => {
    axios.post(URLS.GetPolicies, {}, {}).then((res) => {
      if (res.status === 200) {
        setpolicys(res.data.policy);
        setIsLoading(false);
      }
    });
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
          <div class="home-page indexsix">
            <Header />
            <main class="main-wrapper">
              <section
                id="parallax"
                className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix bg-dark border-gradient border-gradient-gold only-bottom-border"
                // style={{ backgroundImage: "url(img/bgss.jpg)" }}
                style={{backgroundColor:"#AD3DF0"}}
              >
                <div className="container-md">
                  <div className="row">
                    <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                      <div className="breadcrumb-wrap text-center">
                        <div className="breadcrumb-title mb-30">
                          <h1 style={{ color: "white", marginTop: "20px"   }}>Terms & Conditions</h1>
                        </div>
                        {/* <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                              <a href="/" style={{ color: "white" }}>
                                Home
                              </a>
                            </li>
                            <li
                              className="breadcrumb-item active text-gold-gradient"
                              aria-current="page"
                            >
                              Terms & Conditions
                            </li>
                          </ol>
                        </nav> */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="shop-area pt-1 pb-5 p-relative wow fadeInUp animated bg-dark text-white"
                data-animation="fadeInUp animated"
                data-delay=".2s"
                // style={{ background: "#F8EBFF" }}
              >
                <div className="container-md">
                  <div className="row align-items-center">
                    <div
                      className="mt-5"
                      dangerouslySetInnerHTML={{
                        __html: policys.termsAndCondition,
                      }}
                    ></div>
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
