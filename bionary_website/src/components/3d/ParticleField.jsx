import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleField = ({ count = 2000, size = 0.02, speed = 0.3 }) => {
  const mesh = useRef()
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() * 0.02
      const x = Math.random() * 2000 - 1000
      const y = Math.random() * 2000 - 1000
      const z = Math.random() * 2000 - 1000
      
      temp.push({ time, factor, speed, x, y, z })
    }
    return temp
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const time = state.clock.getElapsedTime()
    const positions = mesh.current.geometry.attributes.position.array
    particles.forEach((particle, i) => {
      particle.time += particle.speed
      particle.factor += particle.speed
      const idx = i * 3
      positions[idx] = particle.x + Math.cos(particle.time) * particle.factor
      positions[idx + 1] = particle.y + Math.sin(particle.time) * particle.factor
      positions[idx + 2] = particle.z + Math.sin(particle.time) * particle.factor
      if (particle.factor > 100) {
        particle.factor = 0
      }
    })
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    particles.forEach((particle, i) => {
      positions[i * 3] = particle.x
      positions[i * 3 + 1] = particle.y
      positions[i * 3 + 2] = particle.z
    })
    return positions
  }, [particles, count])

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color="#00ffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

export default ParticleField 