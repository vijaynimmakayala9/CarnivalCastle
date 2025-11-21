import React, { useState, useEffect } from 'react';

export default function HeroBanner() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      setMousePos({ x, y });

      // Calculate rotation angles based on mouse position
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const rotX = ((y - centerY) / centerY) * 25;
      const rotY = ((x - centerX) / centerX) * 25;

      setRotationX(-rotX);
      setRotationY(rotY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const styles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateZ(-100px) rotateX(20deg);
      }
      to {
        opacity: 1;
        transform: translateZ(0) rotateX(0);
      }
    }

    @keyframes floatDepth {
      0%, 100% {
        transform: translateZ(0px);
      }
      50% {
        transform: translateZ(30px);
      }
    }

    @keyframes shimmer {
      0%, 100% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
    }

    @keyframes spin3d {
      0% {
        transform: rotateY(0deg) rotateX(0deg) translateZ(200px);
      }
      100% {
        transform: rotateY(360deg) rotateX(10deg) translateZ(200px);
      }
    }

    .hero-container {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      backgroundImage: linear-gradient(135deg, #f0e4ff 0%, #c69ff4 100%);
      perspective: 1200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-scene {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      perspective: 1200px;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 50% 50%, rgba(198, 159, 244, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%);
      transform-origin: center;
      will-change: transform;
      transition: transform 0.08s ease-out;
    }

    .floating-3d-container {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transform-style: preserve-3d;
      perspective: 1200px;
    }

    .floating-element-3d {
      position: absolute;
      font-size: 5rem;
      filter: drop-shadow(0 0 30px rgba(64, 0, 140, 0.4));
      pointer-events: none;
      transform-style: preserve-3d;
      animation: floatDepth 2s ease-in-out infinite;
      will-change: transform;
    }

    .floating-element-3d:nth-child(1) {
      top: 15%;
      left: 20%;
      animation: spin3d 8s linear infinite;
      animation-delay: 0s;
    }

    .floating-element-3d:nth-child(2) {
      top: 25%;
      right: 15%;
      animation: spin3d 10s linear infinite;
      animation-delay: 2s;
      animation-direction: reverse;
    }

    .floating-element-3d:nth-child(3) {
      bottom: 25%;
      left: 10%;
      animation: spin3d 9s linear infinite;
      animation-delay: 1s;
    }

    .floating-element-3d:nth-child(4) {
      bottom: 20%;
      right: 12%;
      animation: spin3d 11s linear infinite;
      animation-delay: 3s;
      animation-direction: reverse;
    }

    .floating-element-3d:nth-child(5) {
      top: 50%;
      left: 8%;
      animation: spin3d 12s linear infinite;
      animation-delay: 1.5s;
    }

    .floating-element-3d:nth-child(6) {
      top: 35%;
      right: 8%;
      animation: spin3d 7s linear infinite;
      animation-delay: 2.5s;
      animation-direction: reverse;
    }

    .hero-content {
      position: relative;
      text-align: center;
      z-index: 10;
      transform-style: preserve-3d;
      will-change: transform;
      animation: fadeInUp 1s ease-out;
    }

    .content-inner {
      transform-style: preserve-3d;
      transition: transform 0.1s ease-out;
    }

    .hero-title {
      font-size: clamp(2.5rem, 10vw, 5rem);
      font-weight: 900;
      color: #330C5F;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 1rem;
      text-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.1),
        0 0 60px rgba(198, 159, 244, 0.3),
        0 0 100px rgba(157, 77, 255, 0.15);
      line-height: 1.1;
      transform-style: preserve-3d;
      transition: text-shadow 0.3s ease;
    }

    .hero-title.hovering {
      text-shadow: 
        0 15px 40px rgba(0, 0, 0, 0.15),
        0 0 80px rgba(157, 77, 255, 0.5),
        0 0 150px rgba(198, 159, 244, 0.4);
    }

    .hero-subtitle {
      font-size: clamp(1rem, 3vw, 1.6rem);
      color: #40008C;
      margin-bottom: 2.5rem;
      text-shadow: 0 5px 20px rgba(198, 159, 244, 0.3);
      letter-spacing: 2px;
      font-weight: 300;
      transform-style: preserve-3d;
    }

    .cta-button {
      display: inline-block;
      padding: 20px 60px;
      background: linear-gradient(45deg, #C69FF4, #9D4DFF);
      color: #FFFAFB;
      text-decoration: none;
      border: none;
      border-radius: 50px;
      font-size: 1.2rem;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 
        0 15px 50px rgba(157, 77, 255, 0.4),
        0 0 80px rgba(198, 159, 244, 0.25),
        inset 0 -3px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
      text-transform: uppercase;
      letter-spacing: 2px;
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
    }

    .cta-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.6s;
    }

    .cta-button:hover {
      transform: translateZ(50px) translateY(-6px) scale(1.08);
      box-shadow: 
        0 25px 70px rgba(157, 77, 255, 0.6),
        0 0 120px rgba(198, 159, 244, 0.4);
    }

    .cta-button:hover::before {
      left: 100%;
    }

    .cta-button:active {
      transform: translateZ(30px) translateY(-3px) scale(1.05);
    }

    @media (max-width: 768px) {
      .hero-container {
        perspective: 800px;
      }

      .floating-element-3d {
        font-size: 3rem;
      }

      .hero-title {
        text-shadow: 
          0 8px 20px rgba(0, 0, 0, 0.8),
          0 0 40px rgba(255, 215, 0, 0.3);
      }

      .cta-button {
        padding: 16px 45px;
        font-size: 1rem;
      }
    }
  `;

  return (
    <div
      className="hero-container"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setRotationX(0);
        setRotationY(0);
      }}
    >
      <style>{styles}</style>

      {/* 3D Background Scene */}
      <div
        className="hero-scene"
        style={{
          transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) perspective(1200px)`,
          transition: 'transform 0.08s ease-out',
        }}
      >
        <div
          className="hero-background"
          style={{
            transform: `translateZ(${isHovering ? 100 : 50}px)`,
          }}
        />

        {/* 3D Floating Elements Container */}
        <div
          className="floating-3d-container"
          style={{
            transform: `rotateX(${rotationX * 0.5}deg) rotateY(${rotationY * 0.5}deg)`,
          }}
        >
          <div className="floating-element-3d">🎈</div>
          <div className="floating-element-3d">🎉</div>
          <div className="floating-element-3d">🎂</div>
          <div className="floating-element-3d">🎊</div>
          <div className="floating-element-3d">✨</div>
          <div className="floating-element-3d">🎁</div>
        </div>
      </div>

      {/* Main Content with 3D Effect */}
      <div
        className="hero-content"
        style={{
          transform: `rotateX(${rotationX * 0.3}deg) rotateY(${rotationY * 0.3}deg) translateZ(200px)`,
        }}
      >
        <div
          className="content-inner"
          style={{
            transform: `translateZ(${isHovering ? 100 : 0}px)`,
          }}
        >
          <h1 className={`hero-title ${isHovering ? 'hovering' : ''}`}>
            CarnivalCastle
          </h1>
          <p className="hero-subtitle">
            Private Theaters for Birthdays, Anniversaries & Magical Surprises
          </p>
          <button className="cta-button">
            Book Your Celebration
          </button>
        </div>
      </div>
    </div>
  );
}