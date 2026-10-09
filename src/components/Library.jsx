import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/*
  Your photos live in /public/images, so React serves them from "/images/...".
  Change the title and date of each memory here, and add new ones as you like.
*/
const MEMORIES = [
  { src: "/images/IMAGE1.jpg", title: "HAHAHAHAHA THIS IS TOP 1 PICTURE I LOVED", date: "08.19.2026" },
  { src: "/images/IMAGE2.jpg", title: "THIS ONE TOO, YOU'RE SO BEAUTIFUL HERE ACKKK", date: "08.19.2026" },
  { src: "/images/IMAGE3.jpg", title: "ALSO THIS ONE IS ONE OF MY FAVORITE", date: "08.18.2026" },
  { src: "/images/IMAGE4.jpg", title: "CUTESY", date: "08.17.2026" },
  { src: "/images/IMAGE5.png", title: "IS THIS GOODLUCK FORGETTING MY EYES? HAHAHAHAHA", date: "08.13.2026" },
  { src: "/images/IMAGE6.jpg", title: "HAHAHAHAHAHA", date: "08.16.2026" },
  { src: "/images/IMAGE7.png", title: "EVIL DEAD BURN AYE?", date: "08.13.2026" },
];

/* ---------- Funny lines (edit freely!) ---------- */

// Rotates slowly under the hero subtitle
const HERO_LINES = [
  "Warning: may cause uncontrollable smiling",
  "Evidence that you are, unfortunately, adorable",
  "Handle with care. Heart not included",
  "Viewer discretion is advised. Mostly for my heart",
];

// One verdict per photo in the big view (repeats if you add more photos)
const VERDICTS = [
  "Verdict: dangerously cute",
  "Verdict: heart rate not normal",
  "Verdict: case closed, I am smitten",
  "Verdict: no notes",
  "Verdict: still thinking about this one",
  "Verdict: honestly, unfair",
  "Verdict: approved by the committee (me)",
];

// Slight tilt for each photo, like pictures pinned in a scrapbook
const TILTS = [-2.2, 1.6, -1.2, 2.0, -1.8, 1.2, -0.8];

/* ---------- Colors and fonts (change them here and everything follows) ---------- */

// Same palette as the login, landing and envelope pages
const COLORS = {
  lightBlue: "#abcbe8",
  navy: "#233868",
  cream: "#f8f0e3",
  pink: "#dd959b",
  maroon: "#4f1711",
  // Slightly see-through navy for normal text
  navyText: "rgba(35, 56, 104, 0.82)",
  navySoft: "rgba(35, 56, 104, 0.6)",
  pinkLine: "rgba(221, 149, 155, 0.6)",
};

const FONTS = {
  title: '"Cormorant Garamond", serif',
  body: '"Jost", system-ui, sans-serif',
  script: '"Great Vibes", "Snell Roundhand", cursive',
};

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Jost:wght@300;400;500&display=swap";

/* ---------- Helpers ---------- */

// Tells us if we're on a phone, tablet or desktop so the layout can adapt
function getScreenSize() {
  const width = window.innerWidth;
  if (width <= 600) return "phone";
  if (width <= 900) return "tablet";
  return "desktop";
}

function useScreenSize() {
  const [screen, setScreen] = useState(getScreenSize);

  useEffect(() => {
    const handleResize = () => setScreen(getScreenSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screen;
}

// Loads the Google fonts once
function useFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_LINK}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_LINK;
    document.head.appendChild(link);
  }, []);
}

// Cycles through a list of lines every few seconds
function useRotating(lines, ms, enabled) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % lines.length), ms);
    return () => clearInterval(id);
  }, [lines.length, ms, enabled]);

  return lines[index];
}

// Exhibit A, B, C... (falls back to numbers after Z)
function exhibitLabel(index) {
  return index < 26 ? String.fromCharCode(65 + index) : String(index + 1);
}

/* =========================================================
   Soft pink and blue hearts drifting up behind everything
   ========================================================= */

