import { motion, useReducedMotion } from 'framer-motion'

/* ---------- Edit everything here ---------- */

const herName = 'Welcome Here Zee!'
const headline = 'So You Remember, Keep Exploring'
const message =
  'i know this sounds dumb, but i want to know you more, this is the only i think that i can do something for you. i hope you like it'
const buttonText = 'CLICK ME'
const signature = 'Enjoy!'

/* ---------- Colors (same palette as the login page) ---------- */

// The five main colors. Change a value here and the whole page follows.
const colors = {
  lightBlue: '#abcbe8',
  navy: '#233868',
  cream: '#f8f0e3',
  pink: '#dd959b',
  maroon: '#4f1711',
}

// Soft see-through versions used for glows, borders and shadows
const soft = {
  pink: 'rgba(221, 149, 155, 0.55)',
  pinkLine: 'rgba(221, 149, 155, 0.6)',
  blue: 'rgba(171, 203, 232, 0.65)',
  navyShadow: 'rgba(35, 56, 104, 0.35)',
  navyText: 'rgba(35, 56, 104, 0.85)',
  maroonShadow: 'rgba(79, 23, 17, 0.45)',
}

/* ---------- Fonts ---------- */

// Fonts load from Google Fonts (see the <style> tag below),
// so they show up on any device, not only on your computer.
const script = { fontFamily: "'Great Vibes', 'Snell Roundhand', cursive" }
const body = { fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif" }

// Small pink and blue hearts drifting up behind everything
function DriftingHearts() {
  const hearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: (i * 41 + 6) % 92,
    size: 14 + ((i * 7) % 16),
    duration: 14 + ((i * 3) % 9),
    delay: (i * 1.1) % 8,
    sway: 10 + ((i * 5) % 16),
    color: i % 2 ? colors.lightBlue : colors.pink,
  }))
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          style={{
            position: 'absolute',
            left: `${h.left}%`,
            bottom: -40,
            fontSize: h.size,
            lineHeight: 1,
            color: h.color,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '-115vh',
            x: [0, h.sway, -h.sway, 0],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'linear' }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}

// The heart drawn at the top. It draws itself like a pen stroke, then floats gently.
function HeartEmblem({ reduce }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ position: 'relative', width: 64, height: 64, margin: '0 auto 22px' }}
      animate={reduce ? undefined : { y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Soft pink glow behind the heart */}
      <div
        style={{
          position: 'absolute',
          inset: -16,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${soft.pink} 0%, rgba(221,149,155,0) 70%)`,
        }}
      />
      <svg
        viewBox="0 0 24 24"
        width="64"
        height="64"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'relative', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="landingHeartStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.pink} />
            <stop offset="100%" stopColor={colors.maroon} />
          </linearGradient>
        </defs>

        {/* Faint fill that fades in after the outline is drawn */}
        <motion.path
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          fill={colors.pink}
          stroke="none"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 1.4 }}
        />

        {/* The outline, drawn when the page loads */}
        <motion.path
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          stroke="url(#landingHeartStroke)"
          strokeWidth="1.2"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  )
}

function LandingPage({ onNext }) {
  const reduce = useReducedMotion()

  // One entrance sequence: each child fades in right after the previous one
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.3, delayChildren: 0.2 } },
  }
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 1, ease: 'easeOut' } },
  }

  return (
    <section
      style={{
        ...body,
        position: 'relative',
        display: 'flex',
        minHeight: '100svh',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '80px 24px',
        boxSizing: 'border-box',
        textAlign: 'center',
        color: colors.navy,
        // Same soft pastel wash as the login page
        backgroundColor: '#f7e9ea',
        backgroundImage: [
          'radial-gradient(ellipse 70% 55% at 20% 0%, rgba(221,149,155,0.55) 0%, rgba(221,149,155,0) 70%)',
          'radial-gradient(ellipse 65% 60% at 100% 100%, rgba(171,203,232,0.75) 0%, rgba(171,203,232,0) 70%)',
          'radial-gradient(ellipse 50% 45% at 0% 100%, rgba(171,203,232,0.4) 0%, rgba(171,203,232,0) 70%)',
          'linear-gradient(180deg, #f8f0e3 0%, #f3e2e6 100%)',
        ].join(', '),
      }}
    >
      {/* Loads Great Vibes (romantic script) and Poppins from Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;500;600&display=swap');`}</style>

      {/* Hearts drifting up behind everything */}
      {!reduce && <DriftingHearts />}

      {/* Very soft edge fade so the corners feel gently framed */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0) 60%, rgba(35,56,104,0.12) 100%)',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 640 }}
      >
        {/* Heart emblem */}
        <motion.div variants={item}>
          <HeartEmblem reduce={reduce} />
        </motion.div>

        {/* Small greeting label */}
        <motion.p
          variants={item}
          style={{
            margin: 0,
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: colors.pink,
          }}
        >
          Hi, {herName}
        </motion.p>

        {/* Main headline: the one big moment on the page */}
        <motion.h1
          variants={item}
          style={{
            ...script,
            margin: '14px 0 0',
            fontSize: 'clamp(3.2rem, 13vw, 6rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: colors.navy,
          }}
        >
          {headline}
        </motion.h1>

        {/* Thin divider with a heart in the middle */}
        <motion.div
          variants={item}
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: 190,
            margin: '28px auto 0',
            color: colors.pink,
          }}
        >
          <span
            style={{
              height: 1,
              flex: 1,
              background: `linear-gradient(90deg, rgba(221,149,155,0), ${colors.pink})`,
            }}
          />
          <span style={{ fontSize: '0.85rem' }}>♥</span>
          <span
            style={{
              height: 1,
              flex: 1,
              background: `linear-gradient(270deg, rgba(221,149,155,0), ${colors.pink})`,
            }}
          />
        </motion.div>

        {/* Your message, inside a soft cream card */}
        <motion.div
          variants={item}
          style={{
            maxWidth: 460,
            margin: '28px auto 0',
            padding: '24px 26px',
            borderRadius: 18,
            background: 'linear-gradient(160deg, rgba(248,240,227,0.88) 0%, rgba(248,240,227,0.7) 100%)',
            border: `1px solid ${soft.pinkLine}`,
            boxShadow: `0 24px 50px -26px ${soft.navyShadow}, inset 0 1px 0 rgba(255,255,255,0.8)`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.95rem, 3.6vw, 1.05rem)',
              fontWeight: 400,
              lineHeight: 1.85,
              color: soft.navyText,
            }}
          >
            {message}
          </p>
        </motion.div>

        {/* Button */}
        <motion.div variants={item} style={{ marginTop: 40 }}>
          <motion.button
            type="button"
            onClick={onNext}
            whileHover={reduce ? undefined : { y: -3, scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.96 }}
            style={{
              ...body,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              maxWidth: '100%',
              padding: '15px 38px',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.22em',
              color: colors.cream,
              // Maroon button, same as the login page
              background: `linear-gradient(180deg, #6a2a24 0%, ${colors.maroon} 100%)`,
              border: `1px solid ${soft.pinkLine}`,
              borderRadius: 999,
              boxShadow: `0 14px 30px -12px ${soft.maroonShadow}`,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {buttonText}
          </motion.button>
        </motion.div>

        {/* Signature */}
        <motion.p
          variants={item}
          style={{
            ...script,
            margin: '36px 0 0',
            fontSize: '2.4rem',
            lineHeight: 1.2,
            color: colors.pink,
          }}
        >
          {signature}
        </motion.p>
      </motion.div>
    </section>
  )
}

export default LandingPage