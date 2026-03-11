import { useRef, useState } from "react";

const HP_C = {
  bg: "#F1E9FE", card: "#FFFAFB", border: "#E9DCFF",
  dark: "#4000BC", mid: "#9D4DFF", light: "#C69FF4",
  textDark: "#330C5F", textMid: "#40008C", textLight: "#9D4DFF",
};

const HP_PLANS = [
  {
    id: 2, tier: "01", title: "Standard", tag: "Includes cake, lights & decor.", badge: "Save ₹200",
    g: ["#7B2FE0", "#C69FF4"], buttonText: "Proceed →",
    f: {
      "Theatre + Decoration": 1, "Fog Entry (1 Pot)": 1, "Candle Path": 1,
      "HBD LED": 1, "Name with LED (6)": 1, "AGE Number LED": 1,
      "HBD with Rose Petals": 1, "Photo Clipping (10)": 1, "Birthday Sash": 1,
      "Birthday Crown, Spects": 1, "Rose": 1, "Regular Cake – ½ kg": 1,
      "Photography (15 Mins)": 1, "Cold Fire Entry (6 pcs)": 0,
      "Videography (1-Min Reel)": 0, "Hall Fog (4 Pots)": 0,
    },
  },
  {
    id: 3, tier: "02", title: "Special", tag: "Our grandest experience, full royal vibes.", badge: "★ Most Popular", star: 1,
    g: [HP_C.mid, HP_C.light], buttonText: "Proceed →",
    f: {
      "Theatre + Decoration": 1, "Fog Entry (1 Pot)": 1, "Candle Path": 1,
      "HBD LED": 1, "Name with LED (6)": 1, "AGE Number LED": 1,
      "HBD with Rose Petals": 1, "Photo Clipping (10)": 1, "Birthday Sash": 1,
      "Birthday Crown, Spects": 1, "Rose Bouquet (6 Roses)": 1,
      "Customisation Cake (1 kg)": 1, "Photography (30 Mins)": 1,
      "Cold Fire Entry (4 pcs)": 1, "Videography (1-Min Reel)": 0, "Hall Fog (4 Pots)": 0,
    },
  },
  {
    id: 4, tier: "03", title: "Premium", tag: "More guests, more upgrades, more glam.", badge: "Save ₹300",
    g: ["#5B21B6", HP_C.light], buttonText: "Proceed →",
    f: {
      "Theatre + Decoration": 1, "Fog Entry (1 Pot)": 1, "Candle Path": 1,
      "HBD LED": 1, "Name with LED (6)": 1, "AGE Number LED": 1,
      "HBD with Rose Petals": 1, "Photo Clipping (10)": 1, "Birthday Sash": 1,
      "Birthday Crown, Spects": 1, "Rose Bouquet (12 Roses)": 1,
      "Customisation Cake (1 kg)": 1, "Photography (30 Mins)": 1,
      "Cold Fire Entry (6 pcs)": 1, "Videography (1-Min Reel)": 1, "Hall Fog (4 Pots)": 1,
    },
  },
];

const HP_PREVIEW = 7;
const HP_CARD_VW = 68, HP_GAP_VW = 4;

const BODY_FONT = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
const HEAD_FONT = "Georgia, 'Times New Roman', Times, serif";

const hpCss = `
.hp-cc, .hp-cc * { box-sizing:border-box; margin:0; padding:0; }
.hp-cc {
  font-family: ${BODY_FONT};
  background:${HP_C.bg};
  position:relative; overflow:hidden;
}
.hp-cc::before,.hp-cc::after {
  content:''; position:absolute; border-radius:50%;
  pointer-events:none; filter:blur(90px); opacity:.28;
}
.hp-cc::before { width:540px;height:540px; background:radial-gradient(circle,${HP_C.light},transparent 70%); top:-160px;right:-120px; }
.hp-cc::after  { width:360px;height:360px; background:radial-gradient(circle,${HP_C.border},transparent 70%); bottom:-80px;left:-80px; }

/* heading */
.hp-head { text-align:center; margin-bottom:0; position:relative; z-index:2; animation:hp-fadeUp .65s ease both; }
@keyframes hp-fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
.hp-eyebrow {
  display:inline-flex; align-items:center; gap:7px;
  font-size:10px; font-weight:600; letter-spacing:3px; text-transform:uppercase;
  color:${HP_C.textLight}; background:${HP_C.card}; border:1px solid ${HP_C.border};
  padding:5px 16px; border-radius:999px; margin-bottom:16px;
  box-shadow:0 2px 12px rgba(157,77,255,.1);
  font-family: ${BODY_FONT};
}
.hp-eyebrow::before,.hp-eyebrow::after{content:'✦';font-size:8px;opacity:.55}
.hp-title {
  font-family: ${HEAD_FONT};
  font-size:clamp(34px,5vw,54px); font-weight:700;
  color:${HP_C.textDark}; line-height:1.1; margin-bottom:8px; letter-spacing:-.2px;
}
.hp-title em {
  font-style:italic;
  background:linear-gradient(135deg,${HP_C.textMid},${HP_C.mid});
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}
.hp-sub { color:${HP_C.light}; font-size:13.5px; font-family: ${BODY_FONT}; }
.hp-rule { display:flex; align-items:center; justify-content:center; gap:10px; margin-top:16px; }
.hp-rl  { width:44px;height:1px; background:linear-gradient(to right,transparent,${HP_C.light}); }
.hp-rl.r{ background:linear-gradient(to left,transparent,${HP_C.light}); }
.hp-rd  { width:6px;height:6px; background:${HP_C.mid}; transform:rotate(45deg); border-radius:1px; }

/* desktop track */
.hp-track {
  display:flex; align-items:center; justify-content:center;
  padding:28px 0 36px; position:relative; z-index:2;
}
.hp-slot {
  flex-shrink:0; cursor:pointer;
  transition:transform .5s cubic-bezier(.34,1.5,.64,1),opacity .5s ease,filter .5s ease,margin .5s cubic-bezier(.34,1.5,.64,1);
  animation:hp-fadeUp .6s ease both;
}
.hp-slot:nth-child(1){animation-delay:.1s}
.hp-slot:nth-child(2){animation-delay:.2s}
.hp-slot:nth-child(3){animation-delay:.3s}
.hp-slot.center { width:340px; transform:scale(1) translateY(0); z-index:10; }
.hp-slot.side   { width:272px; transform:scale(0.82) translateY(28px); opacity:.55; filter:saturate(.65); z-index:5; margin:0 -28px; }
.hp-slot.side:hover { opacity:.78; transform:scale(0.86) translateY(20px); filter:saturate(.85); }

/* card */
.hp-card {
  background:${HP_C.card}; border-radius:22px; overflow:hidden;
  border:1.5px solid transparent; display:flex; flex-direction:column; position:relative;
  transition:border-color .35s,box-shadow .35s;
}
.hp-slot.center .hp-card {
  border-color:${HP_C.border};
  box-shadow:0 0 0 4px rgba(157,77,255,.07),0 22px 56px rgba(64,0,188,.12),0 6px 16px rgba(157,77,255,.09);
}
.hp-slot.side .hp-card { box-shadow:0 4px 18px rgba(64,0,188,.06); }

.hp-stripe { height:4px; background:var(--g); }
.hp-tier {
  position:absolute; top:14px; right:16px;
  font-family: ${HEAD_FONT};
  font-size:48px; font-weight:700;
  line-height:1; color:rgba(198,159,244,.18); pointer-events:none; user-select:none; transition:color .35s;
}
.hp-slot.center .hp-tier { color:rgba(157,77,255,.1); }
.hp-body { padding:26px 22px 24px; flex:1; display:flex; flex-direction:column; }

.hp-badge {
  display:inline-flex; align-items:center; gap:4px;
  font-size:9.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
  padding:3px 10px; border-radius:999px; margin-bottom:10px; width:fit-content;
  background:${HP_C.bg}; border:1px solid ${HP_C.border}; color:${HP_C.textLight};
  transition:background .35s,color .35s,box-shadow .35s;
  font-family: ${BODY_FONT};
}
.hp-slot.center .hp-badge { background:var(--g); border:none; color:#fff; box-shadow:0 3px 12px rgba(157,77,255,.28); }

.hp-name {
  font-family: ${HEAD_FONT};
  font-size:24px; font-weight:700; color:${HP_C.textDark}; margin-bottom:2px; letter-spacing:-.1px;
}
.hp-tag  { font-size:12px; color:${HP_C.light}; margin-bottom:13px; font-family: ${BODY_FONT}; }
.hp-div  { height:1px; background:linear-gradient(to right,${HP_C.border},transparent); margin-bottom:11px; }

.hp-feats { list-style:none; flex:1; }
.hp-feat  {
  display:flex; align-items:center; gap:8px;
  padding:7px 0; border-bottom:1px solid rgba(198,159,244,.1); font-size:12.5px;
  font-family: ${BODY_FONT};
}
.hp-feat.y { color:${HP_C.textDark}; }
.hp-feat.n { color:${HP_C.light}; opacity:.58; }
.hp-feat.n span:last-child { text-decoration:line-through; }
.hp-dot {
  width:18px;height:18px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;
}
.hp-dot.y{background:#F0FDF4;color:#15803D} .hp-dot.n{background:#FDF4FF;color:${HP_C.light}}

.hp-more {
  background:none;border:none;color:${HP_C.textLight};font-size:11.5px;font-weight:600;
  cursor:pointer;padding:7px 0 2px;
  font-family: ${BODY_FONT};
  transition:color .2s;
}
.hp-more:hover{color:${HP_C.textMid}}

.hp-btn {
  width:100%;border:none;border-radius:12px;padding:11.5px 16px;
  font-family: ${BODY_FONT};
  font-weight:600;font-size:13.5px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:6px;margin-top:15px;
  transition:transform .18s,box-shadow .18s,background .35s;
}
.hp-slot.center .hp-btn,.hp-btn.active {
  background:var(--g);color:#fff;box-shadow:0 5px 20px rgba(157,77,255,.36);
}
.hp-slot.center .hp-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(157,77,255,.46)}
.hp-slot.side .hp-btn,.hp-btn.passive {
  background:${HP_C.bg};color:${HP_C.textMid};border:1.5px solid ${HP_C.border};
}
.hp-slot.side .hp-btn:hover,.hp-btn.passive:hover{background:${HP_C.border}}

/* dots */
.hp-dots { display:flex;justify-content:center;gap:7px;margin-top:6px;position:relative;z-index:2; }
.hp-pip  { border:none;padding:0;cursor:pointer;height:7px;border-radius:999px;background:${HP_C.border};transition:all .32s ease; }
.hp-pip.on{ background:linear-gradient(90deg,${HP_C.textMid},${HP_C.mid}); }

/* mobile */
.hp-mob { overflow:hidden;padding:16px 0 20px;position:relative;z-index:2; }
.hp-mob-track {
  display:flex;align-items:flex-start;
  transition:transform .46s cubic-bezier(.34,1.26,.64,1);
  will-change:transform;
}
.hp-mob-slide {
  flex-shrink:0;cursor:pointer;
  transition:transform .44s ease,opacity .44s ease,filter .44s ease;
}
.hp-mob-slide.mc{transform:scale(1);opacity:1;filter:none}
.hp-mob-slide.ms{transform:scale(0.87) translateY(14px);opacity:.5;filter:saturate(.65)}

.hp-nav { display:flex;justify-content:center;gap:10px;margin-top:14px; }
.hp-nav-btn {
  border-radius:12px;padding:8px 22px;font-weight:600;font-size:13px;
  cursor:pointer;
  font-family: ${BODY_FONT};
  transition:all .2s;border:none;
}
.hp-nav-btn.p { background:${HP_C.card};border:1.5px solid ${HP_C.border};color:${HP_C.textMid};box-shadow:0 2px 8px rgba(157,77,255,.08); }
.hp-nav-btn.p:hover:not(:disabled){background:${HP_C.bg}}
.hp-nav-btn.n { background:linear-gradient(135deg,${HP_C.textMid},${HP_C.mid});color:#fff;box-shadow:0 4px 14px rgba(157,77,255,.32); }
.hp-nav-btn.n:hover:not(:disabled){box-shadow:0 6px 20px rgba(157,77,255,.44)}
.hp-nav-btn:disabled{opacity:.25;cursor:not-allowed}

@media(max-width:767px){.hp-cc{padding:48px 0 60px}.hp-head{margin-bottom:36px}}
`;

