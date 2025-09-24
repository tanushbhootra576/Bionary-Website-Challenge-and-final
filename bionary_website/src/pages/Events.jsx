import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FloatingCube from '../components/3d/FloatingCube'
import { Calendar, Clock, MapPin, Users, Zap, Code, Award, Globe, ArrowRight, ExternalLink } from 'lucide-react'
import {API_URL} from '../../url.js'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const Events = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const [timeLeft, setTimeLeft] = useState({})
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch events from backend
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const res = await fetch(API_URL+'/events')
        if (res.ok) {
          const data = await res.json()
          console.log(data)
          setEvents(data)
        } else {
          setEvents([])
        }
      } catch {
        setEvents([])
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  // Replace upcomingEvents and pastEvents with filtered events
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date())
  const pastEvents = events.filter(e => new Date(e.date) < new Date())

  const eventTypes = [
    { name: "All Events", icon: Calendar, count: upcomingEvents.length + pastEvents.length },
    { name: "Workshops", icon: Code, count: 12 },
    { name: "Hackathons", icon: Zap, count: 8 },
    { name: "Conferences", icon: Users, count: 6 },
    { name: "Competitions", icon: Award, count: 15 }
  ]

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <FloatingCube position={[-3, 2, 0]} size={0.4} color="#ec4899" />
            <FloatingCube position={[3, -2, 0]} size={0.3} color="#8b5cf6" />
            <FloatingCube position={[0, 3, 0]} size={0.5} color="#00ffff" />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            className="events-title text-5xl md:text-7xl font-bold mb-6"
            style={{ y }}
          >
            Our <span className="gradient-text">Events</span>
          </motion.h1>
          
          <motion.p 
            className="events-subtitle text-xl md:text-2xl text-space-600 dark:text-space-300 mb-8"
            style={{ y }}
          >
            Join us for exciting workshops, hackathons, conferences, and networking events 
            that will accelerate your tech career and expand your knowledge.
          </motion.p>
        </div>
      </section>

      {/* Featured Event Section */}
      <section className="py-20 bg-gradient-to-br from-space-50 to-space-100 dark:from-space-800 dark:to-space-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured <span className="gradient-text">Event</span>
            </h2>
            <p className="text-xl text-space-600 dark:text-space-300 max-w-3xl mx-auto">
              Don't miss our biggest event of the year - the Tech Innovation Summit 2024!
            </p>
          </motion.div>

          {upcomingEvents.filter(event => event.featured===1).map((event) => (
            <motion.div
              key={event.id}
              className="event-card bg-white dark:bg-space-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -10 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-neon-cyan text-white text-sm font-semibold rounded-full">
                      {event.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-space-900 dark:text-space-50 mb-4">
                    {event.title}
                  </h3>
                  <p className="text-space-600 dark:text-space-300 mb-6">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-space-600 dark:text-space-300">
                      <Calendar className="w-5 h-5 mr-3 text-neon-cyan" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-space-600 dark:text-space-300">
                      <Clock className="w-5 h-5 mr-3 text-neon-cyan" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-space-600 dark:text-space-300">
                      <MapPin className="w-5 h-5 mr-3 text-neon-cyan" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-space-600 dark:text-space-300">
                      <Users className="w-5 h-5 mr-3 text-neon-cyan" />
                      <span>{event.registered}/{event.capacity} registered</span>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  {timeLeft[event.id] && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-space-700 dark:text-space-300 mb-3">
                        EVENT STARTS IN:
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(timeLeft[event.id]).map(([unit, value]) => (
                          <div key={unit} className="text-center">
                            <div className="bg-neon-cyan text-white text-xl font-bold rounded-lg p-2">
                              {value.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xs text-space-500 dark:text-space-400 mt-1">
                              {unit.toUpperCase()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.split(',').map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-violet text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Register Now
                    <ArrowRight className="inline ml-2 w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Event <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-xl text-space-600 dark:text-space-300 max-w-3xl mx-auto">
              Explore different types of events we organize throughout the year.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {eventTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="p-6 rounded-xl bg-white dark:bg-space-800 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="flex justify-center mb-4">
                  <type.icon className="w-12 h-12 text-neon-cyan" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-space-900 dark:text-space-50">
                  {type.name}
                </h3>
                <p className="text-2xl font-bold text-neon-cyan">
                  {type.count}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-gradient-to-br from-space-50 to-space-100 dark:from-space-800 dark:to-space-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p className="text-xl text-space-600 dark:text-space-300 max-w-3xl mx-auto">
              Mark your calendar for these exciting upcoming events.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.filter(event => !event.featured).map((event, index) => (
              <motion.div
                key={event.id}
                className="event-card bg-white dark:bg-space-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-neon-cyan text-white text-sm font-semibold rounded-full">
                      {event.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-space-900 dark:text-space-50 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-space-600 dark:text-space-300 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-space-600 dark:text-space-300">
                      <Calendar className="w-4 h-4 mr-2 text-neon-cyan" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-space-600 dark:text-space-300">
                      <MapPin className="w-4 h-4 mr-2 text-neon-cyan" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-space-600 dark:text-space-300">
                      <Users className="w-4 h-4 mr-2 text-neon-cyan" />
                      <span>{event.registered}/{event.capacity}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-violet text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300"
                  >
                    Register
                    <ArrowRight className="inline ml-2 w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Past <span className="gradient-text">Events</span>
            </h2>
            <p className="text-xl text-space-600 dark:text-space-300 max-w-3xl mx-auto">
              Relive the amazing moments from our previous events.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-space-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-space-600 text-white text-sm font-semibold rounded-full">
                      {event.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-space-900 dark:text-space-50 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-space-600 dark:text-space-300 mb-4">
                    {event.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-space-500 dark:text-space-400">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-neon-cyan font-semibold">
                      {event.attendees} attendees
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-neon-cyan to-neon-violet">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Stay Updated
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-8"
          >
            Never miss an event! Subscribe to our newsletter and follow us on social media 
            to stay updated with our latest events and announcements.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-neon-cyan rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Subscribe to Newsletter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-neon-cyan transition-all duration-300"
            >
              Follow Us
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Events 