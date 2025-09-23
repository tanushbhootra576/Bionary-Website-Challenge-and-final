import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text3D, Center } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedSphere from '../components/3d/AnimatedSphere'
import { Code, Zap, Users, Target, Award, Globe } from 'lucide-react'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  useEffect(() => {
    // GSAP animations
    gsap.fromTo('.about-title', 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )

    gsap.fromTo('.about-content',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
    )

    // Stagger animation for mission items
    gsap.fromTo('.mission-item',
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    )
  }, [])

  const values = [
    {
      icon: Code,
      title: "Innovation First",
      description: "We push the boundaries of what's possible through cutting-edge technology and creative problem-solving."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of teamwork and diverse perspectives to create groundbreaking solutions."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from code quality to user experience."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "We build solutions that make a positive impact on the world around us."
    }
  ]

  const achievements = [
    { number: "50+", label: "Projects Completed" },
    { number: "25+", label: "Awards Won" },
    { number: "150+", label: "Active Members" },
    { number: "100+", label: "Events Organized" }
  ]

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <AnimatedSphere position={[0, 0, 0]} size={2} color="#8b5cf6" />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            className="about-title text-5xl md:text-7xl font-bold mb-6"
            style={{ y }}
          >
            About <span className="gradient-text">Bionary</span>
          </motion.h1>
          
          <motion.p 
            className="about-content text-xl md:text-2xl text-space-600 dark:text-space-300 mb-8"
            style={{ y }}
          >
            We are a community of passionate technologists, innovators, and creators 
            dedicated to pushing the boundaries of what's possible through technology.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-space-50 to-space-100 dark:from-space-800 dark:to-space-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-xl text-space-600 dark:text-space-300 max-w-3xl mx-auto">
              To empower the next generation of tech leaders by providing hands-on experience, 
              mentorship, and opportunities to work on real-world projects that make a difference.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="mission-item p-6 rounded-xl bg-white dark:bg-space-800 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="flex justify-center mb-4">
                  <value.icon className="w-12 h-12 text-neon-cyan" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-space-900 dark:text-space-50">
                  {value.title}
                </h3>
                <p className="text-space-600 dark:text-space-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Our <span className="gradient-text">Story</span>
              </h2>
              <p className="text-lg text-space-600 dark:text-space-300 mb-6">
                Founded in 2020, Bionary started as a small group of passionate students 
                who wanted to create something meaningful. What began as a coding club has 
                evolved into a thriving community of innovators, entrepreneurs, and tech enthusiasts.
              </p>
              <p className="text-lg text-space-600 dark:text-space-300 mb-6">
                Today, we're proud to have helped launch dozens of successful projects, 
                connect students with industry leaders, and create opportunities that have 
                shaped careers and changed lives.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-violet text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join Our Journey
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 p-8">
                <div className="grid grid-cols-2 gap-8 h-full">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.label}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-3xl md:text-4xl font-bold text-neon-cyan mb-2">
                        {achievement.number}
                      </div>
                      <div className="text-space-600 dark:text-space-300 text-sm">
                        {achievement.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-r from-neon-cyan to-neon-violet">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Our Vision for the Future
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-8"
          >
            We envision a world where technology serves humanity, where innovation is accessible to all, 
            and where every student has the opportunity to build the future they want to see.
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
              Get Involved
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

export default About 