function HpCard({ p, mobRole, onBook }) {
  const [exp, setExp] = useState(false);
  const feats = Object.entries(p.f);
  const shown = exp ? feats : feats.slice(0, HP_PREVIEW);
  const grad = `linear-gradient(135deg,${p.g[0]},${p.g[1]})`;
  const isM = mobRole != null;

  return (
    <div className="hp-card" style={{ "--g": grad }}>
      <div className="hp-stripe" />
      <div className="hp-tier">{p.tier}</div>
      <div className="hp-body">
        <span className="hp-badge">{p.badge}</span>
        <h5 className="hp-name">{p.title}</h5>
        <p className="hp-tag">{p.tag}</p>
        <div className="hp-div" />
        <ul className="hp-feats">
          {shown.map(([k, v], i) => (
            <li key={i} className={`hp-feat ${v ? "y" : "n"}`}>
              <span className={`hp-dot ${v ? "y" : "n"}`}>{v ? "✓" : "·"}</span>
              <span>{k}</span>
            </li>
          ))}
        </ul>
        {feats.length > HP_PREVIEW && (
          <button className="hp-more" onClick={e => { e.stopPropagation(); setExp(x => !x); }}>
            {exp ? "▲ Show less" : `▼ All ${feats.length} inclusions`}
          </button>
        )}
        <button
          className={`hp-btn${isM ? (mobRole === "c" ? " active" : " passive") : ""}`}
          style={{ "--g": grad }}
          onClick={e => { e.stopPropagation(); onBook(); }}
        >
          {p.buttonText}
        </button>
      </div>
    </div>
  );
}

function HomePackagesSection({ navigateTheater }) {
  const [active, setActive] = useState(1);
  const mobX = `calc(${50 - HP_CARD_VW / 2}vw - ${active * (HP_CARD_VW + HP_GAP_VW)}vw)`;

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isSwiping = useRef(false);

  const onTouchStart = e => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };
  const onTouchMove = e => {
    if (!touchStartX.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy && dx > 8) { isSwiping.current = true; e.preventDefault(); }
  };
  const onTouchEnd = e => {
    if (!touchStartX.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (isSwiping.current && Math.abs(dx) > 40)
      setActive(p => dx < 0 ? Math.min(HP_PLANS.length - 1, p + 1) : Math.max(0, p - 1));
    touchStartX.current = null;
    isSwiping.current = false;
  };

  const Dots = () => (
    <div className="hp-dots">
      {HP_PLANS.map((_, i) => (
        <button key={i} className={`hp-pip${i === active ? " on" : ""}`}
          style={{ width: i === active ? "26px" : "7px" }} onClick={() => setActive(i)} />
      ))}
    </div>
  );

  return (
    <section className="hp-cc py-5">
      <style>{hpCss}</style>

      {/* Heading */}
      <div className="hp-head">
        <div className="hp-eyebrow">Celebration Packages</div>
        <h2 className="hp-title">Choose Your <em>Celebration</em></h2>
        <p className="hp-sub">Pick the plan that matches your moment</p>
        <div className="hp-rule">
          <div className="hp-rl" /><div className="hp-rd" /><div className="hp-rl r" />
        </div>
      </div>

      {/* Desktop */}
      <div className="d-none d-md-block">
        <div className="hp-track">
          {HP_PLANS.map((p, i) => (
            <div key={p.id} className={`hp-slot ${i === active ? "center" : "side"}`} onClick={() => setActive(i)}>
              <HpCard p={p} onBook={() => navigateTheater("/locations")} />
            </div>
          ))}
        </div>
        <Dots />
      </div>

      {/* Mobile */}
      <div className="d-md-none hp-mob"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="hp-mob-track" style={{ transform: `translateX(${mobX})` }}>
          {HP_PLANS.map((p, i) => (
            <div key={p.id}
              className={`hp-mob-slide ${i === active ? "mc" : "ms"}`}
              style={{ width: `${HP_CARD_VW}vw`, marginLeft: i === 0 ? 0 : `${HP_GAP_VW}vw` }}
              onClick={() => { if (!isSwiping.current) setActive(i); }}
            >
              <HpCard p={p} mobRole={i === active ? "c" : "s"} onBook={() => navigateTheater("/locations")} />
            </div>
          ))}
        </div>
        <Dots />
        <div className="hp-nav">
          <button className="hp-nav-btn p" disabled={active === 0} onClick={() => setActive(p => p - 1)}>← Prev</button>
          <button className="hp-nav-btn n" disabled={active === HP_PLANS.length - 1} onClick={() => setActive(p => p + 1)}>Next →</button>
        </div>
      </div>

      {/* WhatsApp Chat Button */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <a
          href="https://wa.me/918374777834?text=Hello%2C%20I%20want%20to%20book%20tickets."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 28px",
            borderRadius: "50px",
            fontWeight: "600",
            fontSize: "14px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            background: "#25D366",
            color: "#fff",
            textDecoration: "none",
            boxShadow: "0 6px 18px rgba(37,211,102,0.35)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 10px 24px rgba(37,211,102,0.45)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(37,211,102,0.35)";
          }}
        >
          <i className="bi bi-whatsapp"></i>
          Chat With Us
        </a>
      </div>
    </section>
  );
}

export default HomePackagesSection;