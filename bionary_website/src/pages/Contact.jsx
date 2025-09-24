import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FloatingCube from '../components/3d/FloatingCube'
import { Mail, Phone, MapPin, Send, MessageSquare, Users, Globe, Clock, ArrowRight } from 'lucide-react'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // GSAP animations
    gsap.fromTo('.contact-title', 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )

    gsap.fromTo('.contact-subtitle',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
    )

    // Stagger animation for contact info
    gsap.fromTo('.contact-info',
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    )
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    
    // Show success message
    alert('Thank you for your message! We\'ll get back to you soon.')
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "hello@bionary.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "University Innovation Lab",
      description: "Room 301, Computer Science Building"
    },
    {
      icon: MessageSquare,
      title: "Social Media",
      value: "@bionary_tech",
      description: "Follow us for updates"
    }
  ]

  const departments = [
    {
      name: "General Inquiries",
      email: "info@bionary.com",
      description: "Questions about membership, events, and general information"
    },
    {
      name: "Technical Support",
      email: "tech@bionary.com",
      description: "Help with projects, workshops, and technical questions"
    },
    {
      name: "Partnerships",
      email: "partnerships@bionary.com",
      description: "Business partnerships, sponsorships, and collaborations"
    },
    {
      name: "Events",
      email: "events@bionary.com",
      description: "Event registration, logistics, and coordination"
    }
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
            <FloatingCube position={[-2, 1, 0]} size={0.4} color="#ec4899" />
            <FloatingCube position={[2, -1, 0]} size={0.3} color="#8b5cf6" />
            <FloatingCube position={[0, 3, 0]} size={0.5} color="#00ffff" />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            className="contact-title text-5xl md:text-7xl font-bold mb-6"
            style={{ y }}
          >
            Get in <span className="gradient-text">Touch</span>
          </motion.h1>
          
          <motion.p 
            className="contact-subtitle text-xl md:text-2xl text-space-600 dark:text-space-300 mb-8"
            style={{ y }}
          >
            Have questions? Want to collaborate? Ready to join our community? 
            We'd love to hear from you!
          </motion.p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-gradient-to-br from-space-50 to-space-100 dark:from-space-800 dark:to-space-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Contact <span className="gradient-text">Information</span>
            </h2>
            <p className="text-xl text-space-600 dark:text-space-300 max-w-3xl mx-auto">
              Multiple ways to reach us. Choose what works best for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
                             <motion.div
                 key={info.title}
                 className="contact-info p-6 rounded-xl bg-white dark:bg-space-800 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                 initial={{ opacity: 0, x: -100 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 whileHover={{ y: -10, scale: 1.02 }}
               >
                <div className="flex justify-center mb-4">
                  <info.icon className="w-12 h-12 text-neon-cyan" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-space-900 dark:text-space-50">
                  {info.title}
                </h3>
                <p className="text-lg font-bold text-neon-cyan mb-2">
                  {info.value}
                </p>
                <p className="text-space-600 dark:text-space-300 text-sm">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Send us a <span className="gradient-text">Message</span>
              </h2>
              <p className="text-lg text-space-600 dark:text-space-300 mb-8">
                Have a question or want to get involved? Fill out the form and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                {departments.map((dept, index) => (
                  <motion.div
                    key={dept.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-white dark:bg-space-800 shadow-md"
                  >
                    <h3 className="font-semibold text-space-900 dark:text-space-50 mb-1">
                      {dept.name}
                    </h3>
                    <p className="text-neon-cyan text-sm mb-2">
                      {dept.email}
                    </p>
                    <p className="text-sm text-space-600 dark:text-space-300">
                      {dept.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-space-800 rounded-2xl p-8 shadow-xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-space-700 dark:text-space-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-space-200 dark:border-space-700 rounded-lg bg-space-50 dark:bg-space-900 text-space-900 dark:text-space-100 focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-space-700 dark:text-space-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-space-200 dark:border-space-700 rounded-lg bg-space-50 dark:bg-space-900 text-space-900 dark:text-space-100 focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-space-700 dark:text-space-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-space-200 dark:border-space-700 rounded-lg bg-space-50 dark:bg-space-900 text-space-900 dark:text-space-100 focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all duration-300"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-space-700 dark:text-space-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-space-200 dark:border-space-700 rounded-lg bg-space-50 dark:bg-space-900 text-space-900 dark:text-space-100 focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-violet text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </div>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-space-50 to-space-100 dark:from-space-800 dark:to-space-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-space-600 dark:text-space-300">
              Quick answers to common questions about Bionary.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How can I join Bionary?",
                answer: "You can join Bionary by attending our orientation sessions, filling out our membership form, or reaching out to us directly. We welcome students from all backgrounds and skill levels."
              },
              {
                question: "What events do you organize?",
                answer: "We organize workshops, hackathons, tech talks, networking events, and competitions throughout the year. Check our events page for the latest schedule."
              },
              {
                question: "Do I need programming experience to join?",
                answer: "No! We welcome students at all skill levels. We have programs and mentorships for beginners, intermediate, and advanced developers."
              },
              {
                question: "How can companies partner with Bionary?",
                answer: "We're always open to partnerships! Companies can sponsor events, provide mentorship, offer internships, or collaborate on projects. Contact our partnerships team."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-space-800 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-space-900 dark:text-space-50 mb-3">
                  {faq.question}
                </h3>
                <p className="text-space-600 dark:text-space-300">
                  {faq.answer}
                </p>
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
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-8"
          >
            Join our community of innovators and start building the future with us.
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
              Join Bionary
              <ArrowRight className="inline ml-2 w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-neon-cyan transition-all duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact 