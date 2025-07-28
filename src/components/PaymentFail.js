import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import error from "./images/errorImage.jpg";
import { useNavigate } from "react-router-dom";

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


  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
    // navigate("/BookingSummary");
  };

  return (
    <>
      {isLoading == true ? (
        <>
          <div
            className="text-center "
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
            <main className="main-wrapper bg-dark text-white">
              <section
                id="parallax"
                className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
              ></section>
              <div className="container d-flex justify-content-center align-items-center vh-100">
                <div
                  className="bg-light-grey gradient-border p-4 m-3 rounded text-center"
                  style={{ maxWidth: "100%", width: "100%", maxWidth: "400px" }}
                >
                  <h3 className="text-danger">Payment Failed</h3>
                  <p className="text-danger">Please Try Again</p>
                  <img
                    src={error}
                    alt="Payment Failed"
                    className="img-fluid mt-3 mb-3"
                  />
                  <div className="d-flex flex-column flex-sm-row justify-content-between">
                    <button
                      onClick={handleClick}
                      className="btn main-booknow mb-2 mb-sm-0"
                      style={{boxShadow:"none"}}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Enquiry;
