import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FloatingCube from "../components/3d/FloatingCube";
import { useTheme } from "../contexts/ThemeContext";
import { departments } from "../data/team";

const TABLE_HEAD = ["Rank", "Name", "Department"];

const Leaderboard = () => {
  const { isDark } = useTheme();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const containerRef = useRef(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Fetch leaderboard from backend
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/leaderboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')||''}` }
        })
        if (res.ok) {
          const data = await res.json();
          setRows(data);
        } else {
          setRows([{rank:1, name: 'a', department: 'web'}]);
        }
      } catch {
        setRows([]);
      }
    };
    fetchLeaderboard();
  }, []);

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
            Our <span className="gradient-text">Leaderboard</span>
          </motion.h1>

          <motion.p
            className="events-subtitle text-xl md:text-2xl text-space-600 dark:text-space-300 mb-8"
            style={{ y }}
          >
            See the top performers in our club!
          </motion.p>
        </div>
      </section>

      {/* Leaderboard Table Section */}
      <section className="py-20 bg-gradient-to-br from-space-800 to-space-900 w-full h-full rounded-lg overflow-hidden content-center text-center justify-center flex">
        <div className="dark:bg-space-900 bg-space-400 overflow-hidden w-1/2 self-center flex rounded-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 w-1/2 rounded-md block"
          >
            <table className="w-full min-w-max table-auto relative overflow-hidden text-center">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b-2 border-black dark:border-white pb-4 pt-10 px-10 gradient-text text-4xl"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-center">
                {rows.map(({ name, department }, index) => {
                  const isLast = index === rows.length - 1;
                  const rank = index+1;
                  const classes = isLast
                    ? "py-4"
                    : "py-4 border-b border-gray-300";

                  return (
                    <tr key={rank} className="hover:bg-gray-50">
                      <td className={classes}>{rank}</td>
                      <td className={classes}>{name}</td>
                      <td className={classes}>{department}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;