function FloatingHearts({ screen }) {
  const count = screen === "phone" ? 7 : 13;
  const hearts = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i * 41 + 6) % 92,
    size: 13 + ((i * 7) % 15),
    duration: 16 + ((i * 3) % 10),
    delay: (i * 1.2) % 9,
    sway: 12 + ((i * 5) % 18),
    color: i % 2 ? COLORS.lightBlue : COLORS.pink,
  }));

  const layer = {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    overflow: "hidden",
    pointerEvents: "none",
  };

  return (
    <div style={layer} aria-hidden="true">
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          style={{
            position: "absolute",
            left: `${h.left}%`,
            bottom: -40,
            fontSize: h.size,
            lineHeight: 1,
            color: h.color,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: "-115vh",
            x: [0, h.sway, -h.sway, 0],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "linear" }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}

/* =========================================================
   Top bar
   ========================================================= */

function TopBar({ screen, onBack, reduce }) {
  const [hovered, setHovered] = useState(false);

  const bar = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: screen === "phone" ? "20px 0" : "28px 0",
  };

  const logo = {
    fontFamily: FONTS.title,
    fontSize: "1.35rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: COLORS.navy,
  };

  const backButton = {
    font: "inherit",
    fontSize: "0.9rem",
    padding: "9px 22px",
    borderRadius: 999,
    cursor: "pointer",
    color: hovered ? COLORS.cream : COLORS.maroon,
    background: hovered ? COLORS.maroon : "rgba(248, 240, 227, 0.6)",
    border: `1px solid ${hovered ? COLORS.maroon : COLORS.pinkLine}`,
    transition: "background 0.2s, color 0.2s, border-color 0.2s",
    WebkitTapHighlightColor: "transparent",
  };

  return (
    <nav style={bar}>
      <span style={logo}>YOUR LIBRARY</span>
      {onBack && (
        <motion.button
          style={backButton}
          onClick={onBack}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileTap={reduce ? undefined : { scale: 0.94 }}
        >
          Back
        </motion.button>
      )}
    </nav>
  );
}

/* =========================================================
   Hero (title area)
   ========================================================= */

const HERO_TITLE = "My Favorite Different Faces of Yours";

function Hero({ screen, reduce }) {
  const isPhone = screen === "phone";
  const t = (seconds) => (reduce ? 0 : seconds);
  const funnyLine = useRotating(HERO_LINES, 3800, !reduce);

  const hero = {
    textAlign: "center",
    padding: isPhone ? "32px 0 40px" : "56px 0 64px",
  };

  const title = {
    margin: "0 0 20px",
    fontFamily: FONTS.title,
    fontSize: "clamp(2.6rem, 7vw, 5.2rem)",
    fontStyle: "italic",
    fontWeight: 500,
    lineHeight: 1.05,
    color: COLORS.navy,
  };

  const subtitle = {
    maxWidth: 460,
    margin: "0 auto",
    fontSize: isPhone ? "1rem" : "1.05rem",
    fontWeight: 400,
    lineHeight: 1.7,
    color: COLORS.navyText,
  };

  // The funny line, written in script so it feels hand-scribbled
  const scribble = {
    minHeight: isPhone ? "3.4rem" : "2.6rem",
    margin: "14px auto 0",
    maxWidth: 520,
    fontFamily: FONTS.script,
    fontSize: isPhone ? "1.55rem" : "1.9rem",
    lineHeight: 1.25,
    color: COLORS.pink,
  };

  // The thin line with a still heart in the middle (no blinking)
  const divider = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginTop: 28,
    color: COLORS.pink,
  };

  const lineWidth = isPhone ? 48 : 72;
  const lineLeft = { width: lineWidth, height: 1, background: `linear-gradient(90deg, rgba(221,149,155,0), ${COLORS.pink})` };
  const lineRight = { width: lineWidth, height: 1, background: `linear-gradient(90deg, ${COLORS.pink}, rgba(221,149,155,0))` };

  const words = HERO_TITLE.split(" ");

  return (
    <header style={hero}>
      <h1 style={title}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: t(0.9), delay: t(0.15 + i * 0.12), ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </h1>

      <motion.p
        style={subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: t(0.9), delay: t(1.1) }}
      >
        Each picture captures a moment in time.
      </motion.p>

      <motion.div
        style={scribble}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: t(0.9), delay: t(1.6) }}
        aria-live="off"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={funnyLine}
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: t(0.4) }}
          >
            {funnyLine}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      <motion.div
        style={divider}
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: t(0.9), delay: t(1.9), ease: "easeOut" }}
        aria-hidden="true"
      >
        <span style={lineLeft} />
        <span style={{ fontSize: "1rem", lineHeight: 1 }}>♥</span>
        <span style={lineRight} />
      </motion.div>
    </header>
  );
}

