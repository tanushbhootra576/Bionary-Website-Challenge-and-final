import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'

const AnimatedSphere = ({ position = [0, 0, 0], size = 1, color = '#00ffff' }) => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate the sphere
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      
      // Scale animation
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
      meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[size, 32, 32]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.6}
        metalness={0.8}
        roughness={0.2}
        wireframe={false}
      />
    </Sphere>
  )
}

export default AnimatedSphere 