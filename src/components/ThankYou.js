import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import { Checkmark } from "react-checkmark";
import thank from "./images/thankYOU.webp";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"; 

function Enquiry() {
  const [resdata, setresdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams123] = useSearchParams();
  const useid = searchParams123.get('id');
  useEffect(() => {
    GetFaqsData();
  }, []);

  const GetFaqsData = () => {
    const bodydata={
      bookingId: sessionStorage.getItem("bookingid") || useid,
    }
    axios.post("https://api.carnivalcastle.com/v1/carnivalApi/admin/booking/get-bookingbyid", bodydata, {}).then((res) => {
      if (res.status === 200) {
        setresdata(res.data.data[0]);
        setIsLoading(false);
        sessionStorage.clear();
      }
    });
  };

  const orderId = sessionStorage.getItem("orderId");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const invoiceFromUrl = sessionStorage.getItem("invoicePath");
  // const invoiceFromUrl = searchParams.get("invoice");

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
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
          <main className="main-wrapper lightest-back">
            <section
              id="parallax"
              className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix"
            ></section>
            <div className="container d-flex justify-content-center align-items-center vh-100">
              <div
                className="lighter-back p-4 m-3 rounded text-center"
                style={{ maxWidth: "100%", width: "100%", maxWidth: "400px" }}
              >
                <div className="mb-3">
                  <Checkmark
                    style={{
                      color: "green",
                      fontSize: "3rem",
                      animation: "bounce 1s infinite",
                    }}
                  />
                </div>
                <h3>Payment Successful</h3>
                <p>
                  Order ID: <strong>{resdata.orderId}</strong>
                </p>
                <img
                  src={thank}
                  alt="Payment Successful"
                  className="img-fluid mt-3 mb-3"
                />
                <div className="d-flex flex-column flex-sm-row justify-content-between">
                  <button
                    onClick={handleClick}
                    className="btn light-back shadow-sm text-light mb-2 mb-sm-0"
                    style={{ boxShadow: "none" }}
                  >
                    Go to Home
                  </button>
                  <a
                    href={"https://api.carnivalcastle.com/" + resdata.invoice}
                    className="btn light-back shadow-sm text-light"
                    target="_blank"
                    style={{ boxShadow: "none" }}
                  >
                    Invoice
                  </a>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default Enquiry;
