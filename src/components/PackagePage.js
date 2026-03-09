import React, { useState, useRef } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const C = {
    bg: "#F1E9FE", card: "#FFFAFB", border: "#E9DCFF",
    dark: "#4000BC", mid: "#9D4DFF", light: "#C69FF4",
    textDark: "#330C5F", textMid: "#40008C", textLight: "#9D4DFF",
};

const PLANS = [
    {
        id: 1, tier: "01", title: "Standard", tag: "Cake, lights & dreamy décor.", badge: "Save ₹200",
        g: ["#7B2FE0", "#C69FF4"],
        f: { "Theatre + Decoration": 1, "Fog Entry (1 Pot)": 1, "Candle Path": 1, "HBD LED": 1, "Name with LED (6)": 1, "AGE Number LED": 1, "HBD with Rose Petals": 1, "Photo Clipping (10)": 1, "Birthday Sash": 1, "Birthday Crown & Spects": 1, "Rose": 1, "Regular Cake – ½ kg": 1, "Photography (15 Mins)": 1, "Cold Fire Entry (6 pcs)": 0, "Videography (1-Min Reel)": 0, "Hall Fog (4 Pots)": 0 },
    },
    {
        id: 2, tier: "02", title: "Special", tag: "Full royal vibes, grandest experience.", badge: "★ Most Popular", star: 1,
        g: [C.mid, C.light],
        f: { "Theatre + Decoration": 1, "Fog Entry (1 Pot)": 1, "Candle Path": 1, "HBD LED": 1, "Name with LED (6)": 1, "AGE Number LED": 1, "HBD with Rose Petals": 1, "Photo Clipping (10)": 1, "Birthday Sash": 1, "Birthday Crown & Spects": 1, "Rose Bouquet (6 Roses)": 1, "Customisation Cake (1 kg)": 1, "Photography (30 Mins)": 1, "Cold Fire Entry (4 pcs)": 1, "Videography (1-Min Reel)": 0, "Hall Fog (4 Pots)": 0 },
    },
    {
        id: 3, tier: "03", title: "Premium", tag: "More guests, more glam, all-in.", badge: "Save ₹300",
        g: ["#5B21B6", C.light],
        f: { "Theatre + Decoration": 1, "Fog Entry (1 Pot)": 1, "Candle Path": 1, "HBD LED": 1, "Name with LED (6)": 1, "AGE Number LED": 1, "HBD with Rose Petals": 1, "Photo Clipping (10)": 1, "Birthday Sash": 1, "Birthday Crown & Spects": 1, "Rose Bouquet (12 Roses)": 1, "Customisation Cake (1 kg)": 1, "Photography (30 Mins)": 1, "Cold Fire Entry (6 pcs)": 1, "Videography (1-Min Reel)": 1, "Hall Fog (4 Pots)": 1 },
    },
];

const PREVIEW = 7;
const CARD_VW = 68, GAP_VW = 4;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@400;500;600&display=swap');

.cc,
.cc * { box-sizing: border-box; margin: 0; padding: 0; }

.cc {
  font-family: Outfit, sans-serif;
  background: ${C.bg};
  min-height: 100vh;
  padding: 72px 0 88px;
  position: relative;
  overflow: hidden;
}

/* ambient orbs */
.cc::before, .cc::after {
  content:''; position:absolute; border-radius:50%;
  pointer-events:none; filter:blur(90px); opacity:.3;
}
.cc::before { width:540px;height:540px; background:radial-gradient(circle,${C.light},transparent 70%); top:-160px;right:-120px; }
.cc::after  { width:360px;height:360px; background:radial-gradient(circle,${C.border},transparent 70%); bottom:-80px;left:-80px; }

/* ── HEADING ── */
.cc-head { text-align:center; margin-bottom:52px; position:relative; z-index:2; animation:fadeUp .65s ease both; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

.cc-eyebrow {
  display:inline-flex; align-items:center; gap:7px;
  font-size:10px; font-weight:600; letter-spacing:3px; text-transform:uppercase;
  color:${C.textLight}; background:${C.card}; border:1px solid ${C.border};
  padding:5px 16px; border-radius:999px; margin-bottom:16px;
  box-shadow:0 2px 12px rgba(157,77,255,.1);
}
.cc-eyebrow::before,.cc-eyebrow::after{content:'✦';font-size:8px;opacity:.55}

.cc-title {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(36px,6vw,58px); font-weight:700;
  color:${C.textDark}; line-height:1.08; margin-bottom:8px; letter-spacing:-.3px;
}
.cc-title em {
  font-style:italic;
  background:linear-gradient(135deg,${C.textMid},${C.mid});
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}
.cc-sub { color:${C.light}; font-size:13.5px; }
.cc-rule { display:flex; align-items:center; justify-content:center; gap:10px; margin-top:16px; }
.cc-rl { width:44px;height:1px; background:linear-gradient(to right,transparent,${C.light}); }
.cc-rl.r { background:linear-gradient(to left,transparent,${C.light}); }
.cc-rd { width:6px;height:6px; background:${C.mid}; transform:rotate(45deg); border-radius:1px; }

/* ── DESKTOP TRACK ── */
.cc-track {
  display:flex; align-items:center; justify-content:center;
  padding:28px 0 36px; position:relative; z-index:2;
}
.cc-slot {
  flex-shrink:0; cursor:pointer;
  transition: transform .5s cubic-bezier(.34,1.5,.64,1),
              opacity .5s ease,
              filter .5s ease,
              margin .5s cubic-bezier(.34,1.5,.64,1);
  animation: fadeUp .6s ease both;
}
.cc-slot:nth-child(1){animation-delay:.1s}
.cc-slot:nth-child(2){animation-delay:.2s}
.cc-slot:nth-child(3){animation-delay:.3s}

.cc-slot.center { width:340px; transform:scale(1) translateY(0); z-index:10; }
.cc-slot.side   { width:272px; transform:scale(0.82) translateY(28px); opacity:.55; filter:saturate(.65); z-index:5; margin:0 -28px; }
.cc-slot.side:hover { opacity:.78; transform:scale(0.86) translateY(20px); filter:saturate(.85); }

/* ── CARD ── */
.cc-card {
  background:${C.card}; border-radius:22px; overflow:hidden;
  border:1.5px solid transparent; display:flex; flex-direction:column;
  position:relative;
  transition: border-color .35s, box-shadow .35s;
}
.cc-slot.center .cc-card {
  border-color:${C.border};
  box-shadow: 0 0 0 4px rgba(157,77,255,.07), 0 22px 56px rgba(64,0,188,.12), 0 6px 16px rgba(157,77,255,.09);
}
.cc-slot.side .cc-card { box-shadow:0 4px 18px rgba(64,0,188,.06); }

.cc-stripe { height:4px; background:var(--g); }
.cc-tier {
  position:absolute; top:14px; right:16px;
  font-family:'Cormorant Garamond',serif; font-size:48px; font-weight:700;
  line-height:1; color:rgba(198,159,244,.18); pointer-events:none; user-select:none;
  transition: color .35s;
}
.cc-slot.center .cc-tier { color:rgba(157,77,255,.1); }

.cc-body { padding:26px 22px 24px; flex:1; display:flex; flex-direction:column; }

.cc-badge {
  display:inline-flex; align-items:center; gap:4px;
  font-size:9.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
  padding:3px 10px; border-radius:999px; margin-bottom:10px; width:fit-content;
  background:${C.bg}; border:1px solid ${C.border}; color:${C.textLight};
  transition: background .35s, color .35s, box-shadow .35s;
}
.cc-slot.center .cc-badge {
  background:var(--g); border:none; color:#fff;
  box-shadow:0 3px 12px rgba(157,77,255,.28);
}

.cc-name { font-family:'Cormorant Garamond',serif; font-size:25px; font-weight:700; color:${C.textDark}; margin-bottom:2px; letter-spacing:-.2px; }
.cc-tag  { font-size:12px; color:${C.light}; font-style:italic; margin-bottom:13px; }
.cc-div  { height:1px; background:linear-gradient(to right,${C.border},transparent); margin-bottom:11px; }

.cc-feats { list-style:none; flex:1; }
.cc-feat  {
  display:flex; align-items:center; gap:8px;
  padding:7px 0; border-bottom:1px solid rgba(198,159,244,.1); font-size:12.5px;
}
.cc-feat.y { color:${C.textDark}; }
.cc-feat.n { color:${C.light}; opacity:.58; }
.cc-feat.n span:last-child { text-decoration:line-through; }
.cc-dot {
  width:18px;height:18px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;
}
.cc-dot.y{background:#F0FDF4;color:#15803D} .cc-dot.n{background:#FDF4FF;color:${C.light}}

.cc-more {
  background:none;border:none;color:${C.textLight};font-size:11.5px;font-weight:600;
  cursor:pointer;padding:7px 0 2px;font-family:Outfit,sans-serif;
  transition: color .2s;
}
.cc-more:hover{color:${C.textMid}}

.cc-btn {
  width:100%;border:none;border-radius:12px;padding:11.5px 16px;
  font-family:Outfit,sans-serif;font-weight:600;font-size:13.5px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:6px;margin-top:15px;
  transition: transform .18s, box-shadow .18s, background .35s;
}
.cc-slot.center .cc-btn, .cc-btn.active {
  background:var(--g);color:#fff;
  box-shadow:0 5px 20px rgba(157,77,255,.36);
}
.cc-slot.center .cc-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(157,77,255,.46); }
.cc-slot.side .cc-btn, .cc-btn.passive {
  background:${C.bg};color:${C.textMid};border:1.5px solid ${C.border};
}
.cc-slot.side .cc-btn:hover,.cc-btn.passive:hover{background:${C.border}}

/* ── INDICATOR DOTS ── */
.cc-dots { display:flex;justify-content:center;gap:7px;margin-top:6px;position:relative;z-index:2; }
.cc-pip {
  border:none;padding:0;cursor:pointer;height:7px;border-radius:999px;
  background:${C.border};transition:all .32s ease;
}
.cc-pip.on{background:linear-gradient(90deg,${C.textMid},${C.mid})}

/* ── MOBILE ── */
.cc-mob { overflow:hidden;padding:16px 0 20px;position:relative;z-index:2; }
.cc-mob-track {
  display:flex;align-items:flex-start;
  transition:transform .46s cubic-bezier(.34,1.26,.64,1);
  will-change:transform;
}
.cc-mob-slide {
  flex-shrink:0;cursor:pointer;
  transition:transform .44s ease,opacity .44s ease,filter .44s ease;
}
.cc-mob-slide.mc{transform:scale(1);opacity:1;filter:none}
.cc-mob-slide.ms{transform:scale(0.87) translateY(14px);opacity:.5;filter:saturate(.65)}

.cc-nav { display:flex;justify-content:center;gap:10px;margin-top:14px; }
.cc-nav-btn {
  border-radius:12px;padding:8px 22px;font-weight:600;font-size:13px;
  cursor:pointer;font-family:Outfit,sans-serif;transition:all .2s;border:none;
}
.cc-nav-btn.p {
  background:${C.card};border:1.5px solid ${C.border};color:${C.textMid};
  box-shadow:0 2px 8px rgba(157,77,255,.08);
}
.cc-nav-btn.p:hover:not(:disabled){background:${C.bg}}
.cc-nav-btn.n {
  background:linear-gradient(135deg,${C.textMid},${C.mid});color:#fff;
  box-shadow:0 4px 14px rgba(157,77,255,.32);
}
.cc-nav-btn.n:hover:not(:disabled){box-shadow:0 6px 20px rgba(157,77,255,.44)}
.cc-nav-btn:disabled{opacity:.25;cursor:not-allowed}

@media(max-width:767px){.cc{padding:48px 0 60px}.cc-head{margin-bottom:36px}}
`;

function Card({ p, mobRole }) {
    const [exp, setExp] = useState(false);
    const feats = Object.entries(p.f);
    const shown = exp ? feats : feats.slice(0, PREVIEW);
    const grad = `linear-gradient(135deg,${p.g[0]},${p.g[1]})`;
    const isM = mobRole != null;

    const navigate = useNavigate();

    return (
        <div className="cc-card" style={{ "--g": grad }}>
            <div className="cc-stripe" />
            <div className="cc-tier">{p.tier}</div>
            <div className="cc-body">
                <span className="cc-badge">{p.badge}</span>
                <h5 className="cc-name">{p.title}</h5>
                <p className="cc-tag">{p.tag}</p>
                <div className="cc-div" />
                <ul className="cc-feats">
                    {shown.map(([k, v], i) => (
                        <li key={i} className={`cc-feat ${v ? "y" : "n"}`}>
                            <span className={`cc-dot ${v ? "y" : "n"}`}>{v ? "✓" : "·"}</span>
                            <span>{k}</span>
                        </li>
                    ))}
                </ul>
                {feats.length > PREVIEW && (
                    <button className="cc-more" onClick={e => { e.stopPropagation(); setExp(x => !x) }}>
                        {exp ? "▲ Show less" : `▼ All ${feats.length} inclusions`}
                    </button>
                )}
                <button
                    className={`cc-btn${isM ? (mobRole === "c" ? " active" : " passive") : ""}`}
                    style={{ "--g": grad }}
                    onClick={e => {
                        e.stopPropagation();
                        navigate('/locations');
                    }}
                >
                    Book This Plan →
                </button>
            </div>
        </div>
    );
}

export default function PackagesSection() {
    const [active, setActive] = useState(1);
    const mobX = `calc(${50 - CARD_VW / 2}vw - ${active * (CARD_VW + GAP_VW)}vw)`;

    // Touch swipe state
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);
    const isSwiping = useRef(false);

    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        isSwiping.current = false;
    };

    const onTouchMove = (e) => {
        if (touchStartX.current === null) return;
        const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
        const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
        // If horizontal movement dominates, treat as swipe and block scroll
        if (dx > dy && dx > 8) {
            isSwiping.current = true;
            e.preventDefault();
        }
    };

    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (isSwiping.current && Math.abs(dx) > 40) {
            if (dx < 0) setActive(p => Math.min(PLANS.length - 1, p + 1)); // swipe left → next
            else setActive(p => Math.max(0, p - 1));                // swipe right → prev
        }
        touchStartX.current = null;
        touchStartY.current = null;
        isSwiping.current = false;
    };

    const Dots = () => (
        <div className="cc-dots">
            {PLANS.map((_, i) => (
                <button key={i} className={`cc-pip${i === active ? " on" : ""}`}
                    style={{ width: i === active ? "26px" : "7px" }} onClick={() => setActive(i)} />
            ))}
        </div>
    );

    return (
        <>
            <div className="home-page indexsix">
                <Header />
                <style>{css}</style>
                <div className="cc">

                    {/* Heading */}
                    <div className="cc-head">
                        <div className="cc-eyebrow">Celebration Packages</div>
                        <h2 className="cc-title">Choose Your <em>Celebration</em></h2>
                        <p className="cc-sub">Pick the plan that matches your moment</p>
                        <div className="cc-rule">
                            <div className="cc-rl" /><div className="cc-rd" /><div className="cc-rl r" />
                        </div>
                    </div>

                    {/* Desktop */}
                    <div className="d-none d-md-block">
                        <div className="cc-track">
                            {PLANS.map((p, i) => (
                                <div key={p.id} className={`cc-slot ${i === active ? "center" : "side"}`} onClick={() => setActive(i)}>
                                    <Card p={p} />
                                </div>
                            ))}
                        </div>
                        <Dots />
                    </div>

                    {/* Mobile — touch-enabled */}
                    <div className="d-md-none cc-mob"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <div className="cc-mob-track" style={{ transform: `translateX(${mobX})` }}>
                            {PLANS.map((p, i) => (
                                <div key={p.id}
                                    className={`cc-mob-slide ${i === active ? "mc" : "ms"}`}
                                    style={{ width: `${CARD_VW}vw`, marginLeft: i === 0 ? 0 : `${GAP_VW}vw` }}
                                    onClick={() => { if (!isSwiping.current) setActive(i); }}
                                >
                                    <Card p={p} mobRole={i === active ? "c" : "s"} />
                                </div>
                            ))}
                        </div>
                        <Dots />
                        <div className="cc-nav">
                            <button className="cc-nav-btn p" disabled={active === 0} onClick={() => setActive(p => p - 1)}>← Prev</button>
                            <button className="cc-nav-btn n" disabled={active === PLANS.length - 1} onClick={() => setActive(p => p + 1)}>Next →</button>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        </>
    );
}