import React, { useEffect, useState } from "react";

const Time = () => {
  const images = [
    "/mnt/data/A_3D-rendered_digital_image_for_CarnivalCastle_Pri.png",
    "https://picsum.photos/1920/1080?random=11",
    "https://picsum.photos/1920/1080?random=12",
    "https://picsum.photos/1920/1080?random=13",
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Fast all-effects transition every 1 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(Math.random() > 0.5 ? 1 : -1); // random left/right sliding each time
      setIndex((prev) => (prev + 1) % images.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // 3D parallax effect
  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;

      document.querySelectorAll(".float3d").forEach((el) => {
        const depth = el.getAttribute("data-depth") || 2;
        el.style.transform = `translate(${x / depth}px, ${y / depth}px)`;
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="position-relative d-flex align-items-center justify-content-center text-center"
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(45deg, #FFFAFB, #C69FF4)",
      }}
    >
      {/* IMAGE LAYERS */}
      <div className="position-absolute w-100 h-100 top-0 start-0">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "all 1s ease-out",
              opacity: index === i ? 1 : 0,
              transform:
                index === i
                  ? `
                translateX(${direction * -80}px)
                scale(1.15)
                rotate(${direction * 2}deg)
              `
                  : `
                translateX(${direction * 200}px)
                scale(1.3)
              `,
              filter:
                index === i
                  ? "brightness(0.55) blur(2px)"
                  : "brightness(0.3) blur(10px)",
            }}
          />
        ))}
      </div>

      {/* 3D BALLOONS */}
      <img
        src="https://picsum.photos/200?random=99"
        className="float3d position-absolute"
        data-depth="1.2"
        style={{
          top: "12%",
          left: "10%",
          width: "150px",
          filter: "drop-shadow(0 0 15px #9D4DFF)",
          transition: "transform 0.1s linear",
        }}
      />

      <img
        src="https://picsum.photos/200?random=100"
        className="float3d position-absolute"
        data-depth="2"
        style={{
          bottom: "12%",
          right: "8%",
          width: "180px",
          filter: "drop-shadow(0 0 25px #4000BC)",
          transition: "transform 0.1s linear",
        }}
      />

      <img
        src="https://picsum.photos/200?random=101"
        className="float3d position-absolute"
        data-depth="1.5"
        style={{
          top: "30%",
          right: "32%",
          width: "160px",
          filter: "drop-shadow(0 0 20px #E9DCFF)",
          transition: "transform 0.1s linear",
        }}
      />

      {/* TEXT */}
      <div style={{ zIndex: 50 }}>
        <h1
          className="fw-bold"
          style={{
            fontSize: "3.5rem",
            color: "#40008C",
            textShadow: "0 0 25px #C69FF4",
            animation: "fadeIn 1.5s ease-out",
          }}
        >
          CarnivalCastle Private Theaters
        </h1>

        <p
          className="lead"
          style={{
            color: "#330C5F",
            fontSize: "1.25rem",
            textShadow: "0 0 12px #F1E9FE",
          }}
        >
          The fastest, most cinematic celebration experience.
        </p>

        <button
          className="btn btn-lg mt-3"
          style={{
            backgroundColor: "#9D4DFF",
            padding: "12px 30px",
            color: "#fff",
            borderRadius: "10px",
            boxShadow: "0 0 30px #C69FF4",
          }}
        >
          Book Your Celebration
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Time;
