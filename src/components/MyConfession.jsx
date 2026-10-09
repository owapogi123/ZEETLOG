import { useEffect, useRef, useState } from "react";

// ✏️ EDIT YOUR LETTER HERE
const letter = {
  from: "Me",
  to: "You",
  greeting: "Dear You,",
  paragraphs: [
    "Finally, you made it here. I'm really glad you took the time to explore everything i've prepared for you. this will be the last thing you'll see on this website and i guess this is where i'll finally tell you what i've been wanting to say.",
    "Do you still remember the first time we talked at the Camp with berto? There were only three of us there. I remember finding you interesting from the very beginning, Do you know why? it was your voice. the moment i heard it. i remember thinking, Wow, her voice is cute. i could listen to her talk all day. And when you sent me your first message, i was genuinely happy. Looking back, I'm glad i got to share and capture some moments with you, because those little things became memories that i genuinely treasure. ",
    "Zee, I Liked you from the very beginning, i like the way you talk, the way you laugh, the way you react to things, and even the little things you probably don't notice about yourself. i like for who you are, and im happy that i got to know you, i know ive made mistakes, and im truly sorry for the times i confused you or hurt you. if i could have another chance but through my actions, too. But i also understand that a second chance is something i cant ask you to give me just because i want one.",
    "I just want yo to know that my feelings are genuine, i didnt make this just to impress you, i made it because i wanted to give you something personal, something that holds the memories, feelings, and little things ive wanted to tell you. what ever your answer may be, im thankful that i got to know you my Zeetlog, and if there's one thing ill hope you'll remember after leaving this website, its that someone genuinely appreaciated the little things that make you who you are."
  ],
  signoff: "with love,",
  name: "Josh",
  date: "Now",
  validFor: "Hangga't hindi ka nag n-no",
  ps: "IM CRYING GAGU, I MISS U ZEE, CALL ME IF U SEE THIS.",
};

// 📷 Your photo: a path from /public like "/images/us.jpg". Leave "" for the placeholder.
const photo = "";

// 🎨 Palette
const sky = "#A9C8E6";
const navy = "#243768";
const cream = "#F6EEE2";
const rose = "#DB979C";
const wine = "#4E1A12";

// small header/footer cell: "From: Me", "Date: Now", ...
function Cell({ label, script, divider }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        padding: "9px 12px",
        minWidth: 0,
        borderLeft: divider ? `1px solid ${navy}` : "none",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: wine,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 23, fontWeight: 600, lineHeight: 1.1 }}>
        {script}
      </span>
    </div>
  );
}

