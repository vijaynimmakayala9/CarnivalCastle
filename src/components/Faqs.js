import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import { Helmet } from "react-helmet";
function Enquiry() {
  const [Faqs, setFaqs] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetFaqsData();
  }, []);

  const GetFaqsData = () => {
    axios.post(URLS.AllModules, {}, {}).then((res) => {
      if (res.status === 200) {
        setFaqs(res.data.faqs);
        setIsLoading(false);
      }
    });
  };

  return (
    <>
     <Helmet>
        <meta charSet="utf-8" />
        <title>
        Carnival Castle | Couple Private Surprise Party in Hyderabad
        </title>
        <meta
          name="description"
          content="Celebrate at Carnival Castle Private Theatres in Hyderabad. Perfect for birthdays, anniversaries, love proposals with custom decor, food & privacy. Book now!!"
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
                style={{backgroundColor:"#AD3DF0"}}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                      <div className="breadcrumb-wrap text-center">
                        <div className="breadcrumb-title mb-30">
                          <h1 style={{ color: "white", marginTop: "20px"   }}> Faq's</h1>
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
                              Faq's
                            </li>
                          </ol>
                        </nav> */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section style={{ background: "#F8EBFF" }} className="pb-3 pb-3 bg-dark">
                <div className="container">
                  <div className="section-wraper row d-flex align-items-center">
                    <div className="row justify-content-center">
                      <div className="col-xl-6 col-lg-8">
                        <div className="section-title text-center mb-2 pt-4">
                          <h2 className="text-gold-gradient">
                            ​​​​​​​Frequently Asked Questions
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-8">
                        <Accordion defaultActiveKey="0">
                          {Faqs.map((data, i) => {
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
            </main>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Enquiry;
