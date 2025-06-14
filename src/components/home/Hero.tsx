"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Lock, Unlock, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Scene from "@/components/three/Scene"

const Hero = () => {
  const [showSecret, setShowSecret] = useState(false)
  const router = useRouter()
  
  const [animatedValues, setAnimatedValues] = useState({
    avgCost: 0,
    totalTransactions: 0,
    validatorNodes: 0
  })

  // Target values
  const targetValues = {
    avgCost: 0.002,
    totalTransactions: 52429713,
    validatorNodes: 3603
  }

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeProgress = 1 - Math.pow(1 - progress, 3) // ease-out cubic

      setAnimatedValues({
        avgCost: targetValues.avgCost * easeProgress,
        totalTransactions: Math.floor(targetValues.totalTransactions * easeProgress),
        validatorNodes: Math.floor(targetValues.validatorNodes * easeProgress)
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues(targetValues) // Ensure exact final values
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.3 }
    }
  }

  // Animation variants for gradient overlays
  const gradientVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 0.5, 
      scale: 1,
      transition: { 
        duration: 1.2,
        ease: "easeOut"
      }
    }
  }

  // Animation variants for buttons
  const buttonVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
    
  }
   // Random positions for background images
  const imagePositions = [
    { top: "10%", left: "15%", rotate: "-10deg", width: 300, height: 300 },
    { top: "70%", left: "80%", rotate: "15deg", width: 250, height: 250 },
    { top: "30%", left: "75%", rotate: "5deg", width: 200, height: 200 }
  ]


  return (
    <div className="relative min-h-screen  flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Three.js Background */}
      
      <Scene />
      
      
     {[
        "https://cdn.multiversx.com/webflow/Hero%20section%20background.webp",
        "https://cdn.multiversx.com/webflow/Home-Hero-Bg-03.webp",
        "https://cdn.multiversx.com/webflow/Glass%20shield%404-1080x1080%201.webp"
      ].map((src, index) => (
        <motion.div
          key={src}
          className="absolute"
          style={{
            top: imagePositions[index].top,
            left: imagePositions[index].left,
            transform: `rotate(${imagePositions[index].rotate})`
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1, delay: index * 0.2 }}
        >
          <Image
            src={src}
            alt={`Hero Background ${index + 1}`}
            width={imagePositions[index].width}
            height={imagePositions[index].height}
            className="object-contain"
            priority={index === 0} // Prioritize first image for faster loading
          />
        </motion.div>
      ))}
      {/* Gradient Overlays with Animation */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 gradient-blur"
          variants={gradientVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 gradient-blur"
          variants={gradientVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
        />
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-space-grotesk leading-tight mb-6">
            Your Digital Legacy, <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-200">
              Locked in Time
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create blockchain time capsules containing messages, art, 
            predictions, or secrets.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Button 
                size="lg" 
                className="bg-cyan-400 hover:bg-cyan-600 hover:text-white text-black font-semibold group transition-all duration-300" onClick={() => router.push("/create")}
              >
                Create Your Capsule
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: 0.3 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-500/5 hover:text-white transition-all duration-300"
              >
                Explore Capsules
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Interactive Capsule Preview with Enhanced Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto"
        >
          <div className="relative mx-auto w-full max-w-md aspect-[1/1.2] bg-black rounded-2xl p-1 group hover:scale-105 transition-transform duration-500">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-300/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"
              animate={{ 
                opacity: [0.5, 0.7, 0.5],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <div className="relative h-full w-full bg-black rounded-xl overflow-hidden border border-cyan-500/10 flex flex-col">
              <div className="bg-black/50 backdrop-blur-sm p-4 border-b border-cyan-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className="h-3 w-3 rounded-full bg-cyan-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-sm text-gray-400">Capsule #42069</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Unlocks: 2025-12-31
                  </div>
                </div>
              </div>
              
              
              <div className="flex-1 p-6 flex flex-col items-center justify-center">
                {showSecret ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                  >
                    <Unlock className="h-10 w-10 mx-auto mb-4 text-cyan-400" />
                    <h3 className="text-xl font-medium mb-2">Message Revealed!</h3>
                    <p className="text-gray-300">
                      &quot; In 2025, ETH will reach $25,000 and transform global finance. &quot;
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                  >
                    <Lock className="h-10 w-10 mx-auto mb-4 text-cyan-500" />
                    <h3 className="text-xl font-medium mb-2">Locked Message</h3>
                    <p className="text-gray-400">
                      Content is encrypted and will be revealed on unlock date
                    </p>
                  </motion.div>
                )}
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm p-4 border-t border-cyan-500/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Created by: 0x71...9f3d</span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-black/20"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      Unlock
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
            
          </div>
            <motion.div
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      className="  sm:absolute bottom-1/2 left-[150px] transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md  group"
                    >
                      <div className=" relative bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 h-full">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                          <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                            Average Cost
                          </div>
                         
                          <div className="text-4xl md:text-5xl font-bold text-cyan-400 font-mono">
                            ~${animatedValues.avgCost.toFixed(3)}
                          </div>
                        </div>
          
                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full opacity-60" />
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-300 rounded-full opacity-40" />
                      </div>
            </motion.div>
            <motion.div
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        transition={{ delay: 0.1 }}
                        className="  absolute bottom-[25%] left-[130px] transform -translate-x-1/2 -translate-y-1/3  w-full max-w-md  group"
                      >
                        <div className="relative bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 h-full">
                          {/* Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="relative z-10">
                            <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                              Total Capsules
                            </div>
                            <div className="text-gray-500 text-sm mb-4">
                                On our Chain
                            </div>
                            <div className="text-4xl md:text-5xl font-bold text-cyan-400 font-mono leading-tight">
                              {formatNumber(animatedValues.totalTransactions)}
                            </div>
                          </div>
            
                          {/* Decorative Elements */}
                          <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full opacity-60" />
                          <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-300 rounded-full opacity-40" />
                        </div>
            </motion.div>
      <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ delay: 0.2 }}
            className="absolute bottom-1/2 right-[-300px] transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md  group"
          >
            <div className="relative bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 h-full">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="text-gray-400 text-sm font-medium mb-6 uppercase tracking-wider">
                  Validator Nodes
                </div>
                <div className="text-4xl md:text-5xl font-bold text-cyan-400 font-mono">
                  {formatNumber(animatedValues.validatorNodes)}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full opacity-60" />
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-300 rounded-full opacity-40" />
            </div>
          </motion.div>
            <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-[25%] right-[-300px] transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md  group"
        >
          <div className="relative group">
            <div className="relative bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-full px-8 py-4 flex items-center space-x-4">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex items-center space-x-4">
                <div className="text-gray-400 text-sm">
                  Efficient. Scalable. Global.
                </div>
                <div className="text-2xl font-bold text-green-400">
                  Carbon Neutral
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30 cursor-pointer hover:bg-green-500/30 transition-colors"
                >
                  Sustainability 
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
        <motion.span 
          className="text-gray-400 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Scroll to explore
        </motion.span>
        <div className="w-6 h-9 border-2 border-cyan-500/30 rounded-full flex justify-center pt-1">
          <motion.div 
            animate={{ 
              y: [0, 12, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5 
            }}
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero