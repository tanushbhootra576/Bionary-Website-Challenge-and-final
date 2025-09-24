import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'
import { navItems } from './NavItems'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/bionary' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/bionary' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/bionary' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@bionary.com' },
  ]



  return (
    <footer className="bg-space-900 dark:bg-space-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 mb-4"
            >
              <Zap className="w-8 h-8 text-neon-cyan" />
              <span className="text-2xl font-bold font-display gradient-text">
                Bionary
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-space-300 max-w-md"
            >
              Empowering the next generation of innovators through technology, 
              collaboration, and cutting-edge development. Join us in shaping 
              the future of tech.
            </motion.p>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg font-semibold mb-4"
            >
              Quick Links
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              {navItems.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-space-300 hover:text-neon-cyan transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Social Links */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg font-semibold mb-4"
            >
              Connect With Us
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex space-x-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-space-800 hover:bg-space-700 transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="border-t border-space-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-space-400 text-sm">
            © {currentYear} Bionary Tech Club. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-space-400 text-sm mt-2 md:mt-0">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart className="w-4 h-4 text-red-500" />
            </motion.div>
            <span>by the Bionary team</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer 