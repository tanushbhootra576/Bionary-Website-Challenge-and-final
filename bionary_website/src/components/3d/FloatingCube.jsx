import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'

const FloatingCube = ({ position = [0, 0, 0], size = 0.5, color = '#00ffff' }) => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[size, size, size]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.8}
        metalness={0.8}
        roughness={0.2}
      />
    </Box>
  )
}

export default FloatingCube 