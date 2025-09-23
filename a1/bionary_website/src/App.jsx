import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import { SmoothScrollProvider } from './contexts/SmoothScrollContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Leaderboard from './pages/Leaderboard'
import Departments from './pages/Departments'
import ScrollToTop from './components/layout/ScrollToTop'
import ScrollToTopButton from './components/layout/ScrollToTopButton'
import Admins from './pages/Admins'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl font-bold gradient-text mb-4">Bionary</div>
          <div className="text-xl text-space-300">Loading amazing things...</div>
          <div className="mt-8">
            <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
          {/* Animated Grid Pattern Background */}
          <div className="grid-pattern"></div>

          <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <ScrollToTopButton />

          <AnimatePresence mode="wait">
            <ScrollToTop>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/team" element={<Team />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/events" element={<Events />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path='/admins' element={<Admins />} />
              </Routes>
            </ScrollToTop>
          </AnimatePresence>

          <Footer />
        </div>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

export default App 