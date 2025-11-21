// src/components/ThankYouModal.jsx
import React from "react";
import { X } from "lucide-react";

const ThankYouModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div
                    className="modal-content p-4 text-center gradientright"
                    style={{
                        borderRadius: "20px",
                        border: "2px solid #C69FF4",
                        boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="btn"
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            borderRadius: "50%",
                            background: "#F1E9FE",
                            color: "#330C5F",
                            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                        }}
                    >
                        <X />
                    </button>

                    <div className="d-flex justify-content-center">
                        <img
                            src="thankyou.png"
                            alt="Success"
                            className="img-fluid"
                            style={{
                                marginBottom: "15px",
                                height: "150px",
                                width: "150px",
                            }}
                        />
                    </div>


                    {/* Heading */}
                    <h2 className="dark-text fw-bold">Thank You!</h2>

                    {/* Message */}
                    <p className="mt-2 fs-5 light-text">
                        Your enquiry has been received. <br />
                        Our team will contact you shortly!
                    </p>

                    {/* OK Button */}
                    <button
                        className="btn mt-4 px-4"
                        onClick={onClose}
                        style={{
                            background: "#9D4DFF",
                            color: "white",
                            padding: "10px 35px",
                            borderRadius: "10px",
                            fontWeight: "600",
                            fontSize: "18px",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThankYouModal;
