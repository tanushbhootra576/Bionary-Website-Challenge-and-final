import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FloatingCube from "../components/3d/FloatingCube";
import {API_URL} from '../../url.js'

const Departments = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const [departments, setDepartments] = useState([])
  
    useEffect(() => {
      // Fetch departments from backend
      const fetchDepartments = async () => {
        try {
          const res = await fetch(API_URL+'/departments')
          if (res.ok) {
            const data = await res.json()
            setDepartments(data.departmentsData)
          } else {
            setDepartments([])
          }
        } catch {
          setDepartments([])
        }
      }
      fetchDepartments()
    }, [])
  
  return (
    <div className="min-h-screen">
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
            Our <span className="gradient-text">Departments</span>
          </motion.h1>

          <motion.p
            className="events-subtitle text-xl md:text-2xl text-space-600 dark:text-space-300 mb-8"
            style={{ y }}
          >
            Our various departments work in various frontiers with cutting edge
            technology, as well as plan, manage, and advertise our events.
          </motion.p>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-br from-space-50 to-space-100 dark:from-space-800 dark:to-space-900 flex flex-col gap-20 w-full">
        {departments.length>0 && departments.map((department, id) => (
          <div className="w-3/4 mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              key={id}
              className="event-card bg-white dark:bg-space-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -10 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <img
                    src={department.image}
                    alt={department.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-neon-cyan text-white text-sm font-semibold rounded-full">
                      {department.type}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-3xl font-bold text-space-900 dark:text-space-50 mb-4 gradient-text">
                    {department.name}
                  </h3>
                  <p className="text-space-600 dark:text-space-300 mb-6">
                    {department.description}
                  </p>
                  <div className="flex flex-row gap-8 text-center">
                    {department.leads? department.leads.map((lead, id1) => 
                    <div className="flex flex-col gap-2" key={id*10+id1}>
                      <h3 className="gradient-text bold">{lead.title}</h3>
                      <h4 className="bold">{lead.name}</h4>
                      <img
                        src={lead.image}
                        alt={lead.name}
                        width={"60px"}
                        height={"60px"}
                      />
                    </div>) : <></>}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Departments;
