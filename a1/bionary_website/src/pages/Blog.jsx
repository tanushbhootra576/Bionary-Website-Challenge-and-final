import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Calendar, User, Tag, ArrowRight, BookOpen } from 'lucide-react'

const API_URL = 'http://localhost:4000/api/blog'

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState([])
  const [blogPosts, setBlogPosts] = useState([])

  useEffect(() => {
    // Fetch blog posts from backend
    const fetchBlog = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')||''}` }
        })
        if (res.ok) {
          const data = await res.json()
          setBlogPosts(data)
        } else {
          setBlogPosts([])
        }
      } catch {
        setBlogPosts([])
      }
    }
    fetchBlog()
  }, [])

  useEffect(() => {
    let filtered = blogPosts
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.tags && post.tags.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    setFilteredPosts(filtered)
  }, [blogPosts, selectedCategory, searchTerm])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-space-600 dark:text-space-300 max-w-4xl mx-auto">
              Insights, tutorials, and thoughts from the Bionary community. 
              Stay updated with the latest in technology and development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-space-800 rounded-xl p-6 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-space-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-space-200 dark:border-space-700 rounded-lg bg-space-50 dark:bg-space-900 text-space-900 dark:text-space-100 focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-space-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-space-200 dark:border-space-700 rounded-lg bg-space-50 dark:bg-space-900 text-space-900 dark:text-space-100 focus:ring-2 focus:ring-neon-cyan focus:border-transparent appearance-none"
                >
                  {['All', 'Web Development', 'AI/ML', 'Backend', 'Design', 'Mobile Development', 'Security'].map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-center">
                <span className="text-space-600 dark:text-space-300">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${searchTerm}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={cardVariants}
                  layout
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-space-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Article Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-neon-cyan/90 text-white text-xs font-medium rounded-full">
                      {post.category}
                    </div>

                    {/* Read Time */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-space-800/90 backdrop-blur-sm text-xs font-medium rounded-full">
                      {post.readTime}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-space-900 dark:text-space-50 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-space-600 dark:text-space-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags && post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-space-100 dark:bg-space-700 text-space-700 dark:text-space-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags && post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-neon-cyan/10 text-neon-cyan text-xs rounded-full">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-space-500 dark:text-space-400 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.date)}
                      </div>
                    </div>

                    {/* Read More Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-2 border border-neon-cyan text-neon-cyan rounded-lg font-medium hover:bg-neon-cyan hover:text-white transition-colors duration-200 flex items-center justify-center"
                    >
                      Read Article
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <BookOpen className="w-16 h-16 text-space-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-space-900 dark:text-space-50 mb-2">
                No articles found
              </h3>
              <p className="text-space-600 dark:text-space-300">
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Blog 