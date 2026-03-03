import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const packages = [
    {
        id: 2,
        title: "Standard Plan",
        subtitle: "Includes cake, lights & decor.",
        detailedFeatures: {
            "Theatre + Decoration": true,
            "Fog Entry (1 Pot)": true,
            "Candle Path": true,
            "HBD LED": true,
            "Name with LED (6)": true,
            "AGE Number LED": true,
            "HBD with Rose Petals": true,
            "Photo Clipping (10)": true,
            "Birthday Sash": true,
            "Birthday Crown, Spects": true,
            "Rose": true,
            "Regular Cake - 1/2 kg": true,
            "Photography (15 Mins)": true,
            "Cold fire entry (6 pieces)": false,
            "Videography(Edited 1 Min Reel)": false,
            "Hall fog (4 Pots)": false,
        },
        badgeText: "Save ₹200",
        buttonText: "Proceed →",
        accent: "#6d28d9",
        highlight: false,
    },
    {
        id: 3,
        title: "Special Plan",
        subtitle: "Our grandest experience, full royal vibes.",
        detailedFeatures: {
            "Theatre + Decoration": true,
            "Fog Entry (1 Pot)": true,
            "Candle Path": true,
            "HBD LED": true,
            "Name with LED (6)": true,
            "AGE Number LED": true,
            "HBD with Rose petals": true,
            "Photo Clipping (10)": true,
            "Birthday Sash": true,
            "Birthday Crown, Spects": true,
            "Rose Bouquet (6 Roses)": true,
            "Customisation cake (1 kg)": true,
            "Photography (30 Mins)": true,
            "Cold fire entry (4 pieces)": true,
            "Videography(Edited 1 Min Reel)": false,
            "Hall fog (4 Pots)": false,
        },
        badgeText: "Save ₹400",
        buttonText: "Proceed →",
        accent: "#a855f7",
        highlight: true,
    },
    {
        id: 4,
        title: "Premium Plan",
        subtitle: "More guests, more upgrades, more glam.",
        detailedFeatures: {
            "Theatre + Decoration": true,
            "Fog Entry (1 Pot)": true,
            "Candle Path": true,
            "HBD LED": true,
            "Name with LED (6)": true,
            "AGE Number LED": true,
            "HBD with Rose petals": true,
            "Photo Clipping (10)": true,
            "Birthday Sash": true,
            "Birthday Crown, Spects": true,
            "Rose Bouquet (12 Roses)": true,
            "Customisation cake (1 kg)": true,
            "Photography (30 Mins)": true,
            "Cold fire entry (6 pieces)": true,
            "Videography(Edited 1 Min Reel)": true,
            "Hall fog (4 Pots)": true,
        },
        badgeText: "Save ₹300",
        buttonText: "Proceed →",
        accent: "#7C3AED",
        highlight: false,
    },
];

const PREVIEW_COUNT = 7;

function PackageCard({ pkg, navigateTheater }) {
    const [expanded, setExpanded] = useState(false);
    const features = Object.entries(pkg.detailedFeatures);
    const visible = expanded ? features : features.slice(0, PREVIEW_COUNT);
    const hasMore = features.length > PREVIEW_COUNT;

    return (
        <div style={{
            background: "#fff",
            borderRadius: "20px",
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow: pkg.highlight
                ? `0 8px 32px rgba(168,85,247,0.22), 0 2px 8px rgba(0,0,0,0.06)`
                : `0 4px 20px rgba(0,0,0,0.07)`,
            border: pkg.highlight ? `2px solid ${pkg.accent}` : "2px solid transparent",
            position: "relative",
            transition: "transform 0.2s, box-shadow 0.2s",
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 16px 40px rgba(168,85,247,0.2), 0 4px 12px rgba(0,0,0,0.08)`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = pkg.highlight
                    ? `0 8px 32px rgba(168,85,247,0.22), 0 2px 8px rgba(0,0,0,0.06)`
                    : `0 4px 20px rgba(0,0,0,0.07)`;
            }}
        >
            {/* TOP ACCENT BAR */}
            <div style={{
                height: "5px",
                background: `linear-gradient(90deg, ${pkg.accent}, #c084fc)`,
            }} />

            {/* POPULAR BADGE */}
            {pkg.highlight && (
                <div style={{
                    position: "absolute",
                    top: "18px",
                    right: "-1px",
                    background: `linear-gradient(135deg, ${pkg.accent}, #c084fc)`,
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "4px 12px 4px 10px",
                    borderRadius: "999px 0 0 999px",
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 8px rgba(168,85,247,0.35)",
                }}>
                    ⭐ MOST POPULAR
                </div>
            )}

            <div style={{ padding: "22px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>

                {/* HEADER */}
                <div style={{ marginBottom: "16px" }}>
                    <span style={{
                        display: "inline-block",
                        background: `linear-gradient(135deg, ${pkg.accent}22, ${pkg.accent}11)`,
                        color: pkg.accent,
                        border: `1px solid ${pkg.accent}33`,
                        borderRadius: "999px",
                        padding: "2px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        marginBottom: "8px",
                        letterSpacing: "0.4px",
                    }}>
                        {pkg.badgeText}
                    </span>
                    <h5 style={{ fontWeight: 800, color: "#1a1a2e", marginBottom: "3px", fontSize: "17px" }}>
                        {pkg.title}
                    </h5>
                    <p style={{ color: "#999", fontSize: "12px", margin: 0, fontStyle: "italic" }}>
                        {pkg.subtitle}
                    </p>
                </div>

                {/* DIVIDER */}
                <div style={{ height: "1px", background: "#f0e6ff", marginBottom: "14px" }} />

                {/* FEATURES */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
                    {visible.map(([feature, included], idx) => (
                        <li key={idx} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "5px 0",
                            borderBottom: "1px solid #faf5ff",
                            fontSize: "13px",
                            color: included ? "#1a1a2e" : "#bbb",
                        }}>
                            <span style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                background: included ? "#f0fdf4" : "#fff5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                fontSize: "10px",
                            }}>
                                {included ? "✅" : "❌"}
                            </span>
                            <span style={{ textDecoration: included ? "none" : "line-through" }}>
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* VIEW MORE / LESS */}
                {hasMore && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        style={{
                            background: "none",
                            border: "none",
                            color: pkg.accent,
                            fontWeight: 700,
                            fontSize: "12px",
                            cursor: "pointer",
                            padding: "8px 0 4px",
                            textAlign: "left",
                        }}
                    >
                        {expanded ? "▲ View Less" : `▼ View All ${features.length} features`}
                    </button>
                )}

                {/* PRICE + CTA */}
                <div style={{ marginTop: "16px" }}>
                    {pkg.price && (
                        <p style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a2e", marginBottom: "10px" }}>
                            Starts from{" "}
                            <span style={{ color: pkg.accent, fontSize: "18px" }}>₹{pkg.price}</span>
                        </p>
                    )}
                    <button
                        onClick={() => navigateTheater("/locations")}
                        style={{
                            width: "100%",
                            background: `linear-gradient(135deg, ${pkg.accent}, #c084fc)`,
                            border: "none",
                            borderRadius: "999px",
                            padding: "11px",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "14px",
                            cursor: "pointer",
                            boxShadow: `0 4px 14px ${pkg.accent}44`,
                            transition: "transform 0.15s, box-shadow 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                    >
                        {pkg.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PackagesSection({ navigateTheater }) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
            <div className="home-page indexsix">
                <Header />
                <section style={{ padding: "60px 0", background: "#f7f3ff" }}>
                    <div className="container">

                        {/* HEADING */}
                        <div className="text-center mb-5">
                            <h2 style={{
                                fontWeight: 900,
                                fontSize: "clamp(24px, 4vw, 36px)",
                                background: "linear-gradient(135deg, #6d28d9, #a855f7)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: "8px",
                            }}>
                                Our Packages
                            </h2>
                            <p style={{ color: "#999", fontStyle: "italic", fontSize: "15px" }}>Choose Wisely</p>
                            <div style={{
                                width: "48px", height: "4px",
                                background: "linear-gradient(90deg,#6d28d9,#c084fc)",
                                borderRadius: "999px",
                                margin: "12px auto 0",
                            }} />
                        </div>

                        {/* DESKTOP GRID */}
                        <div className="d-none d-md-flex flex-wrap justify-content-center gap-4">
                            {packages.map((pkg) => (
                                <div key={pkg.id} style={{ width: "280px", minWidth: "240px", flex: "0 1 280px" }}>
                                    <PackageCard pkg={pkg} navigateTheater={navigateTheater} />
                                </div>
                            ))}
                        </div>

                        {/* MOBILE CAROUSEL */}
                        <div className="d-md-none">
                            {/* Slide */}
                            <div style={{ padding: "0 16px" }}>
                                <PackageCard pkg={packages[activeIndex]} navigateTheater={navigateTheater} />
                            </div>

                            {/* Dot indicators */}
                            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
                                {packages.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        style={{
                                            width: i === activeIndex ? "24px" : "8px",
                                            height: "8px",
                                            borderRadius: "999px",
                                            background: i === activeIndex
                                                ? "linear-gradient(90deg,#6d28d9,#a855f7)"
                                                : "#ddd",
                                            border: "none",
                                            padding: 0,
                                            cursor: "pointer",
                                            transition: "all 0.25s ease",
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Prev / Next */}
                            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "14px" }}>
                                <button
                                    onClick={() => setActiveIndex((p) => Math.max(0, p - 1))}
                                    disabled={activeIndex === 0}
                                    style={{
                                        border: "1.5px solid #a855f7",
                                        background: "transparent",
                                        color: "#a855f7",
                                        borderRadius: "999px",
                                        padding: "6px 18px",
                                        fontWeight: 700,
                                        fontSize: "13px",
                                        cursor: activeIndex === 0 ? "not-allowed" : "pointer",
                                        opacity: activeIndex === 0 ? 0.35 : 1,
                                    }}
                                >
                                    ← Prev
                                </button>
                                <button
                                    onClick={() => setActiveIndex((p) => Math.min(packages.length - 1, p + 1))}
                                    disabled={activeIndex === packages.length - 1}
                                    style={{
                                        border: "none",
                                        background: "linear-gradient(135deg,#6d28d9,#a855f7)",
                                        color: "#fff",
                                        borderRadius: "999px",
                                        padding: "6px 18px",
                                        fontWeight: 700,
                                        fontSize: "13px",
                                        cursor: activeIndex === packages.length - 1 ? "not-allowed" : "pointer",
                                        opacity: activeIndex === packages.length - 1 ? 0.35 : 1,
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>

                    </div>
                </section>
                <Footer />
            </div>
        </>
    );
}