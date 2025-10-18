import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FloatingCube from '../components/3d/FloatingCube'
import { Linkedin, Github } from 'lucide-react'
import { API_URL } from '../../url.js'
import { teamData as localTeamData } from '../teamData'
import { useTheme } from '../contexts/ThemeContext'

gsap.registerPlugin(ScrollTrigger)

const Team = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const { isDark } = useTheme()

  // filters/search
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('None')
  const [batchFilter, setBatchFilter] = useState('All')

  const fetchTeam = async () => {
    setLoading(true)
    setUsingFallback(false)
    try {
      const res = await fetch(API_URL + '/team')
      if (res.ok) {
        const data = await res.json()
        //  console.log(data);

        setTeam(Array.isArray(data) ? data : [])
        setUsingFallback(false)
      } else {
        console.warn('Team fetch failed, using local fallback data', res.status)
        setTeam(localTeamData)
        setUsingFallback(true)
      }
    } catch (err) {
      console.error('Error fetching team, falling back to local data', err)
      setTeam(localTeamData)
      setUsingFallback(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [])

  // Split leads vs others
  const leadRegex = /lead|president|head|chair/i
  // build leads by iterating the team array in its original order so DB order is preserved
  const leads = useMemo(() => {
    const out = []
    for (let i = 0; i < team.length; i++) {
      const m = team[i]
      if (leadRegex.test(m.role || '') || (m.department || '').toLowerCase() === 'leadership') {
        out.push(m)
      }
    }
    // ensure presidents appear first (preserve DB order within groups)
    const presRegex = /president/i
    const presidents = out.filter(m => presRegex.test(m.role || ''))
    const otherLeads = out.filter(m => !presRegex.test(m.role || ''))
    return [...presidents, ...otherLeads]
  }, [team])
  // prefer MongoDB _id when available, fallback to id (local data) or generated key
  const leadIds = useMemo(() => new Set(leads.map(l => l._id ?? l.id ?? `${l.name}`)), [leads])
  const others = useMemo(() => team.filter(m => !leadIds.has(m._id ?? m.id ?? `${m.name}`)), [team, leadIds])

  // Filter options
  const departments = useMemo(() => ['All', ...new Set(team.map(t => t.department || 'Other'))], [team])
  const batches = useMemo(
    () => ['All', ...Array.from(new Set(team.map(t => t.batch).filter(Boolean))).sort((a, b) => a - b)],
    [team]
  )

  const normalize = (s = '') => s.toLowerCase()
  const matchesSearch = member => {
    const q = normalize(searchTerm).trim()
    if (!q) return true
    return (
      normalize(member.name).includes(q) ||
      normalize(member.role).includes(q) ||
      (member.skills || []).some(s => normalize(s).includes(q)) ||
      (member.bio || '').toLowerCase().includes(q)
    )
  }

  const matchesFilters = member => {
    if (departmentFilter !== 'All' && (member.department || 'Other') !== departmentFilter) return false
    if (batchFilter !== 'All' && String(member.batch) !== String(batchFilter)) return false
    return true
  }

  const filterMember = m => matchesSearch(m) && matchesFilters(m)
  // Leads should be visible initially regardless of departmentFilter (but still match search and batch)
  const filteredLeads = useMemo(() =>
    leads.filter(l => matchesSearch(l) && (batchFilter === 'All' || String(l.batch) === String(batchFilter)))
    , [leads, searchTerm, batchFilter])
  const filteredOthers = useMemo(() => others.filter(filterMember), [others, searchTerm, departmentFilter, batchFilter])
  // (no per-department collapse state: we render filteredOthers directly)

  return (
    <div ref={containerRef} className="min-h-screen">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ y }}>
            Meet Our <span className="gradient-text">Team</span>
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-space-600 dark:text-space-300 mb-8" style={{ y }}>
            Passionate innovators, designers, and developers building the future of technology together.
          </motion.p>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-gradient-to-br from-space-50 to-space-100 dark:from-space-800 dark:to-space-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our <span className="gradient-text">Core Members</span></h2>
            <p className="text-xl text-space-600 dark:text-space-300 max-w-3xl mx-auto">The brilliant minds who make everything possible.</p>
          </motion.div>

          {loading ? (
            <p className="text-center text-space-600 dark:text-space-300">Loading team members...</p>
          ) : (
            <>
              {/* Fallback banner when using local data */}
              {usingFallback && (
                <div className="mb-6 px-4 py-3 rounded-md bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200 flex items-center justify-between">
                  <div>
                    <strong>Using local sample data.</strong> The backend API appears unavailable.
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => fetchTeam()} className="px-3 py-1 rounded bg-yellow-200 dark:bg-yellow-700 text-sm">Retry API</button>
                    <button onClick={() => setUsingFallback(false)} className="px-3 py-1 rounded bg-transparent border text-sm">Dismiss</button>
                  </div>
                </div>
              )}

              {/* Search & Filters */}
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <input
                    aria-label="Search team members"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by name, role, skill or bio..."
                    className="w-full md:max-w-lg px-4 py-3 rounded-lg border border-gray-200 dark:border-space-700 bg-white dark:bg-space-800 text-space-900 dark:text-space-50 shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-space-700 bg-white dark:bg-space-800 text-sm">
                    {departments.map(d => (<option key={d} value={d}>{d}</option>))}
                  </select>
                  <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-space-700 bg-white dark:bg-space-800 text-sm">
                    {batches.map(b => (<option key={b} value={b}>{b}</option>))}
                  </select>
                  <button onClick={() => { setSearchTerm(''); setDepartmentFilter('All'); setBatchFilter('All') }} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-space-700 text-sm">
                    Reset
                  </button>
                </div>
              </div>

              {/* Leads */}
              {filteredLeads.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Leads & Core</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredLeads.map((member, index) => (
                      <motion.div
                        key={member._id ?? member.id ?? `${member.name}-${index}`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="relative bg-white dark:bg-space-800 rounded-2xl overflow-hidden shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-44 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-space-800 dark:to-space-900">
                          <img src={member.image || '/placeholder.jpg'} alt={member.name} className="w-full h-full object-cover opacity-30" />
                          <div className="absolute left-6 -bottom-10">
                            <img src={member.image || '/placeholder.jpg'} alt={member.name} className="w-28 h-28 rounded-full object-cover ring-4 ring-white dark:ring-space-800 shadow-lg" />
                          </div>
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-black/20 dark:bg-white/5 text-white hover:text-neon-cyan transition-colors"><Github className="w-5 h-5" /></a>}
                            {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-black/20 dark:bg-white/5 text-white hover:text-neon-cyan transition-colors"><Linkedin className="w-5 h-5" /></a>}
                          </div>
                        </div>

                        <div className="p-6 pt-12">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-2xl font-semibold text-space-900 dark:text-space-50 mb-1 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-pink inline-block">{member.name}</h3>
                              <div className="text-sm text-space-600 dark:text-space-300">{member.role}</div>
                            </div>
                            <div className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-space-700 text-gray-900 dark:text-space-50 font-medium shadow-sm">Batch {member.batch}</div>
                          </div>
                          <p className="text-space-600 dark:text-space-300 text-sm mt-4 line-clamp-3">{member.bio || 'No bio available.'}</p>
                          <div className="mt-4 flex flex-wrap gap-2">{(member.skills || []).slice(0, 4).map(skill => (<span key={skill} className={`px-3 py-1 text-xs rounded-full border ${isDark ? 'bg-white/5 text-white border-white/5' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>{skill}</span>))}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Others grouped by department */}
              <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-6">Other Members</h3>
                {/* Department quick-filter buttons (simplified) */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {departments.filter(d => d !== 'All').map(d => (
                    <button
                      key={d}
                      onClick={() => setDepartmentFilter(d)}
                      className={`px-3 py-1 rounded-full text-sm ${departmentFilter === d ? 'bg-neon-cyan text-white' : 'bg-gray-100 dark:bg-space-700 text-space-900 dark:text-space-50'}`}>
                      {d}
                    </button>
                  ))}
                  <button onClick={() => setDepartmentFilter('All')} className="px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-space-700">All</button>
                  <button onClick={() => setDepartmentFilter('None')} className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-space-700">None</button>
                </div>

                {/* Render all filtered other members in a single grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredOthers.map((member, idx) => (
                    <motion.div
                      key={member._id ?? member.id ?? `${member.name}-${idx}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.04 }}
                      whileHover={{ y: -6, scale: 1.01 }}
                      className="relative bg-white dark:bg-space-800 rounded-xl overflow-hidden shadow-md transition-all duration-200 p-4 flex items-center gap-4"
                    >
                      <img src={member.image || '/placeholder.jpg'} alt={member.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-white dark:ring-space-800 shadow" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-space-900 dark:text-space-50">{member.name}</div>
                            <div className="text-sm text-space-600 dark:text-space-300">{member.role}</div>
                          </div>
                          <div className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-space-700 text-gray-900 dark:text-space-50">{member.batch}</div>
                        </div>
                        <div className="mt-2 text-sm text-space-600 dark:text-space-300 line-clamp-2">{member.bio}</div>
                        <div className="mt-3 flex items-center gap-2">
                          {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="p-1 rounded-full bg-black/10 dark:bg-white/5 text-space-700 dark:text-space-200"><Github className="w-4 h-4" /></a>}
                          {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="p-1 rounded-full bg-black/10 dark:bg-white/5 text-space-700 dark:text-space-200"><Linkedin className="w-4 h-4" /></a>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-neon-cyan to-neon-violet">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Our Team
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-xl text-white/90 mb-8">
            Want to collaborate and make an impact in tech? We’re always looking for passionate people.
          </motion.p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white text-neon-cyan rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Contact Us
          </motion.button>
        </div>
      </section>
    </div>
  )
}

export default Team
