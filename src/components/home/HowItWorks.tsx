"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PencilLine, LockKeyhole, Clock, Unlock } from 'lucide-react'
import { useRouter } from 'next/navigation'

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [animationState, setAnimationState] = useState('idle')
  const router = useRouter();

  const steps = [
    {
      number: "01",
      title: "Create Your Capsule",
      description: "Mint a unique NFT capsule and add your messages, art, predictions, or secrets.",
      icon: <PencilLine className="h-6 w-6" />,
      color: "from-[#00D8FF] to-cyan-400"
    },
    {
      number: "02",
      title: "Lock With Conditions",
      description: "Set unlock conditions: a future date, block number, or community vote.",
      icon: <LockKeyhole className="h-6 w-6" />,
      color: "from-cyan-400 to-[#00D8FF]"
    },
    {
      number: "03",
      title: "Wait For Conditions",
      description: "Your content remains securely encrypted on-chain until conditions are met.",
      icon: <Clock className="h-6 w-6" />,
      color: "from-[#00D8FF] to-teal-400"
    },
    {
      number: "04",
      title: "Reveal To The World",
      description: "When unlocked, your capsule opens and contents are revealed to everyone.",
      icon: <Unlock className="h-6 w-6" />,
      color: "from-teal-400 to-[#00D8FF]"
    }
  ]

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex)
    setAnimationState('step' + (stepIndex + 1))
  }

  const CapsuleAnimation = () => {
    const isFirstStep = animationState === 'step1'
    const isLastStep = animationState === 'step4'

    return (
      <div className="relative w-full h-48 flex items-center justify-center mb-12">
        <motion.div
          className="relative w-32 h-20"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isLastStep ? [1, 1, 0] : (isFirstStep ? 1 : animationState !== 'idle' ? 1 : 0)
          }}
          transition={{ 
            duration: isFirstStep ? 0.8 : isLastStep ? 3 : 0, // Extended duration for step 4 to allow animation to complete
            ease: isFirstStep ? "easeIn" : isLastStep ? ["linear", "linear", "easeOut"] : "linear",
            times: isLastStep ? [0, 0.8, 1] : undefined // Delay fade-out until animation completes
          }}
        >
          {/* Base Capsule */}
          <motion.div
            className="absolute inset-0 rounded-full shadow-2xl shadow-[#01383C]/50 overflow-hidden"
            animate={{
              background: animationState === 'step3' 
                ? 'linear-gradient(to right, #1e8a7f, #1e75af)' // Darker blue for step 3
                : 'linear-gradient(to right, #00E5FF, #00B8D4)', // Brighter cyan-blue for other steps
              borderRadius: '9999px'
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Glossy finish with iridescent sheen */}
            <div 
              className="absolute inset-0 rounded-full" 
              style={{
                background: animationState === 'step3' 
                  ? 'linear-gradient(145deg, rgba(0, 229, 255, 0.2), rgba(255,255,255,0))' 
                  : 'linear-gradient(145deg, rgba(255,255,255,0.3), rgba(0, 229, 255, 0.1))',
                opacity: 0.6
              }} 
            />
            {/* Inner glow effect */}
            <motion.div
              animate={{ 
                opacity: animationState === 'step3' ? 0.9 : 0.6,
                boxShadow: animationState === 'step3' 
                  ? 'inset 0 0 12px rgba(59, 130, 246, 0.9)' 
                  : 'inset 0 0 10px rgba(0, 229, 255, 0.6)'
              }}
              transition={{ duration: 0.5 }}
              className="absolute inset-1 rounded-full"
            />
            {/* Outer glow ring */}
            <motion.div
              className="absolute -inset-1 border-2 rounded-full"
              animate={{ 
                borderColor: animationState === 'step3' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(0, 229, 255, 0.7)',
                boxShadow: animationState === 'step3' 
                  ? '0 0 15px rgba(59, 130, 246, 0.5)' 
                  : '0 0 15px rgba(0, 229, 255, 0.4)'
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* Step 2: Locking Animation */}
          <AnimatePresence>
            {animationState === 'step2' && (
              <>
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#1e8a7f] to-[#1e75af] z-10 rounded-l-full"
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: '0%' }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#1e8a7f] to-[#1e75af] z-10 rounded-r-full"
                />
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.1 }}
                  exit={{ scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  className="absolute -inset-1 border-2 border-[#00E5FF] rounded-full"
                />
              </>
            )}
          </AnimatePresence>

          {/* Step 3: Timer Animation */}
          <AnimatePresence>
            {animationState === 'step3' && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -top-10 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-[#00E5FF] text-black px-3 py-1 rounded-lg text-sm font-bold shadow-lg flex items-center">
                  <Clock className="inline w-4 h-4 mr-1" />
                  24:00
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#00E5FF]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 4: Unlocking Animation */}
          <AnimatePresence>
            {animationState === 'step4' && (
              <>
                <motion.div
                  initial={{ x: 0, rotate: 0 }}
                  animate={{ x: -40, rotate: -45 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#1e8a7f] to-[#1e75af] rounded-l-full shadow-lg z-20"
                />
                <motion.div
                  initial={{  x: 0, rotate: 0 }}
                  animate={{ x: 40, rotate: 45 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#1e8a7f] to-[#1e75af] rounded-r-full shadow-lg z-20"
                />
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{ 
                      x: Math.cos(i * Math.PI / 3) * 80,
                      y: Math.sin(i * Math.PI / 3) * 60 - 20,
                      scale: 1,
                      opacity: [0, 1, 1, 0],
                      rotate: 360
                    }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      i % 3 === 0 ? 'bg-[#00E5FF]' : 
                      i % 3 === 1 ? 'bg-cyan-300' : 'bg-teal-400'
                    } shadow-lg`} />
                  </motion.div>
                ))}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 2, opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="absolute inset-0 bg-[#00E5FF]/20 rounded-full blur-xl z-10"
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    )
  }

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D8FF]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#01383C]/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <CapsuleAnimation />
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
              How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D8FF] to-cyan-400">Works</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Creating and unlocking time capsules is easy with our streamlined process.
              Follow these simple steps to preserve your digital legacy.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D8FF]/30 via-[#00D8FF]/30 to-[#00D8FF]/30 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <Card 
                className={`bg-black/80 border-[#01383C] h-full relative overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#00D8FF]/50 hover:shadow-lg hover:shadow-[#01383C]/20 ${
                  activeStep === index ? 'border-[#00D8FF] shadow-lg shadow-[#00D8FF]/20' : ''
                }`}
                onClick={() => handleStepClick(index)}
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${step.color}`} />
                <CardContent className="pt-6 px-5">
                  <div className="mb-4 flex justify-between items-center">
                    <span className="text-4xl font-bold text-gray-600 font-space-grotesk">
                      {step.number}
                    </span>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-12 w-12 rounded-full bg-gradient-to-br from-[#01383C] to-black flex items-center justify-center border border-[#00D8FF]/20"
                    >
                      <div className="text-[#00D8FF]">
                        {step.icon}
                      </div>
                    </motion.div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-300 mb-4">{step.description}</p>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeStep === index ? 1 : 0 }}
                    className="text-[#00D8FF] text-sm font-medium"
                  >
                    Click to see animation →
                  </motion.div>
                </CardContent>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-br from-[#00D8FF]/5 to-transparent pointer-events-none"
                />
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#00D8FF] to-cyan-400 hover:from-cyan-400 hover:to-[#00D8FF] text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-[#00D8FF]/20 transition-all duration-300"
            onClick={() => router.push('/create')}
          >
            Create Your First Capsule
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks