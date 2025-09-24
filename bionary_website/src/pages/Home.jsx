import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { useInView } from 'react-intersection-observer'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Zap, Users, Code, Award, Rocket, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const containerRef = useRef(null)
  const {isDark} = useTheme()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  
  // Animated background gradient
  const { background } = useSpring({
    from: { background: 'linear-gradient(120deg, #00d4ff 0%, #090979 100%)' },
    to: { background: 'linear-gradient(120deg, #8b5cf6 0%, #ec4899 100%)' },
    config: { duration: 5000 },
    loop: { reverse: true }
  })

  // Intersection observer for scroll animations
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  useEffect(() => {
    // GSAP animations for text reveal with better timing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top center',
        end: 'bottom center',
        toggleActions: 'play none none reverse'
      }
    })

    tl.fromTo('.hero-title', 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.hero-subtitle',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo('.hero-cta',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    )

    // Parallax sections with smoother animation
    gsap.utils.toArray('.parallax-section').forEach(section => {
      gsap.to(section, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })
    })
  }, [])


  const stats = [
    { icon: Users, value: "150+", label: "Active Members" },
    { icon: Code, value: "50+", label: "Projects Completed" },
    { icon: Award, value: "25+", label: "Awards Won" },
    { icon: Rocket, value: "100+", label: "Events Organized" }
  ]

  const features = [
    {
      title: "Innovation Hub",
      description: "State-of-the-art facilities for cutting-edge technology development",
      icon: Zap
    },
    {
      title: "Expert Mentorship",
      description: "Learn from industry professionals and experienced developers",
      icon: Users
    },
    {
      title: "Real Projects",
      description: "Work on real-world projects that make a difference",
      icon: Code
    },
    {
      title: "Career Growth",
      description: "Connect with top companies and accelerate your career",
      icon: Award
    }
  ]

  return (
    <div ref={containerRef} className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-space-900' : 'bg-white'}`}>
      {/* Dark Mode Toggle */}

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <animated.div 
          style={{ background }}
          className="absolute inset-0 opacity-20 dark:opacity-30"
        />
        
        {/* Animated Particles Background */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-neon-cyan rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="hero-title text-6xl md:text-8xl font-bold mb-6"
              style={{ y }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink animate-gradient">
                Bionary
              </span>
              <br />
              <span className="text-space-900 dark:text-space-50">
                Tech Club
              </span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle text-xl md:text-2xl text-space-600 dark:text-space-300 mb-8"
              style={{ y }}
            >
              <span className="font-semibold text-neon-cyan">Innovate.</span>{" "}
              <span className="font-semibold text-neon-violet">Create.</span>{" "}
              <span className="font-semibold text-neon-pink">Transform.</span>
              <br />
              Join us in shaping the future of technology
            </motion.p>
            
            <motion.div 
              className="hero-cta flex flex-col sm:flex-row gap-4 justify-center"
              style={{ y }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-violet text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join Our Community
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-neon-cyan text-neon-cyan rounded-lg font-semibold text-lg hover:bg-neon-cyan/10 transition-all duration-300"
              >
                Explore Events
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="w-6 h-10 border-2 border-neon-cyan rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-neon-cyan rounded-full mt-2"
              animate={{ 
                y: [0, 12, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-space-50 to-space-100 dark:from-space-800 dark:to-space-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">Bionary</span>?
            </h2>
            <p className="text-xl text-space-600 dark:text-space-300 max-w-3xl mx-auto">
              We provide the perfect environment for tech enthusiasts to grow, learn, and innovate together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center glass-effect rounded-xl p-6 neon-glow hover:neon-glow-violet transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-12 h-12 text-neon-cyan" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-space-900 dark:text-space-50 mb-2">
                  {stat.value}
                </div>
                <div className="text-space-600 dark:text-space-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">Bionary</span>?
            </h2>
            <p className="text-xl text-space-600 dark:text-space-300 max-w-3xl mx-auto">
              We provide the perfect environment for tech enthusiasts to grow, learn, and innovate together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-6 rounded-xl glass-effect shadow-lg hover:shadow-xl transition-all duration-300 neon-glow hover:neon-glow-pink"
              >
                <div className="flex justify-center mb-4">
                  <feature.icon className="w-12 h-12 text-neon-cyan" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-space-900 dark:text-space-50">
                  {feature.title}
                </h3>
                <p className="text-space-600 dark:text-space-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-neon-cyan to-neon-violet relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 text-shadow"
          >
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-8"
          >
            Join hundreds of students who are already building the future with Bionary.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-neon-cyan rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 neon-glow hover:neon-glow-violet"
          >
            Get Started Today
            <ArrowRight className="inline ml-2 w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  )
}

export default Home 