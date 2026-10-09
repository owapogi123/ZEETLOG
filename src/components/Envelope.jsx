import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/* ---------- Edit everything here ---------- */

const letterTitle = 'Dear, Zee'
const letterParagraphs = [
  'First of all, I want to apologize again for what I did. I know you’ve already told me that it’s okay, and maybe you really meant it, but somehow, I still feel bad about everything. I’m sorry for confusing you, for leaving you, and for suddenly disappearing without thinking about how you might feel. Looking back, I realize that I might have hurt you, and that’s something I genuinely regret. I never wanted to make you feel that way, but I know that doesn’t change what I did.',
  'I just want you to know that I truly like you. I really do. I always enjoyed talking to you, and you probably didn’t realize how much those little moments meant to me. I still remember how you’d greet me with “good morning, Owa” on TikTok. It might have been just a simple greeting to you, but for me, it was something I looked forward to. It made me feel like I mattered to someone, like there was someone who thought of me when they woke up. It’s a simple thing, but somehow, you made my mornings feel a little different, a little better. And honestly, I miss that.',
  'And honestly, I miss the little things about you, too. I miss the random pictures you’d send me, the little glimpses of what you were doing or what you looked like at that moment. I miss seeing your gullible face, your hoodie with your glasses, and the way your room would look with those LED lights in the background. I don’t know if you ever thought those pictures were anything special, but to me, they were. I liked seeing those little parts of your everyday life, the moments you probably didn’t even think twice about sharing with me.',
  'And your laugh. God, your laugh. HAHAHAHA. I don’t even know how to describe it properly because, honestly, it’s so weird sometimes. But that’s what makes it yours. There’s something about the way you laugh that makes you feel so real, like you’re not trying to be someone else or make yourself look a certain way. You’re just being yourself, and I think that’s one of the things I genuinely like about you. It’s those little, unfiltered moments when you’re just being you that make you special to me.',
]
// How many paragraphs go on the LEFT page. The rest go on the right page.
const leftParagraphCount = 2

// Short line shown under the paragraphs (set to '' to remove it)
const letterClosing = ''
const letterSignature = 'owa'

// Little hints under the envelope. They change the more she taps.
const hintClosed = [
  'Tap the seal',
  'It won’t bite. The feelings might',
  'Okay, now you’re just poking my heart',
  'Fine, I’ll wait. I have all day',
]

// Text for the small link that folds the letter back into the envelope
const foldBackText = 'Fold it back up'

// The button under the letter, and the small text below it
const buttonText = 'BUTTON'
const finePrint = 'Click the button if you want to Continue'

/* ---------- Colors (same palette as the other pages) ---------- */

const colors = {
  lightBlue: '#abcbe8',
  navy: '#233868',
  cream: '#f8f0e3',
  pink: '#dd959b',
  maroon: '#4f1711',
}

const soft = {
  pink: 'rgba(221, 149, 155, 0.55)',
  pinkLine: 'rgba(221, 149, 155, 0.6)',
  blue: 'rgba(171, 203, 232, 0.65)',
  navyShadow: 'rgba(35, 56, 104, 0.35)',
  navyText: 'rgba(35, 56, 104, 0.88)',
  navyHint: 'rgba(35, 56, 104, 0.7)',
  navyFine: 'rgba(35, 56, 104, 0.55)',
  maroonShadow: 'rgba(79, 23, 17, 0.45)',
}

// Colors of the falling petals
const petalColors = ['#dd959b', '#e9b3b8', '#f0c4c8', '#c9777f', '#abcbe8']

/* ---------- Fonts ---------- */

const script = { fontFamily: "'Great Vibes', 'Snell Roundhand', cursive" }
const body = { fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif" }

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;500;600&display=swap'

/* ---------- Helpers ---------- */

// Loads the Google fonts once
function useFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_LINK}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONT_LINK
    document.head.appendChild(link)
  }, [])
}

// true on wide screens (two-page spread), false on phones (pages stack into one)
function useIsWide() {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 760)

  useEffect(() => {
    const handleResize = () => setWide(window.innerWidth >= 760)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return wide
}

/* ---------- Small pieces ---------- */

// Rose petals drifting slowly down the whole page
function Petals({ count }) {
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i * 53 + 7) % 96,
    size: 10 + ((i * 5) % 12),
    duration: 14 + ((i * 3) % 10),
    delay: (i * 1.3) % 9,
    sway: 20 + ((i * 7) % 30),
    spin: (i % 2 ? 1 : -1) * (180 + i * 20),
    color: petalColors[i % petalColors.length],
  }))
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {petals.map((p) => (
        <motion.span
          key={p.id}
          style={{
            position: 'absolute',
            top: -30,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.3,
            background: `linear-gradient(135deg, ${p.color}, rgba(255,255,255,0.6))`,
            borderRadius: '0 100% 0 100%',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '112vh',
            x: [0, p.sway, -p.sway, p.sway / 2],
            rotate: p.spin,
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

// The wax seal in the middle of the envelope
function WaxSeal() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id="waxGrad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#b9545c" />
          <stop offset="55%" stopColor="#7a2a2a" />
          <stop offset="100%" stopColor={colors.maroon} />
        </radialGradient>
      </defs>
      {/* Slightly wavy wax edge */}
      <path
        d="M24 2c3 0 4 3 7 3.5s5-1.5 7.5.5 1 5 3 7.5 5 2.5 5.5 5.5-2.5 4.5-2.5 7.5 3 5 1.5 7.5-4.5 1.5-6.5 4-1 5.5-4 6.5-5-1.5-8-1-4.5 3-7.5 2-2.5-4.5-5-6.5-5.5-1.5-6.5-4.5 1-5.5 0-8.5-4-4.5-3-7.5 4.5-2.5 6.5-5 1-5.5 4-6.5 5.5 1 8.5.5Z"
        fill="url(#waxGrad)"
      />
      <circle cx="24" cy="24" r="14" fill="none" stroke="rgba(248,240,227,0.25)" strokeWidth="0.8" />
      {/* Heart pressed into the wax */}
      <path
        d="M24 33s-8-5-10-10c-1.4-3.6.6-7.2 4.4-7.2 2.3 0 4.2 1.3 5.6 3.3 1.4-2 3.3-3.3 5.6-3.3 3.8 0 5.8 3.6 4.4 7.2-2 5-10 10-10 10z"
        fill="rgba(248,240,227,0.88)"
      />
    </svg>
  )
}

// Thin pink line with a small heart in the middle
function HeartDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: 150,
        margin: '10px 0 0',
        color: colors.pink,
      }}
    >
      <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg, rgba(221,149,155,0), ${colors.pink})` }} />
      <span style={{ fontSize: '0.8rem' }}>♥</span>
      <span style={{ height: 1, flex: 1, background: `linear-gradient(270deg, rgba(221,149,155,0), ${colors.pink})` }} />
    </div>
  )
}

/* ---------- The page ---------- */

// onOpenLibrary: called when she taps the button under the letter
function Envelope({ onOpenLibrary }) {
  const reduce = useReducedMotion()
  const timerRef = useRef(null)
  const wide = useIsWide()
  useFonts()

  // stage: 'closed' (envelope waiting) -> 'opening' (flap + letter rising) -> 'letter' (full spread)
  const [stage, setStage] = useState('closed')
  const [taps, setTaps] = useState(0)
  const [burst, setBurst] = useState([])
  // Fewer petals on small screens so phones stay smooth
  const [petalCount] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 9 : 16,
  )

  // Time helper: no animation if the device asks for reduced motion
  const t = (seconds) => (reduce ? 0 : seconds)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function openEnvelope() {
    if (stage !== 'closed') return
    setTaps((n) => n + 1)
    setStage('opening')

    // Little hearts rising from the seal
    if (!reduce) {
      const small = window.innerWidth < 640
      const n = small ? 8 : 14
      const reach = small ? 100 : 160
      setBurst(
        Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2 + (i % 2) * 0.2
          const d = reach * (0.55 + (i % 3) * 0.25)
          return {
            id: `${Date.now()}-${i}`,
            x: Math.cos(a) * d,
            y: Math.sin(a) * d - 60,
            rot: (i % 2 ? 1 : -1) * (15 + i * 8),
            size: 12 + (i % 4) * 4,
            color: petalColors[i % petalColors.length],
          }
        }),
      )
      setTimeout(() => setBurst([]), 2200)
      try {
        navigator.vibrate?.(25)
      } catch (e) {
        /* ignore */
      }
    }

    // After the letter has risen, switch to the full letter
    timerRef.current = setTimeout(() => setStage('letter'), reduce ? 300 : 2400)
  }

  function foldBack() {
    clearTimeout(timerRef.current)
    setTaps((n) => n + 1)
    setStage('closed')
  }

  const hint = hintClosed[Math.min(Math.floor(taps / 2), hintClosed.length - 1)]
  const opened = stage !== 'closed'

  // Letter content fades in piece by piece after the letter appears
  const reveal = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: t(0.8), delay: t(0.7 + i * 0.35), ease: 'easeOut' },
  })
  const titleLetters = Array.from(letterTitle)
  const leftParagraphs = letterParagraphs.slice(0, leftParagraphCount)
  const rightParagraphs = letterParagraphs.slice(leftParagraphCount)
  const sigDelay = 0.7 + (letterParagraphs.length + 1) * 0.35

  const paragraphStyle = {
    margin: '0 0 14px',
    fontSize: 'clamp(0.85rem, 1.35vw, 0.93rem)',
    fontWeight: 400,
    lineHeight: 1.85,
    color: soft.navyText,
  }

  // The open letter: a two-page spread on wide screens, one tall page on phones.
  // It grows to fit all the text, so nothing gets cut off or overlapped.
  const spread = {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: wide ? '1fr 1fr' : '1fr',
    width: 'min(94vw, 60rem)',
    boxSizing: 'border-box',
    borderRadius: 10,
    textAlign: 'left',
    background: wide
      ? 'linear-gradient(90deg, rgba(35,56,104,0) 45%, rgba(35,56,104,0.09) 50%, rgba(35,56,104,0) 55%), linear-gradient(160deg, #fffaf0 0%, #f8f0e3 100%)'
      : 'linear-gradient(160deg, #fffaf0 0%, #f8f0e3 100%)',
    boxShadow: [
      'inset 0 0 0 10px #f8f0e3',
      'inset 0 0 0 11px rgba(221, 149, 155, 0.55)',
      '0 40px 80px -30px rgba(35, 56, 104, 0.5)',
    ].join(', '),
  }

  const pageStyle = (isSecond) => ({
    padding: wide ? 'clamp(28px, 4.5vw, 54px)' : '34px 28px',
    boxSizing: 'border-box',
    textAlign: 'left',
    // On phones a dashed line separates the two halves
    borderTop: isSecond && !wide ? '1px dashed rgba(221, 149, 155, 0.55)' : 'none',
    // Keeps the second half clear of the inner frame line
    marginTop: isSecond && !wide ? 0 : undefined,
  })

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
        padding: '48px 16px',
        boxSizing: 'border-box',
        textAlign: 'center',
        color: colors.navy,
        // Same soft pastel wash as the login and landing pages
        backgroundColor: '#f7e9ea',
        backgroundImage: [
          'radial-gradient(ellipse 70% 55% at 20% 0%, rgba(221,149,155,0.55) 0%, rgba(221,149,155,0) 70%)',
          'radial-gradient(ellipse 65% 60% at 100% 100%, rgba(171,203,232,0.75) 0%, rgba(171,203,232,0) 70%)',
          'radial-gradient(ellipse 50% 45% at 0% 100%, rgba(171,203,232,0.4) 0%, rgba(171,203,232,0) 70%)',
          'linear-gradient(180deg, #f8f0e3 0%, #f3e2e6 100%)',
        ].join(', '),
      }}
    >
      {!reduce && <Petals count={petalCount} />}

      {/* Warm glow in the middle, like candlelight. It breathes slowly and brightens when opened */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 560,
          height: 560,
          marginLeft: -280,
          marginTop: -280,
          borderRadius: '50%',
          pointerEvents: 'none',
          background: `radial-gradient(circle, ${soft.pink} 0%, rgba(221,149,155,0) 70%)`,
        }}
        animate={
          reduce
            ? { opacity: opened ? 0.9 : 0.5 }
            : { opacity: opened ? [0.7, 1, 0.7] : [0.35, 0.6, 0.35], scale: opened ? 1.2 : 1 }
        }
        transition={{ duration: 3.4, repeat: reduce ? 0 : Infinity, ease: 'easeInOut' }}
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {stage !== 'letter' ? (
            /* ---------- STAGE 1 and 2: the envelope ---------- */
            <motion.div
              key="envelope"
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: t(0.6) }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {/* Gentle floating while it waits */}
              <motion.div
                animate={reduce || opened ? { y: 0, rotate: 0 } : { y: [0, -8, 0], rotate: [0, -1, 1, 0] }}
                transition={
                  opened
                    ? { duration: 0.4 }
                    : {
                        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                      }
                }
              >
                <div
                  style={{
                    position: 'relative',
                    width: 'min(90vw, 34rem)',
                    aspectRatio: '7 / 4',
                    perspective: 1200,
                  }}
                >
                  {/* Inside back of the envelope: light blue */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 8,
                      background: `linear-gradient(180deg, #8fb6dc, ${colors.lightBlue})`,
                      boxShadow: `0 34px 60px -24px ${soft.navyShadow}`,
                    }}
                  />

                  {/* A peek of the letter that slides up out of the envelope */}
                  <motion.div
                    initial={false}
                    animate={{ y: stage === 'opening' ? '-48%' : '0%' }}
                    transition={{ duration: t(1.1), delay: stage === 'opening' ? t(0.6) : 0, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: 'absolute',
                      left: '6%',
                      top: '4%',
                      width: '88%',
                      height: '78%',
                      zIndex: 10,
                      borderRadius: 4,
                      backgroundColor: colors.cream,
                      // Faint ruled lines, like writing paper
                      backgroundImage:
                        'repeating-linear-gradient(180deg, rgba(248,240,227,0) 0 20px, rgba(221,149,155,0.28) 20px 21px)',
                      boxShadow: '0 6px 20px -8px rgba(35,56,104,0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingTop: '4%',
                    }}
                  >
                    <span style={{ ...script, fontSize: 'clamp(1.6rem, 6vw, 2.4rem)', lineHeight: 1.1, color: colors.pink }}>
                      {letterTitle}
                    </span>
                  </motion.div>

                  {/* Front pocket: the V-shaped lower part of the envelope (cream) */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 20,
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 -2px 3px rgba(35,56,104,0.22))',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '0 0 8px 8px',
                        clipPath: 'polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)',
                        background: 'linear-gradient(180deg, #fbf5ea, #f1e4d0)',
                      }}
                    />
                  </div>

                  {/* Top flap (dusty pink): swings up when opened */}
                  <motion.div
                    initial={false}
                    animate={{ rotateX: opened ? 180 : 0, zIndex: opened ? 5 : 30 }}
                    transition={{
                      rotateX: { duration: t(0.8), ease: 'easeInOut' },
                      zIndex: { delay: opened ? t(0.4) : 0, duration: 0 },
                    }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      height: '52%',
                      pointerEvents: 'none',
                      transformOrigin: 'top',
                      filter: 'drop-shadow(0 3px 3px rgba(35,56,104,0.28))',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        background: `linear-gradient(180deg, #e8aeb3, ${colors.pink})`,
                      }}
                    />
                  </motion.div>

                  {/* Wax seal at the tip of the flap: beats softly, then breaks away when opened */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '52%',
                      width: 'clamp(60px, 15vw, 80px)',
                      height: 'clamp(60px, 15vw, 80px)',
                      marginLeft: 'calc(clamp(60px, 15vw, 80px) / -2)',
                      marginTop: 'calc(clamp(60px, 15vw, 80px) / -2)',
                      zIndex: 40,
                      pointerEvents: 'none',
                    }}
                  >
                    <motion.div
                      initial={false}
                      animate={{ scale: opened ? 0.3 : 1, opacity: opened ? 0 : 1, rotate: opened ? 25 : 0 }}
                      transition={{ duration: t(0.4) }}
                      style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 6px 8px rgba(79,23,17,0.45))' }}
                    >
                      <motion.div
                        style={{ width: '100%', height: '100%' }}
                        animate={opened || reduce ? { scale: 1 } : { scale: [1, 1.09, 1, 1.06, 1, 1] }}
                        transition={{ duration: 2, repeat: opened || reduce ? 0 : Infinity, ease: 'easeInOut' }}
                      >
                        <WaxSeal />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Hearts rising when the seal breaks */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    {burst.map((b) => (
                      <motion.span
                        key={b.id}
                        aria-hidden="true"
                        style={{ position: 'absolute', fontSize: b.size, lineHeight: 1, color: b.color }}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
                        animate={{
                          x: b.x,
                          y: [0, b.y, b.y - 50],
                          scale: [0, 1.2, 0.9],
                          opacity: [0, 1, 0],
                          rotate: b.rot,
                        }}
                        transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
                      >
                        ♥
                      </motion.span>
                    ))}
                  </div>

                  {/* Click area over the whole envelope */}
                  <motion.button
                    type="button"
                    onClick={openEnvelope}
                    disabled={opened}
                    aria-label="Open the letter"
                    whileTap={reduce || opened ? undefined : { scale: 0.97 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 50,
                      cursor: opened ? 'default' : 'pointer',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  />
                </div>
              </motion.div>

              {/* Hint under the envelope, changes the more she taps */}
              <motion.div
                animate={{ opacity: opened ? 0 : 1 }}
                transition={{ duration: t(0.3) }}
                style={{ marginTop: 34, height: 24 }}
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={hint}
                    style={{ margin: 0, fontSize: '0.9rem', fontWeight: 400, letterSpacing: '0.04em', color: soft.navyHint }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: t(0.25) }}
                    aria-live="polite"
                  >
                    {hint}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ) : (
            /* ---------- STAGE 3: the open letter (two-page spread, one page on phones) ---------- */
            <motion.div
              key="letter"
              initial={reduce ? false : { opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: t(1), ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
            >
              <div style={spread}>
                {/* LEFT PAGE: title + first paragraphs */}
                <div style={pageStyle(false)}>
                  <h2
                    style={{ ...script, margin: 0, fontSize: 'clamp(2.6rem, 6vw, 3.6rem)', lineHeight: 1.1, color: colors.navy }}
                    aria-label={letterTitle}
                  >
                    {titleLetters.map((ch, i) => (
                      <motion.span
                        key={i}
                        aria-hidden="true"
                        style={{ display: 'inline-block' }}
                        initial={reduce ? false : { opacity: 0, y: 14, scale: 0.6, rotate: -8 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 14, delay: t(0.5 + i * 0.07) }}
                      >
                        {ch === ' ' ? '\u00A0' : ch}
                      </motion.span>
                    ))}
                  </h2>
                  <HeartDivider />

                  <div style={{ marginTop: 20 }}>
                    {leftParagraphs.map((p, i) => (
                      <motion.p key={i} style={paragraphStyle} {...reveal(i + 1)}>
                        {p}
                      </motion.p>
                    ))}
                  </div>
                </div>

                {/* RIGHT PAGE: the rest of the paragraphs + signature */}
                <div style={pageStyle(true)}>
                  <div>
                    {rightParagraphs.map((p, i) => (
                      <motion.p key={i} style={paragraphStyle} {...reveal(leftParagraphs.length + i + 1)}>
                        {p}
                      </motion.p>
                    ))}

                    {letterClosing && (
                      <motion.p
                        style={{ ...paragraphStyle, fontStyle: 'italic', color: colors.maroon }}
                        {...reveal(letterParagraphs.length + 1)}
                      >
                        {letterClosing}
                      </motion.p>
                    )}
                  </div>

                  {/* Signature with a little flourish */}
                  <motion.div
                    style={{ marginTop: 8, textAlign: 'right' }}
                    initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -6 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 12, delay: t(sigDelay) }}
                  >
                    <span style={{ ...script, fontSize: '2.6rem', lineHeight: 1.1, color: colors.pink }}>
                      {letterSignature}
                    </span>
                    <span style={{ marginLeft: 8, color: colors.pink, fontSize: '1rem' }}>♥</span>
                  </motion.div>
                </div>
              </div>

              {/* Button to continue, appears after the letter has been read */}
              {onOpenLibrary && (
                <motion.div
                  style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: t(0.8), delay: t(sigDelay + 0.3) }}
                >
                  <motion.button
                    type="button"
                    onClick={onOpenLibrary}
                    animate={
                      reduce
                        ? undefined
                        : {
                            scale: [1, 1.05, 1],
                            boxShadow: [
                              '0 12px 26px -12px rgba(79,23,17,0.45)',
                              '0 0 24px 4px rgba(221,149,155,0.65)',
                              '0 12px 26px -12px rgba(79,23,17,0.45)',
                            ],
                          }
                    }
                    transition={{ duration: 2.4, repeat: Infinity, delay: t(sigDelay + 1), ease: 'easeInOut' }}
                    whileHover={reduce ? undefined : { scale: 1.06 }}
                    whileTap={reduce ? undefined : { scale: 0.94 }}
                    style={{
                      ...body,
                      cursor: 'pointer',
                      padding: '14px 40px',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      color: colors.cream,
                      background: `linear-gradient(180deg, #6a2a24 0%, ${colors.maroon} 100%)`,
                      border: `1px solid ${soft.pinkLine}`,
                      borderRadius: 999,
                      boxShadow: `0 12px 26px -12px ${soft.maroonShadow}`,
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {buttonText}
                  </motion.button>

                  <p style={{ margin: '12px 0 0', fontSize: '0.78rem', fontWeight: 400, color: soft.navyFine }}>
                    {finePrint}
                  </p>

                  {/* Small link to fold the letter back into the envelope */}
                  <button
                    type="button"
                    onClick={foldBack}
                    style={{
                      ...body,
                      marginTop: 10,
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.78rem',
                      color: soft.navyFine,
                      textDecoration: 'underline',
                      textUnderlineOffset: 3,
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {foldBackText}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Envelope