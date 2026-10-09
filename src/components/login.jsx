import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimation, useReducedMotion } from 'framer-motion'

/* ---------- Edit everything here ---------- */

// The nickname that opens the door. Capital letters, spaces and extra
// spaces don't matter: "zeetlog", "ZEETLOG" and "Zeet Log" all work.
// Add more spellings to the list if you want.
const ACCEPTED_NAMES = ['Zeetlog']

// Small label shown above the title
const eyebrow = 'Private entrance'
const title = 'Hold on a second'
const subtitle = 'PUT THE NICKNAME THAT I MADE FOR YOU'
const placeholder = 'Your nickname'
const buttonText = 'ENTER'

// One message per wrong try. The last one repeats if she keeps missing.
const wrongMessages = [
  'Hmm, that is not it. Are you an impostor?',
  'Nope. It is a nickname I gave you, remember?',
  'Still no. The guard is getting suspicious.',
  'Okay, this is getting embarrassing for both of us.',
  'I believe in you. Try again.',
]

// Shows up after this many wrong tries
const hintAfter = 3
const hint = 'Hint: egg'

// What she sees when she gets it right
const successTitle = 'There you are'
const successText = 'HAHAHAHAHAHA YOU GOT IT'

// How long the welcome stays before the site opens (milliseconds)
const successDelay = 2200

// true = the browser remembers her, so she only types it once on her device.
// Keep it false while you are testing, otherwise you will skip this page.
const rememberHer = false
const storageKey = 'zeetlog-unlocked'

/* ---------- Colors (from your palette) ---------- */

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
  navyText: 'rgba(35, 56, 104, 0.8)',
  maroonShadow: 'rgba(79, 23, 17, 0.45)',
}

/* ---------- Fonts ---------- */

const script = { fontFamily: "'Great Vibes', 'Snell Roundhand', cursive" }
const body = { fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif" }

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, '')
}

// Soft glowing dots drifting up the background (pink and blue, alternating)
function FloatingGlow() {
  const dots = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: (i * 41 + 6) % 94,
    size: 8 + ((i * 7) % 14),
    duration: 12 + ((i * 3) % 9),
    delay: (i * 0.9) % 7,
    sway: 10 + ((i * 5) % 16),
    color: i % 2 ? 'rgba(171, 203, 232, 0.95)' : 'rgba(221, 149, 155, 0.9)',
  }))
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className={d.id % 2 ? 'hidden sm:block' : ''}
          style={{
            position: 'absolute',
            left: `${d.left}%`,
            bottom: -40,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${d.color} 0%, rgba(255,255,255,0) 70%)`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '-115vh',
            x: [0, d.sway, -d.sway, 0],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

// The heart emblem above the title.
// It draws itself on load, floats gently, and fills in when she unlocks it.
function HeartEmblem({ unlocked, reduce }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 14px' }}
      // Gentle floating up and down (no blinking)
      animate={reduce ? undefined : { y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Soft pink glow behind the heart, stronger once unlocked */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -14,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${soft.pink} 0%, rgba(221,149,155,0) 70%)`,
        }}
        animate={{ opacity: unlocked ? 1 : 0.6, scale: unlocked ? 1.25 : 1 }}
        transition={{ duration: 0.8 }}
      />

      <svg
        viewBox="0 0 24 24"
        width="72"
        height="72"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'relative', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="heartStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.pink} />
            <stop offset="100%" stopColor={colors.maroon} />
          </linearGradient>
        </defs>

        {/* The heart fill, fades in when she gets the nickname right */}
        <motion.path
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          fill={colors.pink}
          stroke="none"
          initial={false}
          animate={{ opacity: unlocked ? 0.95 : 0.18 }}
          transition={{ duration: 0.7 }}
        />

        {/* The heart outline, drawn like a pen stroke when the page loads */}
        <motion.path
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          stroke="url(#heartStroke)"
          strokeWidth="1.2"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: 'easeInOut' }}
        />

        {/* The keyhole inside the heart, fades away when unlocked */}
        <motion.g
          stroke={colors.navy}
          strokeWidth="1.1"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: unlocked ? 0 : 1 }}
          transition={{ duration: 0.5, delay: unlocked || reduce ? 0 : 1.2 }}
        >
          <circle cx="12" cy="9.6" r="1.7" />
          <path d="M12 11.4v3" />
        </motion.g>
      </svg>
    </motion.div>
  )
}

