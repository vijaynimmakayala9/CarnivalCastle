import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";

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
      {isLoading === true ? (
        <div
          className="text-center"
          style={{
            backgroundColor: "var(--charcoal-black)",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
          <main className="main-wrapper bg-dark text-white">
            <section
              id="parallax"
              className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
              style={{ height: "100vh" }}
            >
              <div className="text-center">
                {/* Centered spinnerrr */}
                <div className="spinner-border" role="status"></div>
                <h1 className="mt-3">Payment Processing</h1>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default Enquiry;
