import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// import { galleryData, galleryCategories } from '../data/gallery'
import { Filter, Search, X, ChevronLeft, ChevronRight, ZoomIn, Calendar } from 'lucide-react'

const API_URL = 'http://localhost:4000/api/gallery'

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [galleryData, setGalleryData] = useState([])
  const [filteredGallery, setFilteredGallery] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    // Fetch gallery from backend
    const fetchGallery = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')||''}` }
        })
        if (res.ok) {
          const data = await res.json()
          setGalleryData(data)
        } else {
          setGalleryData([])
        }
      } catch {
        setGalleryData([])
      }
    }
    fetchGallery()
  }, [])

  useEffect(() => {
    let filtered = galleryData
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    setFilteredGallery(filtered)
  }, [galleryData, selectedCategory, searchTerm])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const openLightbox = (image, index) => {
    setSelectedImage(image)
    setCurrentImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredGallery.length
    setCurrentImageIndex(nextIndex)
    setSelectedImage(filteredGallery[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = currentImageIndex === 0 ? filteredGallery.length - 1 : currentImageIndex - 1
    setCurrentImageIndex(prevIndex)
    setSelectedImage(filteredGallery[prevIndex])
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

  const itemVariants = {
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
              Our <span className="gradient-text">Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl text-space-600 dark:text-space-300 max-w-4xl mx-auto">
              Capturing the moments, memories, and milestones of the Bionary community. 
              Explore our journey through these visual stories.
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
                  placeholder="Search gallery..."
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
                  {/* galleryCategories.map(category => ( */}
                    <option key="All" value="All">
                      All Categories
                    </option>
                    {/* galleryCategories.map(category => ( */}
                    {/* <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option> */}
                  {/* ))} */}
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-center">
                <span className="text-space-600 dark:text-space-300">
                  {filteredGallery.length} image{filteredGallery.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${searchTerm}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
            >
              {filteredGallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  className="break-inside-avoid mb-4 group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl bg-white dark:bg-space-800 shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onClick={() => openLightbox(item, index)}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                          <p className="text-white/90 text-sm line-clamp-2">{item.description}</p>
                        </div>
                      </div>

                      {/* Zoom Icon */}
                      <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-neon-cyan/90 text-white text-xs font-medium rounded-full">
                        {item.category}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-space-900 dark:text-space-50 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-space-600 dark:text-space-300 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-space-500 dark:text-space-400 text-xs">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(item.date)}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {item.tags && item.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-space-100 dark:bg-space-700 text-space-700 dark:text-space-300 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags && item.tags.length > 2 && (
                            <span className="px-2 py-1 bg-neon-cyan/10 text-neon-cyan text-xs rounded-full">
                              +{item.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Results */}
          {filteredGallery.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-space-100 dark:bg-space-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ZoomIn className="w-8 h-8 text-space-400" />
              </div>
              <h3 className="text-xl font-semibold text-space-900 dark:text-space-50 mb-2">
                No images found
              </h3>
              <p className="text-space-600 dark:text-space-300">
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div className="relative max-w-6xl max-h-full">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Image */}
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                
                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  <h3 className="text-white font-semibold text-xl mb-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-white/90 mb-2">
                    {selectedImage.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">
                      {formatDate(selectedImage.date)}
                    </span>
                    <span className="px-3 py-1 bg-neon-cyan/90 text-white text-sm rounded-full">
                      {selectedImage.category}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm">
                  {currentImageIndex + 1} / {filteredGallery.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Gallery 