export default function MyConfession() {
  const [opened, setOpened] = useState(false); // envelope is opening
  const [read, setRead] = useState(false); // letter is showing
  const [showPS, setShowPS] = useState(false);
  const heartsRef = useRef(null);
  const cardRef = useRef(null);

  // load fonts (Poppins, Cormorant Garamond, Dancing Script)
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Cormorant+Garamond:wght@700&family=Dancing+Script:wght@600&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  // floating hearts
  useEffect(() => {
    if (!heartsRef.current) return;
    const anims = [...heartsRef.current.children].map((el, i) =>
      el.animate(
        [
          { transform: "translateY(0) rotate(-8deg)" },
          { transform: "translateY(-55vh) translateX(18px) rotate(8deg)" },
          { transform: "translateY(-115vh) rotate(-6deg)" },
        ],
        { duration: (14 + i) * 1000, delay: -i * 2000, iterations: Infinity }
      )
    );
    return () => anims.forEach((a) => a.cancel());
  }, []);

  // after the envelope opens, show the letter
  useEffect(() => {
    if (!opened) return;
    const timer = setTimeout(() => setRead(true), 2300);
    return () => clearTimeout(timer);
  }, [opened]);

  // letter fades in
  useEffect(() => {
    if (!read || !cardRef.current) return;
    cardRef.current.animate(
      [
        { opacity: 0, transform: "translateY(30px) scale(0.96)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 900, easing: "ease-out" }
    );
  }, [read]);

  const foldBack = () => {
    setRead(false);
    setOpened(false);
    setShowPS(false);
  };

  return (
    <main
      style={{
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        overflowX: "hidden",
        textAlign: "left",
        fontFamily: "'Poppins', sans-serif",
        color: navy,
        background: "linear-gradient(160deg, #fbe3e6 0%, #f4e6f0 45%, #dfe8f6 100%)",
      }}
    >
      {/* floating hearts */}
      <div
        ref={heartsRef}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              bottom: -40,
              left: `${i * 8.3}%`,
              fontSize: i % 2 ? 26 : 18,
              color: i % 3 === 0 ? wine : i % 2 ? sky : rose,
              opacity: i % 3 === 0 ? 0.25 : 0.45,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* ---------- envelope ---------- */}
      {!read && (
        <section
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 90,
          }}
        >
          <button
            onClick={() => setOpened(true)}
            disabled={opened}
            aria-label="Open the letter"
            style={{
              position: "relative",
              width: "min(340px, 82vw)",
              aspectRatio: "3 / 2",
              padding: 0,
              border: "none",
              background: "none",
              cursor: opened ? "default" : "pointer",
              perspective: 900,
              filter: "drop-shadow(0 24px 30px rgba(36,55,104,0.28))",
            }}
          >
            {/* back */}
            <span style={{ position: "absolute", inset: 0, background: "#1c2d58", borderRadius: 8 }} />

            {/* paper sliding out */}
            <span
              style={{
                position: "absolute",
                left: "7%",
                right: "7%",
                top: "8%",
                bottom: "6%",
                zIndex: 2,
                background: cream,
                borderRadius: 4,
                transform: opened ? "translateY(-52%)" : "none",
                transition: "transform 1s cubic-bezier(0.5,0,0.2,1) 0.7s",
              }}
            />

            {/* front pocket */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                background: navy,
                borderRadius: 8,
                clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)",
              }}
            />

            {/* flap */}
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "56%",
                zIndex: opened ? 1 : 4,
                background: "#2e467f",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top",
                transform: opened ? "rotateX(180deg)" : "none",
                transition: "transform 0.8s cubic-bezier(0.6,0.05,0.3,1), z-index 0s 0.4s",
              }}
            />

            {/* wax seal */}
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "54%",
                zIndex: 5,
                width: 52,
                height: 52,
                margin: "-26px 0 0 -26px",
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 30%, #7a2a1f, ${wine} 70%)`,
                boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
                fontSize: 22,
                color: cream,
                opacity: opened ? 0 : 1,
                transition: "opacity 0.4s",
              }}
            >
              ♥
            </span>
          </button>

          <p style={{ margin: "38px 0 3px", fontSize: 18, fontWeight: 500 }}>
            {opened ? "\u00A0" : "A letter for you"}
          </p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 300, color: wine }}>
            {opened ? "\u00A0" : "Tap the seal to open"}
          </p>
        </section>
      )}

      {/* ---------- the letter ---------- */}
      {read && (
        <div ref={cardRef} style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 540 }}>
          <article
            style={{
              background: cream,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 30px 70px rgba(36,55,104,0.28)",
            }}
          >
            {/* palette arches */}
            <div style={{ display: "flex", height: 20 }}>
              {[sky, navy, cream, rose, wine].map((color) => (
                <span key={color} style={{ flex: 1, background: color, borderRadius: "0 0 24px 24px" }} />
              ))}
            </div>

            <div style={{ padding: "28px 24px 26px" }}>
              <h1
                style={{
                  margin: "0 0 18px",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.7rem, 11vw, 3.7rem)",
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.035em",
                }}
              >
                A Love Letter.
              </h1>

              {/* From / To */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  marginBottom: 16,
                  borderTop: `4px solid ${navy}`,
                  borderBottom: `1px solid ${navy}`,
                }}
              >
                <Cell label="From:" script={letter.from} />
                <Cell label="To:" script={letter.to} divider />
              </div>

              {/* letter box */}
              <div style={{ border: `1px solid ${navy}` }}>
                <div style={{ display: "flow-root", padding: "19px 19px 16px" }}>
                  {/* polaroid */}
                  <figure
                    style={{
                      position: "relative",
                      float: "right",
                      width: "40%",
                      margin: "2px -3px 26px 14px",
                      padding: "6px 6px 24px",
                      background: "#fff",
                      boxShadow: "0 8px 18px rgba(36,55,104,0.25)",
                      transform: "rotate(5deg)",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: -9,
                        left: "27%",
                        width: "46%",
                        height: 18,
                        background: "rgba(169,200,230,0.75)",
                        transform: "rotate(-4deg)",
                      }}
                    />
                    {photo ? (
                      <img
                        src={photo}
                        alt="Us"
                        style={{ display: "block", width: "100%", aspectRatio: "1 / 1.1", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          placeItems: "center",
                          aspectRatio: "1 / 1.1",
                          fontSize: 12,
                          color: cream,
                          background: `linear-gradient(135deg, ${sky}, ${rose})`,
                        }}
                      >
                        Your photo
                      </div>
                    )}
                    <span
                      style={{
                        position: "absolute",
                        right: 8,
                        bottom: -20,
                        fontSize: 35,
                        lineHeight: 1,
                        color: rose,
                        transform: "rotate(-8deg)",
                      }}
                    >
                      ☺
                    </span>
                  </figure>

                  <h2
                    style={{
                      margin: "0 0 14px",
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: 34,
                      fontWeight: 600,
                      lineHeight: 1.1,
                    }}
                  >
                    {letter.greeting}
                  </h2>

                  {letter.paragraphs.map((text, i) => (
                    <p
                      key={i}
                      style={{
                        margin: "0 0 14px",
                        fontSize: 14,
                        fontWeight: 300,
                        lineHeight: 1.85,
                        textAlign: "justify",
                        hyphens: "auto",
                        color: "#2a3a69",
                      }}
                    >
                      {text}
                    </p>
                  ))}

                  {showPS && (
                    <p style={{ margin: "0 0 14px", fontSize: 13.5, fontWeight: 300, fontStyle: "italic", lineHeight: 1.8 }}>
                      <strong style={{ fontStyle: "normal", color: rose }}>P.S.</strong> {letter.ps}
                    </p>
                  )}

                  {/* signature */}
                  <div style={{ clear: "both", paddingTop: 10, textAlign: "right" }}>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: 27,
                        fontWeight: 600,
                        transform: "rotate(-3deg)",
                      }}
                    >
                      {letter.signoff}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, fontStyle: "italic", color: wine }}>{letter.name}</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", color: rose }}>
                      
                    </p>
                  </div>
                </div>

                {/* Date / Valid for */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `1px solid ${navy}` }}>
                  <Cell label="Date:" script={letter.date} />
                  <Cell label="Valid for:" script={letter.validFor} divider />
                </div>
              </div>

              {/* double line */}
              <div
                style={{
                  height: 8,
                  marginTop: 6,
                  borderTop: `1px solid ${navy}`,
                  borderBottom: `4px solid ${navy}`,
                }}
              />
            </div>
          </article>

          {/* buttons */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            <button
              onClick={() => setShowPS(!showPS)}
              style={{
                padding: "9px 19px",
                border: `1.5px solid ${navy}`,
                borderRadius: 999,
                background: "rgba(246,238,226,0.7)",
                font: "inherit",
                fontSize: 13,
                fontWeight: 500,
                color: navy,
                cursor: "pointer",
              }}
            >
              {showPS ? "Hide the P.S." : "Read the P.S."}
            </button>
            <button
              onClick={foldBack}
              style={{
                padding: "9px 19px",
                border: "1.5px solid transparent",
                borderRadius: 999,
                background: "transparent",
                font: "inherit",
                fontSize: 13,
                fontWeight: 500,
                color: wine,
                cursor: "pointer",
              }}
            >
              Fold it back
            </button>
          </div>
        </div>
      )}
    </main>
  );
}