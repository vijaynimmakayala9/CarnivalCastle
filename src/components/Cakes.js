import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
function Enquiry() {
  const [premiumCakes, setpremiumCakes] = useState([]);
  const [NormalCakes, setNormalCakes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetFaqsData();
  }, []);

  const GetFaqsData = () => {
    axios.post(URLS.GetGetAllCakes, { cakeType: "egg" }, {}).then((res) => {
      if (res.status === 200) {
        setpremiumCakes(res?.data?.premiumCakes);
        setNormalCakes(res?.data?.normalCakes);
        setIsLoading(false);
      }
    });
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);

    const data = isChecked ? "egg" : "eggless";

    axios.post(URLS.GetGetAllCakes, { cakeType: data }, {}).then((res) => {
      if (res.status === 200) {
        setpremiumCakes(res?.data?.premiumCakes);
        setNormalCakes(res?.data?.normalCakes);
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          Birthday celebration places in Hyderabad | Carnival Castle
        </title>
        <meta
          name="description"
          content="Looking for birthday celebration places in Hyderabad? Carnival Castle offers private theatres with Lavish decor, custom cakes, food, and a memorable experience."
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
          <div class="home-page indexsix">
            <Header />
            <main class="main-wrapper">
              <section
                id="parallax"
                className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix lighter-back"
              // style={{ backgroundImage: "url(img/bgss.jpg)" }}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                      <div className="breadcrumb-wrap text-center">
                        <div className="breadcrumb-title mb-30 dark-text">
                          <h1 style={{ marginTop: "20px" }}>
                            {" "}
                            Cakes
                          </h1>
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
                              Cakes
                            </li>
                          </ol>
                        </nav> */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="pb-3 pb-3 lighter-back border">
                <div className="container">
                  <div className="row">
                    <div className="col-6">
                      <div className="section-title mb-2 pt-4">
                        <h2 className="light-text">
                          {isChecked ? "Eggless" : "Egg"}
                        </h2>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className="section-title mb-2 pt-4"
                        style={{ float: "right", position: "relative" }}
                      >
                        <div className="custom-switch-wrapper light-text">
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="EggLess"
                            style={{ fontSize: "20px" }}
                            checked={isChecked}
                            onChange={handleSwitchChange}
                          />
                          {/* <span className="hover-text">Switch to</span> */}
                          <span className="hover-text light-text bg-light">
                            {isChecked ? "Eggless" : "Egg"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {premiumCakes.length == 0 && NormalCakes.length == 0 ? (
                    <>
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "100px",
                          marginBottom: "100px",
                        }}
                      >
                        No data....
                      </div>
                    </>
                  ) : (
                    <>
                      {premiumCakes.length == 0 ? (
                        <></>
                      ) : (
                        <>
                          <Row>
                            <Col
                              md={12}
                              style={{
                                backgroundColor: "#595B56",
                                border: "1px dashed #C69FF4",
                              }}
                            >
                              <div
                                style={{
                                  padding: "5px",
                                  background: "#A020F0",
                                }}
                                className="mt-2 mb-3 lighter-back"
                              >
                                <div className="row">
                                  <div className="col">
                                    <h5 className="text-gold-gradient">
                                      Premium Cakes
                                    </h5>
                                  </div>
                                  <div className="col"></div>
                                </div>
                              </div>
                              <Row className="p-2">
                                {premiumCakes.map((data, i) => {
                                  return (
                                    // <div className="col-lg-2 mb-4" key={i}>
                                    <div
                                      className="col-lg-2 col-md-4 col-sm-6 col-6 mb-4"
                                      key={i}
                                    >
                                      <div
                                        className="text-center position-relative"
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
                                            />
                                          </div>
                                          <div className="food-desc bg-dark">
                                            <p className="fd-title text-gold-gradient">
                                              {data.name}
                                            </p>

                                            {/* <p
                                              className="fd-title"
                                              style={{
                                                color: "#F6699E",
                                                borderTop: "1px dashed gray",
                                                paddingTop: "3px",
                                                paddingBottom: "3px",
                                              }}
                                            >
                                              <small className="text-gold-gradient">
                                                {" "}
                                                ₹
                                              </small>
                                              <b className="text-gold-gradient">
                                                {data.price} /-
                                              </b>
                                            </p> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                                <div className="text-white">
                                  <b className="text-danger">Note: </b><br />
                                  <span>Customized cakes must be ordered 3days Prior..</span><br />
                                  <span> For customized cakes plz contact us...</span>
                                </div>
                              </Row>
                            </Col>
                          </Row>
                        </>
                      )}
                      {NormalCakes.length == 0 ? (
                        <></>
                      ) : (
                        <>
                          <Row>
                            <Col
                              md={12}
                              className="lighter-back shadow-lg rounded"
                              style={{
                                // borderRight: "1px dashed #A020F0",
                                // borderBottom: "1px dashed #A020F0",
                                // borderLeft: "1px dashed #A020F0",
                                // background: "#F8EBFF",
                                border: "1px solid #C69FF4",
                              }}
                            >
                              <div
                                style={{
                                  padding: "5px",
                                  background: "#A020F0",
                                }}
                                className="mt-2 mb-3 lighter-back"
                              >
                                <div className="row">
                                  <div className="col">
                                    <h5 className="dark-text">
                                      Normal Cakes
                                    </h5>
                                  </div>
                                  <div className="col"></div>
                                </div>
                              </div>
                              <Row className="p-2">
                                {NormalCakes.map((data, i) => {
                                  return (
                                    // <div className="col-lg-2 mb-4" key={i}>
                                    <div
                                      className="col-lg-2 col-md-4 col-sm-6 col-6 mb-4"
                                      key={i}
                                    >
                                      <div
                                        className="text-center position-relative"
                                        style={{ cursor: "pointer" }}
                                        id="bgshadow"
                                      >
                                        <div
                                          className="food-category item shadow-md"
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
                                            />
                                          </div>
                                          <div className="food-desc bg-light ">
                                            <p className="fd-title dark-text">
                                              {data.name}
                                            </p>

                                            <p
                                              className="fd-title"
                                              style={{
                                                color: "#F6699E",
                                                borderTop: "1px dashed gray",
                                                paddingTop: "3px",
                                                paddingBottom: "3px",
                                              }}
                                            >
                                              <small className="light-text">
                                                {" "}
                                                ₹{" "}
                                              </small>
                                              <b className="light-text">
                                                {data.price} /-
                                              </b>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </Row>
                            </Col>
                          </Row>
                        </>
                      )}
                    </>
                  )}
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
