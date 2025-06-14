/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Capsule } from '@react-three/drei'
import * as THREE from 'three'

export default function FloatingCapsule() {
  const capsuleRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!capsuleRef.current) return
    capsuleRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1
    capsuleRef.current.rotation.y += 0.01
    capsuleRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  return (
    <Capsule ref={capsuleRef} args={[0.5, 1, 32]}>
{/* @ts-ignore */}
      <meshStandardMaterial
        color="#00ffff"
        metalness={0.8}
        roughness={0.2}
        emissive="#003333"
        emissiveIntensity={0.5}
      />
    </Capsule>
  )
}