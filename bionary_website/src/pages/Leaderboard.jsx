import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FloatingCube from "../components/3d/FloatingCube";
import { API_URL } from '../../url.js';

const TABLE_HEAD = ["Rank", "Name", "Department", "Points"];

const Leaderboard = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const containerRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('score');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit), sortBy, order });
        const res = await fetch(`${API_URL}/leaderboard?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setRows(json.data || []);
          setTotal(json.total || 0);
        } else {
          setRows([]);
          setTotal(0);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setRows([]);
        setTotal(0);
      }
    };
    fetchLeaderboard();
  }, [page, limit, sortBy, order]);

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
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
            style={{ y }}
          >
            Our <span className="gradient-text">Leaderboard</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-space-600 dark:text-space-300 mb-8"
            style={{ y }}
          >
            See the top performers in our club!
          </motion.p>
        </div>
      </section>


      {/* Leaderboard Table Section */}
      <section className="py-20 bg-gradient-to-br from-space-800 to-space-900 w-full flex justify-center">
        <div className="dark:bg-space-900 bg-space-400 overflow-hidden w-[85%] rounded-md p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full overflow-x-auto"
          >
            <table className="w-full min-w-max table-auto text-center border-collapse">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => {
                    // map header to sort key
                    const keyMap = head === 'Rank' ? 'score' : head === 'Points' ? 'score' : head === 'Name' ? 'name' : 'department';
                    const active = sortBy === keyMap;
                    return (
                      <th
                        key={head}
                        className="border-b-2 border-black dark:border-white pb-4 pt-2 px-4 md:px-6 text-2xl md:text-4xl gradient-text"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span>{head}</span>
                          {/* text filters removed as requested */}

                          {/* universal sort button for each header */}
                          <button
                            onClick={() => { setSortBy(keyMap); setOrder(active ? (order === 'desc' ? 'asc' : 'desc') : 'desc'); setPage(1); }}
                            aria-label={active && order === 'desc' ? 'Sort ascending' : 'Sort descending'}
                            title={active && order === 'desc' ? 'Sort ascending' : 'Sort descending'}
                            className="ml-2 p-1 rounded bg-white/5 flex items-center justify-center"
                          >
                            {/* show direction based on current order for active column, otherwise show neutral down arrow */}
                            {active && order === 'asc' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
                                <path d="M6 15l6-6 6 6" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-neon-cyan ${active ? '' : 'opacity-60'}`}>
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-space-600 dark:text-space-300">
                      No leaderboard data available.
                    </td>
                  </tr>
                ) : (
                  rows.map(({ name, department, score, rank }, index) => {
                    const isLast = index === rows.length - 1;
                    const classes = isLast
                      ? "py-4 px-4 md:px-6"
                      : "py-4 px-4 md:px-6 border-b border-gray-300 dark:border-gray-700";

                    return (
                      <tr
                        key={`${rank}-${name}-${index}`}
                        className="transition-colors hover:bg-neon-cyan/10 dark:hover:bg-neon-cyan/10"
                      >
                        <td className={classes}>{rank}</td>
                        <td className={classes}>{name}</td>
                        <td className={classes}>{department}</td>
                        <td className={classes}>{score ?? 0}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </motion.div>
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-space-300">Showing {(page - 1) * limit + 1} - {Math.min(total, page * limit)} of {total}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-white/10">Prev</button>
              <div className="px-3 py-1">Page {page}</div>
              <button onClick={() => setPage(p => (p * limit < total ? p + 1 : p))} className="px-3 py-1 rounded bg-white/10">Next</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Leaderboard;