/* =========================================================
   Photo card (one photo in the gallery)
   ========================================================= */

function PhotoCard({ memory, index, screen, onOpen, reduce }) {
  const [hovered, setHovered] = useState(false);
  const isPhone = screen === "phone";
  const tilt = TILTS[index % TILTS.length] * (isPhone ? 0.6 : 1);

  const card = {
    position: "relative",
    display: "block",
    width: "100%",
    margin: `0 0 ${isPhone ? 22 : screen === "tablet" ? 24 : 32}px`,
    padding: isPhone ? "8px 8px 0" : "12px 12px 0",
    font: "inherit",
    color: "inherit",
    textAlign: "left",
    // Cream polaroid with a thin pink edge
    background: "#fffdf8",
    border: `1px solid ${COLORS.pinkLine}`,
    borderRadius: 6,
    cursor: "pointer",
    breakInside: "avoid",
    boxShadow: hovered
      ? "0 2px 4px rgba(35, 56, 104, 0.08), 0 24px 44px -14px rgba(35, 56, 104, 0.38)"
      : "0 1px 2px rgba(35, 56, 104, 0.08), 0 14px 34px -12px rgba(35, 56, 104, 0.28)",
    transition: "box-shadow 0.35s ease",
    WebkitTapHighlightColor: "transparent",
  };

  // A little strip of light blue tape holding the photo up
  const tape = {
    position: "absolute",
    top: -11,
    left: "50%",
    width: 76,
    height: 24,
    marginLeft: -38,
    transform: `rotate(${tilt > 0 ? -4 : 4}deg)`,
    background: "rgba(171, 203, 232, 0.75)",
    border: "1px solid rgba(35, 56, 104, 0.15)",
    zIndex: 2,
    pointerEvents: "none",
  };

  // Maroon "Exhibit" label, like a wax tag
  const tag = {
    position: "absolute",
    top: isPhone ? 18 : 24,
    left: isPhone ? 2 : 4,
    padding: "4px 12px",
    fontFamily: FONTS.body,
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    color: COLORS.cream,
    background: COLORS.maroon,
    borderRadius: 2,
    transform: "rotate(-5deg)",
    boxShadow: "0 4px 10px rgba(79, 23, 17, 0.35)",
    zIndex: 2,
    pointerEvents: "none",
  };

  const frame = {
    overflow: "hidden",
    background: COLORS.lightBlue,
  };

  const image = {
    display: "block",
    width: "100%",
    height: "auto",
    transform: hovered ? "scale(1.04)" : "none",
    transition: "transform 0.8s ease",
  };

  const caption = { padding: "16px 6px 18px" };

  const title = {
    margin: 0,
    fontFamily: FONTS.title,
    fontSize: "1.4rem",
    fontStyle: "italic",
    fontWeight: 500,
    color: COLORS.navy,
  };

  const date = {
    display: "block",
    marginTop: 2,
    fontSize: "0.8rem",
    color: COLORS.pink,
  };

  return (
    <motion.button
      style={card}
      onClick={onOpen}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      aria-label={`Open ${memory.title}`}
      initial={reduce ? false : { opacity: 0, y: 46, rotate: tilt * 2.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ type: "spring", stiffness: 90, damping: 16, delay: reduce ? 0 : (index % 3) * 0.08 }}
      whileHover={reduce ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
    >
      <span style={tape} aria-hidden="true" />
      <span style={tag} aria-hidden="true">
        Exhibit {exhibitLabel(index)}
      </span>
      <div style={frame}>
        <img style={image} src={memory.src} alt={memory.title} loading="lazy" />
      </div>
      <div style={caption}>
        <h3 style={title}>{memory.title}</h3>
        {memory.date && <span style={date}>Filed on {memory.date}</span>}
      </div>
    </motion.button>
  );
}

/* =========================================================
   Lightbox (the big photo view)
   ========================================================= */

function LightboxButton({ label, children, style, onClick, reduce }) {
  const [hovered, setHovered] = useState(false);

  const button = {
    position: "absolute",
    display: "grid",
    placeItems: "center",
    height: 44,
    padding: "0 20px",
    font: "inherit",
    fontSize: "0.9rem",
    color: COLORS.cream,
    background: hovered ? "rgba(221, 149, 155, 0.35)" : "rgba(248, 240, 227, 0.1)",
    border: "1px solid rgba(248, 240, 227, 0.3)",
    borderRadius: 999,
    cursor: "pointer",
    transition: "background 0.2s",
    WebkitTapHighlightColor: "transparent",
    zIndex: 3,
    ...style,
  };

  return (
    <motion.button
      style={button}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={reduce ? undefined : { scale: 0.92 }}
      aria-label={label}
    >
      {children}
    </motion.button>
  );
}

// How the photo slides in and out when you go to the next or previous one
const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 70, scale: 0.95 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir) => ({ opacity: 0, x: dir * -70, scale: 0.95 }),
};

function Lightbox({ memory, index, total, direction, screen, showHint, reduce, onClose, onPrev, onNext }) {
  const isPhone = screen === "phone";
  const [hint, setHint] = useState(showHint);

  // The little "how to move" hint goes away by itself
  useEffect(() => {
    if (!showHint) return;
    const id = setTimeout(() => setHint(false), 4200);
    return () => clearTimeout(id);
  }, [showHint]);

  // Keeps a click on a button from also closing the lightbox
  const stop = (handler) => (event) => {
    event.stopPropagation();
    handler();
  };

  // Deep navy backdrop so the photo stands out
  const backdrop = {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: isPhone ? "64px 16px 96px" : 24,
    boxSizing: "border-box",
    background: "rgba(16, 26, 54, 0.94)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    overflow: "hidden",
  };

  const figure = {
    maxWidth: "min(92vw, 1000px)",
    margin: 0,
    textAlign: "center",
    touchAction: "pan-y",
    cursor: "grab",
  };

  const image = {
    maxWidth: "100%",
    maxHeight: isPhone ? "56vh" : "70vh",
    borderRadius: 4,
    border: "6px solid #fffdf8",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
    userSelect: "none",
    WebkitUserDrag: "none",
  };

  const caption = {
    marginTop: 18,
    fontFamily: FONTS.title,
    fontSize: isPhone ? "1.25rem" : "1.5rem",
    fontStyle: "italic",
    color: COLORS.cream,
  };

  const date = {
    display: "block",
    marginTop: 4,
    fontFamily: FONTS.body,
    fontSize: "0.8rem",
    fontStyle: "normal",
    color: COLORS.lightBlue,
  };

  const verdict = {
    marginTop: 10,
    fontFamily: FONTS.script,
    fontSize: isPhone ? "1.55rem" : "1.9rem",
    lineHeight: 1.2,
    color: COLORS.pink,
  };

  const counter = {
    position: "absolute",
    bottom: isPhone ? 34 : 22,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: "0.8rem",
    letterSpacing: "0.1em",
    color: COLORS.lightBlue,
    pointerEvents: "none",
  };

  const hintStyle = {
    position: "absolute",
    bottom: isPhone ? 76 : 52,
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: FONTS.script,
    fontSize: "1.35rem",
    color: COLORS.pink,
    pointerEvents: "none",
  };

  // On phones the buttons sit at the bottom, easy to reach with a thumb
  const closePosition = isPhone ? { top: 14, right: 14 } : { top: 20, right: 20 };
  const prevPosition = isPhone
    ? { bottom: 18, left: 16 }
    : { top: "50%", left: 20, marginTop: -22 };
  const nextPosition = isPhone
    ? { bottom: 18, right: 16 }
    : { top: "50%", right: 20, marginTop: -22 };

  const handleDragEnd = (_event, info) => {
    if (info.offset.x < -70 || info.velocity.x < -450) onNext();
    else if (info.offset.x > 70 || info.velocity.x > 450) onPrev();
  };

  return (
    <motion.div
      style={backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={memory.title}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
    >
      <LightboxButton label="Close" style={closePosition} onClick={stop(onClose)} reduce={reduce}>
        Close
      </LightboxButton>
      <LightboxButton label="Previous photo" style={prevPosition} onClick={stop(onPrev)} reduce={reduce}>
        Prev
      </LightboxButton>
      <LightboxButton label="Next photo" style={nextPosition} onClick={stop(onNext)} reduce={reduce}>
        Next
      </LightboxButton>

      <AnimatePresence mode="wait" custom={direction} initial>
        <motion.figure
          key={index}
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduce ? 0 : 0.32, ease: "easeOut" }}
          style={figure}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.45}
          onDragEnd={handleDragEnd}
          onClick={(event) => event.stopPropagation()}
        >
          <img style={image} src={memory.src} alt={memory.title} draggable={false} />
          <figcaption style={caption}>
            {memory.title}
            {memory.date && <small style={date}>Filed on {memory.date}</small>}
            <div style={verdict}>{VERDICTS[index % VERDICTS.length]}</div>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      <AnimatePresence>
        {hint && (
          <motion.div
            style={hintStyle}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.5 }}
          >
            {isPhone ? "Swipe for more evidence" : "Arrow keys work too, detective"}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={counter}>
        Exhibit {index + 1} of {total}
      </div>
    </motion.div>
  );
}

/* =========================================================
   Button that goes to the confession letter
   ========================================================= */

function ConfessionButton({ onClick, reduce }) {
  const [hovered, setHovered] = useState(false);

  const button = {
    font: "inherit",
    fontSize: "1rem",
    padding: "13px 32px",
    borderRadius: 999,
    cursor: "pointer",
    color: COLORS.cream,
    background: hovered ? COLORS.navy : COLORS.maroon,
    border: "none",
    boxShadow: "0 14px 30px -10px rgba(79, 23, 17, 0.5)",
    transition: "background 0.25s",
    WebkitTapHighlightColor: "transparent",
  };

  return (
    <motion.button
      style={button}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={reduce ? undefined : { y: -3 }}
      whileTap={reduce ? undefined : { scale: 0.95 }}
    >
      I have one Last thing to say
    </motion.button>
  );
}

/* =========================================================
   The page
   ========================================================= */

export default function Library({ onBack, onConfession }) {
  const screen = useScreenSize();
  const reduce = useReducedMotion();
  useFonts();

  // Which photo is open (null means none), and which way we last moved
  const [openIndex, setOpenIndex] = useState(null);
  const [direction, setDirection] = useState(1);
  const [hintSeen, setHintSeen] = useState(false);

  const closePhoto = useCallback(() => {
    setOpenIndex(null);
    setHintSeen(true);
  }, []);
  const showNext = useCallback(() => {
    setDirection(1);
    setOpenIndex((i) => (i + 1) % MEMORIES.length);
  }, []);
  const showPrev = useCallback(() => {
    setDirection(-1);
    setOpenIndex((i) => (i - 1 + MEMORIES.length) % MEMORIES.length);
  }, []);

  // While a photo is open: keyboard shortcuts + stop the page behind from scrolling
  useEffect(() => {
    if (openIndex === null) return;

    const handleKey = (event) => {
      if (event.key === "Escape") closePhoto();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrev();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [openIndex, closePhoto, showNext, showPrev]);

  const isPhone = screen === "phone";

  // Same soft pastel wash as the login, landing and envelope pages
  const page = {
    position: "relative",
    minHeight: "100vh",
    color: COLORS.navy,
    fontFamily: FONTS.body,
    boxSizing: "border-box",
    overflowX: "hidden",
    backgroundColor: "#f7e9ea",
    backgroundImage: [
      "radial-gradient(ellipse 70% 40% at 20% 0%, rgba(221,149,155,0.5) 0%, rgba(221,149,155,0) 70%)",
      "radial-gradient(ellipse 60% 45% at 100% 100%, rgba(171,203,232,0.7) 0%, rgba(171,203,232,0) 70%)",
      "radial-gradient(ellipse 50% 40% at 0% 100%, rgba(171,203,232,0.4) 0%, rgba(171,203,232,0) 70%)",
      "linear-gradient(180deg, #f8f0e3 0%, #f3e2e6 100%)",
    ].join(", "),
    backgroundAttachment: "fixed",
  };

  const content = {
    position: "relative",
    zIndex: 1,
    maxWidth: 1180,
    margin: "0 auto",
    padding: isPhone ? "0 18px 72px" : "0 28px 96px",
    boxSizing: "border-box",
  };

  // Masonry: 3 columns on desktop, 2 on tablet, 1 on phone
  const gallery = {
    columnCount: screen === "desktop" ? 3 : screen === "tablet" ? 2 : 1,
    columnGap: screen === "desktop" ? 28 : 20,
    paddingTop: 14,
  };

  const footer = {
    marginTop: isPhone ? 36 : 56,
    textAlign: "center",
  };

  const footerNote = {
    margin: 0,
    fontFamily: FONTS.title,
    fontSize: isPhone ? "1.15rem" : "1.3rem",
    fontStyle: "italic",
    color: COLORS.navyText,
  };

  const footerJoke = {
    margin: "10px 0 0",
    fontFamily: FONTS.script,
    fontSize: isPhone ? "1.6rem" : "2rem",
    lineHeight: 1.25,
    color: COLORS.pink,
  };

  // Space above the button that opens the confession letter
  const confessionWrap = {
    marginTop: isPhone ? 32 : 44,
  };

  return (
    <div style={page}>
      {!reduce && <FloatingHearts screen={screen} />}

      <div style={content}>
        <TopBar screen={screen} onBack={onBack} reduce={reduce} />
        <Hero screen={screen} reduce={reduce} />

        <main style={gallery}>
          {MEMORIES.map((memory, index) => (
            <PhotoCard
              key={memory.src}
              memory={memory}
              index={index}
              screen={screen}
              reduce={reduce}
              onOpen={() => {
                setDirection(1);
                setOpenIndex(index);
              }}
            />
          ))}
        </main>

        <motion.div
          style={footer}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <p style={footerNote}>And many more to come, if you spam me again with your cutesy pictures.</p>
          <p style={footerJoke}>
            Photos on display: {MEMORIES.length}. Smiles caused: still counting.
          </p>

          {/* Goes to the confession letter (only shows if App passes onConfession) */}
          {onConfession && (
            <div style={confessionWrap}>
              <ConfessionButton onClick={onConfession} reduce={reduce} />
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            key="lightbox"
            memory={MEMORIES[openIndex]}
            index={openIndex}
            total={MEMORIES.length}
            direction={direction}
            screen={screen}
            showHint={!hintSeen}
            reduce={reduce}
            onClose={closePhoto}
            onPrev={showPrev}
            onNext={showNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}