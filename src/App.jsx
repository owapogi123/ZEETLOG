import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Login from './components/login.jsx'
import LandingPage from './components/LandingPage.jsx'
import Envelope from './components/Envelope.jsx'
import Library from './components/Library.jsx'
import MyConfession from './components/MyConfession.jsx'


// The order of the pages. Change the first one here to start somewhere else.
const FIRST_PAGE = 'login'

// Wraps each page so they all fade in and out the same way.
// "duration" is how long the fade takes, in seconds.
function Page({ pageKey, duration = 0.9, children }) {
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  // Which page is showing:
  // 'login' -> 'landing' -> 'envelope' -> 'library' -> 'confession'
  const [page, setPage] = useState(FIRST_PAGE)

  // Always start the next page from the top
  function goTo(nextPage) {
    window.scrollTo(0, 0)
    setPage(nextPage)
  }

  return (
    <main style={{ backgroundColor: '#1f0a16', minHeight: '100svh' }}>
      {/* Outside AnimatePresence so the music never restarts between pages */}

      {/* mode="wait" lets the old page fade out before the new one fades in */}
      <AnimatePresence mode="wait">
        {page === 'login' && (
          <Page pageKey="login" duration={0.6}>
            {/* Login calls onSuccess after the right nickname is typed */}
            <Login onSuccess={() => goTo('landing')} />
          </Page>
        )}

        {page === 'landing' && (
          <Page pageKey="landing" duration={0.6}>
            <LandingPage onNext={() => goTo('envelope')} />
          </Page>
        )}

        {page === 'envelope' && (
          <Page pageKey="envelope">
            <Envelope onOpenLibrary={() => goTo('library')} />
          </Page>
        )}

        {page === 'library' && (
          <Page pageKey="library">
            {/* onConfession shows the "I have one last thing to say" button */}
            <Library
              onBack={() => goTo('envelope')}
              onConfession={() => goTo('confession')}
            />
          </Page>
        )}

        {page === 'confession' && (
          <Page pageKey="confession">
            <MyConfession />
          </Page>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App