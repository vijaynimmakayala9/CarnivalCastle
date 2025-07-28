import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import { Row, Col, Form } from "react-bootstrap";

function Food() {
  const [food, setFood] = useState([]);
  const [showVeg, setShowVeg] = useState(false); // Toggle veg items
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://api.carnivalcastle.com/v1/carnivalApi/web/foodcategorywiseproducts"
        );
        setFood(
          response.data.foodcategories.flatMap((ele) => ele.foodproducts)
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching the food products:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleChange = () => {
    setShowVeg((prev) => !prev);
  };

  const vegItems = food.filter((item) => item.foodType === "Veg");
  const nonVegItems = food.filter((item) => item.foodType === "Non-veg");

  return (
    <>
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
              alt="Loading"
            />
            <h6 style={{ color: "gold" }}>Loading...</h6>
          </div>
        </div>
      ) : (
        <div className="home-page indexsix">
          <Header />
          <main className="main-wrapper">
            <section
              id="parallax"
              className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix bg-dark border-gradient border-gradient-gold only-bottom-border"
              style={{ backgroundColor: "#AD3DF0" }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                    <div className="breadcrumb-wrap text-center">
                      <div className="breadcrumb-title mb-30">
                        <h1 style={{ color: "white", marginTop: "20px" }}>
                          Food
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="pb-3 bg-dark">
              <div className="container">
                <div className="row">
                  <div className="col-6">
                    <div className="section-title mb-4 pt-4">
                      <h2 className="text-gold-gradient">
                        {showVeg ? "Veg & Non-veg" : "All Items"}
                      </h2>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="section-title mb-2 pt-4"
                      style={{ float: "right" }}
                    >
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        label={showVeg ? "Show All" : "Show Veg & Non-veg"}
                        style={{ fontSize: "20px" }}
                        checked={showVeg}
                        onChange={handleToggleChange}
                      />
                    </div>
                  </div>
                </div>

                {showVeg ? (
                  <>
                    <Row>
                      <Col md={12}>
                        <div
                          style={{
                            backgroundColor: "#595B56",
                            border: "1px dashed gold",
                          }}
                        >
                          <h4 className="text-gold-gradient text-center">
                            Veg Items
                          </h4>
                          <Row className="p-2">
                            {vegItems.map((item, i) => (
                              <div
                                className="col-lg-2 col-md-4 col-sm-6 col-6 mb-4"
                                key={i}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <div
                                  className="text-center position-relative"
                                  style={{
                                    cursor: "pointer",
                                    minHeight: "250px", // Ensures consistent minimum height
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    height: "100%",
                                  }}
                                  id="bgshadow"
                                >
                                  <div
                                    className="food-category item"
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      height: "100%",
                                    }}
                                  >
                                    <div
                                      className="food-img"
                                      style={{ flexGrow: 0 }}
                                    >
                                      <img
                                        src={URLS.Base + item.image}
                                        className="img-fluid"
                                        alt={item.name}
                                        style={{
                                          maxHeight: "170px", // Set image height
                                          objectFit: "cover",
                                          width: "100%",
                                        }}
                                      />
                                    </div>
                                    <div
                                      className="food-desc bg-dark"
                                      style={{
                                        flexGrow: 1,
                                        padding: "10px",
                                        // No height limit for full text display
                                      }}
                                    >
                                      <p
                                        className="fd-title text-gold-gradient"
                                        style={{ whiteSpace: "normal" }}
                                      >
                                        {item.name}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <div
                          style={{
                            backgroundColor: "#595B56",
                            border: "1px dashed gold",
                          }}
                        >
                          <h4 className="text-gold-gradient text-center">
                            Non-veg Items
                          </h4>
                          <Row className="p-2">
                            {nonVegItems.map((item, i) => (
                              <div
                                className="col-lg-2 col-md-4 col-sm-6 col-6 mb-4"
                                key={i}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <div
                                  className="text-center position-relative"
                                  style={{
                                    cursor: "pointer",
                                    minHeight: "250px", // Ensures consistent height
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    height: "100%",
                                  }}
                                  id="bgshadow"
                                >
                                  <div
                                    className="food-category item"
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      height: "100%",
                                    }}
                                  >
                                    <div
                                      className="food-img"
                                      style={{ flexGrow: 0 }}
                                    >
                                      <img
                                        src={URLS.Base + item.image}
                                        className="img-fluid"
                                        alt={item.name}
                                        style={{
                                          maxHeight: "170px", // Set image height
                                          objectFit: "cover",
                                          width: "100%",
                                        }}
                                      />
                                    </div>
                                    <div
                                      className="food-desc bg-dark"
                                      style={{
                                        flexGrow: 1,
                                        padding: "10px",
                                        // No height limit for full text display
                                      }}
                                    >
                                      <p
                                        className="fd-title text-gold-gradient"
                                        style={{ whiteSpace: "normal" }}
                                      >
                                        {item.name}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <Row>
                    <Col md={12}>
                      <div
                        style={{
                          backgroundColor: "#595B56",
                          border: "1px dashed gold",
                        }}
                      >
                        <h4 className="text-gold-gradient text-center bg-dark">
                          All Food Items
                        </h4>
                        <Row className="p-2 d-flex flex-wrap justify-content-start">
                          {food.map((item, i) => (
                            <div
                              className="col-lg-2 col-md-4 col-sm-6 col-6 mb-4"
                              key={i}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div
                                className="text-center position-relative card-equal"
                                style={{
                                  cursor: "pointer",
                                  minHeight: "250px", // Ensures consistent minimum height
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  height: "100%",
                                }}
                                id="bgshadow"
                              >
                                <div
                                  className="food-category item"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                  }}
                                >
                                  <div
                                    className="food-img"
                                    style={{ flexGrow: 0 }}
                                  >
                                    <img
                                      src={URLS.Base + item.image}
                                      className="img-fluid"
                                      alt={item.name}
                                      style={{
                                        maxHeight: "170px", // Set image height
                                        objectFit: "cover",
                                        width: "100%",
                                      }}
                                    />
                                  </div>
                                  <div
                                    className="food-desc bg-dark"
                                    style={{
                                      flexGrow: 1,
                                      padding: "10px",
                                      // Remove height limit and text overflow
                                    }}
                                  >
                                    <p
                                      className="fd-title text-gold-gradient"
                                      style={{ whiteSpace: "normal" }}
                                    >
                                      {item.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Row>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            </section>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default Food;