// onSuccess: called after she types the right nickname and the welcome has played
function Login({ onSuccess }) {
  const reduce = useReducedMotion()
  const shake = useAnimation()
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const [value, setValue] = useState('')
  const [wrongCount, setWrongCount] = useState(0)
  const [message, setMessage] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  // Time helper: no animation if the device asks for reduced motion
  const t = (seconds) => (reduce ? 0 : seconds)

  // If she was already let in on this device, skip straight through
  useEffect(() => {
    if (!rememberHer) return
    try {
      if (localStorage.getItem(storageKey) === 'yes') onSuccess?.()
    } catch (e) {
      /* storage can be blocked, that is fine */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function handleSubmit(event) {
    event.preventDefault()
    if (unlocked) return

    const typed = normalize(value)
    if (!typed) {
      setMessage('You have to type something. Even a guess counts.')
      if (!reduce) shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } })
      return
    }

    const correct = ACCEPTED_NAMES.some((name) => normalize(name) === typed)

    if (correct) {
      setUnlocked(true)
      setMessage('')
      inputRef.current?.blur()
      try {
        navigator.vibrate?.(30)
      } catch (e) {
        /* ignore */
      }
      if (rememberHer) {
        try {
          localStorage.setItem(storageKey, 'yes')
        } catch (e) {
          /* ignore */
        }
      }
      timerRef.current = setTimeout(() => onSuccess?.(), t(successDelay / 1000) * 1000)
      return
    }

    // Wrong nickname: shake the card, show the next funny message
    const next = wrongCount + 1
    setWrongCount(next)
    setMessage(wrongMessages[Math.min(next - 1, wrongMessages.length - 1)])
    if (!reduce) shake.start({ x: [0, -12, 12, -8, 8, -3, 0], transition: { duration: 0.5 } })
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  const showHint = wrongCount >= hintAfter && !unlocked

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
        padding: '64px 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
        color: colors.navy,
        // Soft pastel wash: pink at the top, blue at the bottom right, cream underneath
        backgroundColor: '#f7e9ea',
        backgroundImage: [
          'radial-gradient(ellipse 70% 55% at 20% 0%, rgba(221,149,155,0.55) 0%, rgba(221,149,155,0) 70%)',
          'radial-gradient(ellipse 65% 60% at 100% 100%, rgba(171,203,232,0.75) 0%, rgba(171,203,232,0) 70%)',
          'radial-gradient(ellipse 50% 45% at 0% 100%, rgba(171,203,232,0.4) 0%, rgba(171,203,232,0) 70%)',
          'linear-gradient(180deg, #f8f0e3 0%, #f3e2e6 100%)',
        ].join(', '),
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;500;600&display=swap');`}</style>

      {!reduce && <FloatingGlow />}

      {/* Soft glow behind the card, brighter once she gets in */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 460,
          height: 460,
          marginLeft: -230,
          marginTop: -230,
          borderRadius: '50%',
          pointerEvents: 'none',
          background: `radial-gradient(circle, ${soft.blue} 0%, rgba(171,203,232,0) 70%)`,
        }}
        animate={{ opacity: unlocked ? 1 : 0.6, scale: unlocked ? 1.3 : 1 }}
        transition={{ duration: t(1.2), ease: 'easeInOut' }}
      />

      <motion.div animate={shake} style={{ position: 'relative', zIndex: 1, width: 'min(92vw, 26rem)' }}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: t(0.9), ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: '36px 24px 32px',
            borderRadius: 18,
            // Cream card that lets a little of the background show through
            background: 'linear-gradient(160deg, rgba(248,240,227,0.88) 0%, rgba(248,240,227,0.7) 100%)',
            border: `1px solid ${soft.pinkLine}`,
            boxShadow: `0 30px 60px -24px ${soft.navyShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {/* The heart emblem */}
          <HeartEmblem unlocked={unlocked} reduce={reduce} />

          <AnimatePresence mode="wait" initial={false}>
            {!unlocked ? (
              <motion.div
                key="ask"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: t(0.3) }}
              >
                {/* Small label above the title */}
                <motion.p
                  style={{
                    margin: 0,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: colors.pink,
                  }}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: t(0.8), delay: t(0.2) }}
                >
                  {eyebrow}
                </motion.p>

                <motion.h1
                  style={{
                    ...script,
                    margin: '6px 0 0',
                    fontSize: 'clamp(2.6rem, 11vw, 3.4rem)',
                    lineHeight: 1.1,
                    color: colors.navy,
                  }}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: t(0.8), delay: t(0.3) }}
                >
                  {title}
                </motion.h1>

                {/* Thin divider line under the title */}
                <motion.div
                  aria-hidden="true"
                  style={{
                    width: 64,
                    height: 1,
                    margin: '14px auto 0',
                    background: `linear-gradient(90deg, rgba(221,149,155,0) 0%, ${colors.pink} 50%, rgba(221,149,155,0) 100%)`,
                  }}
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: t(0.8), delay: t(0.6) }}
                />

                <motion.p
                  style={{
                    margin: '14px 0 0',
                    fontSize: '0.85rem',
                    fontWeight: 400,
                    letterSpacing: '0.08em',
                    lineHeight: 1.7,
                    color: soft.navyText,
                  }}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: t(0.8), delay: t(0.7) }}
                >
                  {subtitle}
                </motion.p>

                <motion.form
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: t(0.8), delay: t(0.9) }}
                >
                  <label
                    htmlFor="nickname"
                    style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
                  >
                    Nickname
                  </label>
                  <input
                    id="nickname"
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="go"
                    style={{
                      ...body,
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '14px 18px',
                      // 16px keeps iPhones from zooming into the field
                      fontSize: 16,
                      fontWeight: 400,
                      textAlign: 'center',
                      letterSpacing: '0.04em',
                      color: colors.navy,
                      background: 'rgba(255, 252, 247, 0.85)',
                      border: `1px solid ${soft.pinkLine}`,
                      borderRadius: 999,
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.navy
                      e.target.style.boxShadow = `0 0 0 3px ${soft.blue}`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = soft.pinkLine
                      e.target.style.boxShadow = 'none'
                    }}
                  />

                  <motion.button
                    type="submit"
                    whileHover={reduce ? undefined : { scale: 1.03 }}
                    whileTap={reduce ? undefined : { scale: 0.95 }}
                    style={{
                      ...body,
                      cursor: 'pointer',
                      padding: '14px 24px',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      color: colors.cream,
                      // Maroon button with a hint of navy at the bottom
                      background: `linear-gradient(180deg, #6a2a24 0%, ${colors.maroon} 100%)`,
                      border: `1px solid ${soft.pinkLine}`,
                      borderRadius: 999,
                      boxShadow: `0 12px 26px -12px ${soft.maroonShadow}`,
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {buttonText}
                  </motion.button>
                </motion.form>

                {/* Funny message after a wrong try */}
                <div style={{ minHeight: 56, marginTop: 18 }} aria-live="polite">
                  <AnimatePresence mode="wait">
                    {message && (
                      <motion.p
                        key={message + wrongCount}
                        style={{ margin: 0, fontSize: '0.9rem', fontWeight: 400, lineHeight: 1.6, color: colors.maroon }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: t(0.25) }}
                      >
                        {message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {showHint && (
                      <motion.p
                        style={{ ...script, margin: '8px 0 0', fontSize: '1.6rem', lineHeight: 1.25, color: colors.navy }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: t(0.5), delay: t(0.3) }}
                      >
                        {hint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 160, damping: 16 }}
                style={{ padding: '10px 0 10px' }}
              >
                <h2
                  style={{
                    ...script,
                    margin: 0,
                    fontSize: 'clamp(2.8rem, 12vw, 3.8rem)',
                    lineHeight: 1.1,
                    color: colors.navy,
                  }}
                >
                  {successTitle}
                </h2>
                <motion.p
                  style={{ margin: '14px 0 0', fontSize: '1rem', fontWeight: 400, lineHeight: 1.7, color: colors.maroon }}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: t(0.7), delay: t(0.5) }}
                >
                  {successText}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Login