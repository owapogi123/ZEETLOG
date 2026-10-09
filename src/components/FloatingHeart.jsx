import { useMemo } from 'react'
import { motion } from 'framer-motion'

// Hearts that slowly float up the screen behind the content
function FloatingHeart({ count = 14 }) {
  // Random values are created once so the hearts don't jump on re-render
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100, // horizontal position in %
        size: 14 + Math.random() * 22, // heart size in px
        duration: 10 + Math.random() * 10, // seconds to float up
        delay: Math.random() * 10, // seconds before starting
        opacity: 0.15 + Math.random() * 0.25,
      })),
    [count]
  )

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute bottom-0 text-rose-400"
          style={{ left: `${h.left}%`, fontSize: h.size, opacity: h.opacity }}
          initial={{ y: '10vh' }}
          animate={{ y: '-110vh' }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}

export default FloatingHeart