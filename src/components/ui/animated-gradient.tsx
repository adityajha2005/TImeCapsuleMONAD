"use client"

import React, { useEffect, useRef } from 'react'

const AnimatedGradient = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let width = window.innerWidth
    let height = window.innerHeight
    
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    
    window.addEventListener('resize', resize)
    resize()
    
    // Configuration
    const PARTICLE_COUNT = 50
    const PARTICLE_BASE_RADIUS = 50
    const PARTICLE_ADDITIONAL_RADIUS = 100
    const SPEED_FACTOR = 0.2
    
    // Create particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: PARTICLE_BASE_RADIUS + Math.random() * PARTICLE_ADDITIONAL_RADIUS,
      vx: (Math.random() - 0.5) * SPEED_FACTOR,
      vy: (Math.random() - 0.5) * SPEED_FACTOR,
      alpha: 0.1 + Math.random() * 0.4,
      color: Math.random() > 0.5 ? 
        `rgba(64, 156, 255, ${0.1 + Math.random() * 0.1})` : 
        `rgba(180, 64, 255, ${0.1 + Math.random() * 0.1})`
    }))
    
    const render = () => {
      // Clear canvas with a very dark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.01)'
      ctx.fillRect(0, 0, width, height)
      
      // Update and draw particles
      for (const particle of particles) {
        // Move particles
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1
        if (particle.y < 0 || particle.y > height) particle.vy *= -1
        
        // Draw gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        )
        
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
      
      requestAnimationFrame(render)
    }
    
    const animationId = requestAnimationFrame(render)
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ 
        background: 'radial-gradient(circle at center, rgba(16, 16, 28, 0.8) 0%, rgba(0, 0, 0, 1) 80%)'
      }}
    />
  )
}

export default AnimatedGradient