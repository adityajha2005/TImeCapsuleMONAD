/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
// import FloatingCapsule from './FloatingCapsule'
import FloatingCapsule from '@/components/three/FloatingCapsule'

export default function Scene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enableZoom={false} enablePan={false} />
        {/* @ts-ignore */}
        <ambientLight intensity={0.5} />
         {/* @ts-ignore */}
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FloatingCapsule />
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}