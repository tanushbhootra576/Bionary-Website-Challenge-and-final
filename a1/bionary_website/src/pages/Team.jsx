import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Twitter, Filter, Users, Award, Code, Palette, Search, Beaker, Settings } from 'lucide-react'
import { teamData, departments, batches } from '../data/team'
import { useTheme } from '../contexts/ThemeContext'

const TeamMemberCard = ({ member, onClick }) => {
  const { isDark } = useTheme()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`${
        isDark ? 'bg-space-800/50' : 'bg-white/70'
      } backdrop-blur rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl ${
        isDark ? 'hover:shadow-cyan-500/10' : 'hover:shadow-purple-500/20'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative w-32 h-32 mb-4">
          <img
            src={member.image}
            alt={member.name}
            className={`w-full h-full rounded-full object-cover ring-4 ${
              isDark ? 'ring-cyan-500/20' : 'ring-purple-500/30'
            }`}
          />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {member.name}
        </h3>
        <p className={`mb-2 ${isDark ? 'text-cyan-400' : 'text-purple-600'}`}>
          {member.role}
        </p>
        <p className={isDark ? 'text-space-400' : 'text-gray-600'}>
          {member.department}
        </p>
        
        <div className="flex gap-3 mt-4">
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                isDark ? 'text-space-400 hover:text-cyan-400' : 'text-gray-600 hover:text-purple-600'
              } transition-colors`}
              onClick={e => e.stopPropagation()}
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                isDark ? 'text-space-400 hover:text-cyan-400' : 'text-gray-600 hover:text-purple-600'
              } transition-colors`}
              onClick={e => e.stopPropagation()}
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {member.twitter && (
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                isDark ? 'text-space-400 hover:text-cyan-400' : 'text-gray-600 hover:text-purple-600'
              } transition-colors`}
              onClick={e => e.stopPropagation()}
            >
              <Twitter className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const Team = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedBatch, setSelectedBatch] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTeam, setFilteredTeam] = useState(teamData)
  const [selectedMember, setSelectedMember] = useState(null)
  const { isDark } = useTheme()

  useEffect(() => {
    let filtered = teamData

    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(member => member.department === selectedDepartment)
    }

    if (selectedBatch !== 'All') {
      filtered = filtered.filter(member => member.batch === selectedBatch)
    }

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredTeam(filtered)
  }, [selectedDepartment, selectedBatch, searchTerm])

  const getDepartmentIcon = (department) => {
    switch (department) {
      case 'Leadership': return Award
      case 'Development': return Code
      case 'Design': return Palette
      case 'Research': return Beaker
      case 'Operations': return Settings
      default: return Users
    }
  }

  return (
    <div className={`min-h-screen py-20 px-4 md:px-8 ${
      isDark 
        ? 'bg-space-900' 
        : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-5xl md:text-7xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600">Team</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}
        >
          Meet the innovators shaping the future of technology
        </motion.p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
            isDark 
              ? 'bg-space-800/30' 
              : 'bg-white'
          } backdrop-blur-lg rounded-2xl p-6 shadow-lg ${
            isDark 
              ? 'shadow-black/10' 
              : 'shadow-gray-200'
          }`}
        >
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                isDark 
                  ? 'bg-space-900/50 border-space-700 text-gray-100 placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              } focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
            />
          </div>

          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                isDark 
                  ? 'bg-space-900/50 border-space-700 text-gray-100' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              } focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none transition-all duration-200`}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Users className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                isDark 
                  ? 'bg-space-900/50 border-space-700 text-gray-100' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              } focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none transition-all duration-200`}
            >
              {batches.map(batch => (
                <option key={batch} value={batch}>
                  {batch === 'All' ? 'All Batches' : `Batch ${batch}`}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeam.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onClick={() => setSelectedMember(member)}
            />
          ))}
        </div>
      </div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${
                isDark ? 'bg-space-800' : 'bg-white'
              } rounded-xl p-8 max-w-2xl w-full shadow-xl`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className={`w-24 h-24 rounded-full object-cover ring-4 ${
                    isDark ? 'ring-cyan-500' : 'ring-purple-500'
                  }`}
                />
                <div>
                  <h3 className={`text-3xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedMember.name}
                  </h3>
                  <p className={isDark ? 'text-cyan-400' : 'text-purple-600'}>
                    {selectedMember.role}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className={`flex items-center space-x-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {React.createElement(getDepartmentIcon(selectedMember.department), { className: "w-5 h-5" })}
                  <span>{selectedMember.department}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map(skill => (
                    <span
                      key={skill}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDark 
                          ? 'bg-space-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4 mt-6">
                  {selectedMember.github && (
                    <a
                      href={selectedMember.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${
                        isDark 
                          ? 'text-gray-400 hover:text-cyan-400' 
                          : 'text-gray-600 hover:text-purple-600'
                      } transition-colors`}
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {selectedMember.linkedin && (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${
                        isDark 
                          ? 'text-gray-400 hover:text-cyan-400' 
                          : 'text-gray-600 hover:text-purple-600'
                      } transition-colors`}
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                  {selectedMember.twitter && (
                    <a
                      href={selectedMember.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${
                        isDark 
                          ? 'text-gray-400 hover:text-cyan-400' 
                          : 'text-gray-600 hover:text-purple-600'
                      } transition-colors`}
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Team 