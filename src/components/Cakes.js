import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { Row, Col, Card, Nav, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";

const API_URL =
  "https://api.carnivalcastle.com/v1/carnivalApi/web/category/getcakes";
const BASE_URL = "https://api.carnivalcastle.com/";

function Enquiry() {
  const [premiumCakes, setPremiumCakes] = useState([]);
  const [normalCakes, setNormalCakes] = useState([]);
  const [activeTab, setActiveTab] = useState("premium");
  const [cakeType, setCakeType] = useState("egg");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCakes();
  }, []);

  const loadCakes = async () => {
    try {
      setLoading(true);
      const res = await axios.post(API_URL);
      if (res.data.success) {
        setPremiumCakes(res.data.premiumCakes || []);
        setNormalCakes(res.data.normalCakes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const cakesToShow = useMemo(() => {
    const source = activeTab === "premium" ? premiumCakes : normalCakes;
    return source.filter((c) => c.cakeType === cakeType);
  }, [activeTab, cakeType, premiumCakes, normalCakes]);

  return (
    <>
      <Helmet>
        <title>Cakes | Carnival Castle</title>
      </Helmet>

      {loading ? (
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-dark">
          <img src="assets/img/gipss.gif" height="260" />
          <p className="text-warning mt-2">Loading cakes...</p>
        </div>
      ) : (
        <div className="cakes-page">
          <Header />

          <main>
            {/* Title */}
            <section className="cakes-hero">
              <h1>Cakes Collection</h1>
              <p>Premium & Standard cakes for every celebration</p>
            </section>

            {/* Controls */}
            <section className="cakes-controls">
              <div className="container">
                <Row className="align-items-center">
                  <Col md={6}>
                    <Nav
                      variant="pills"
                      activeKey={activeTab}
                      onSelect={(k) => setActiveTab(k)}
                      className="cakes-tabs"
                    >                      
                      <Nav.Item>
                        <Nav.Link eventKey="premium">
                          Premium Cakes
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="normal">
                          Standard Cakes
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>

                  {/* TOGGLE AT END */}
                  <Col
                    md={6}
                    className="d-flex justify-content-md-end justify-content-start mt-3 mt-md-0"
                  >
                    <div className="d-flex align-items-center gap-2 cake-toggle">
                      <span className={cakeType === "egg" ? "fw-bold lightest-text" : ""}>
                        Egg
                      </span>

                      <Form.Check
                        type="switch"
                        id="cake-type"
                        checked={cakeType === "eggless"}
                        onChange={() =>
                          setCakeType(cakeType === "egg" ? "eggless" : "egg")
                        }
                      />

                      <span
                        className={cakeType === "eggless" ? "fw-bold lightest-text" : ""}
                      >
                        Eggless
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            </section>

            {/* Cakes */}
            <section className="cakes-grid">
              <div className="container">
                {cakesToShow.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    No cakes available
                  </div>
                ) : (
                  <Row>
                    {cakesToShow.map((cake, i) => (
                      <Col
                        key={i}
                        xl={2}
                        lg={3}
                        md={4}
                        sm={6}
                        xs={6}
                        className="mb-4"
                      >
                        <Card className="cake-card">
                          <div className="cake-image">
                            <img
                              src={BASE_URL + cake.image}
                              alt={cake.name}
                            />
                          </div>

                          <Card.Body className="text-center">
                            <h6 className="cake-name">{cake.name}</h6>
                            <div className="cake-price">
                              ₹ {cake.price}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}

                    {activeTab === "premium" && (
                      <div className="premium-note">
                        <b>Note:</b> Customized premium cakes must be ordered
                        at least <b>3 days in advance</b>.
                      </div>
                    )}
                  </Row>
                )}
              </div>
            </section>
          </main>

          <Footer />
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .cakes-page {
          background: #f7f8fc;
          min-height: 100vh;
        }

        .cakes-hero {
          background: linear-gradient(135deg, #ffffff, #f3f4ff);
          text-align: center;
          padding: 60px 15px 40px;
        }

        .cakes-controls {
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 20;
          border-bottom: 1px solid #eee;
          padding: 15px 0;
        }

        .cakes-tabs .nav-link {
          border-radius: 30px;
          padding: 8px 20px;
          font-weight: 600;
        }

        .cake-toggle span {
          font-size: 16px;
        }

        .cakes-grid {
          padding: 30px 0;
        }

        .cake-card {
          border: none;
          border-radius: 18px;
          background: #ffffff;
          height: 100%;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .cake-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
        }

        .cake-image {
          height: 160px;
          overflow: hidden;
          border-radius: 18px 18px 0 0;
        }

        .cake-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cake-name {
          font-weight: 600;
          margin-bottom: 6px;
        }

        .cake-price {
          font-size: 18px;
          font-weight: 800;
          color: #9D4DFF;
        }

        .premium-note {
          margin-top: 20px;
          background: #fff3cd;
          padding: 15px;
          border-radius: 12px;
        }
      `}</style>
    </>
  );
}

export default Enquiry;
