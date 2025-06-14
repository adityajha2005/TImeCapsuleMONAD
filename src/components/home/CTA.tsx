"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Image from "next/image"

const CTA = () => {
  // Animation variants for gradient overlay
  const gradientVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 0.1, 
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  }

  // Animation variants for buttons
  const buttonVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  }

  // Animation variants for the coming soon section
  const comingSoonVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8 }
    }
  }

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="flex justify-center items-center absolute inset-0 opacity-60">
        <Image src="https://cdn.multiversx.com/webflow/sidechains.webp" width={2200} height={720} alt="" loading="lazy" className="flex justify-center items-center"/>

      </div>
      <div className="absolute inset-0 opacity-10">
        <div  className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600 rounded-full filter blur-[128px]" />
        <motion.div 
          variants={gradientVariants}
          initial="initial"
          animate="animate"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-space-grotesk">
            Ready to Create Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-200">
              Digital Legacy?
            </span>
          </h2>
          
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of users preserving memories, predictions, and digital assets
            for future revelation. Your story deserves to be told—even if that story 
            is meant for tomorrow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:text-white hover:from-cyan-600 hover:to-cyan-700">
                Start Creating Now
              </Button>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: 0.2 }}
            >
              <Button size="lg" variant="outline" className="border-cyan-500/50 hover:border-cyan-500">
                <Mail className="mr-2 h-4 w-4" />
                Join Waitlist
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            variants={comingSoonVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="relative bg-black/70 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 h-full"
          >
            <div className=" absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"/>
            <motion.p 
              className="text-cyan-400 font-medium mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              COMING SOON
            </motion.p>
            <h3 className="text-xl font-bold mb-4">Mass Revelation Event - New Year&apos;s 2026</h3>
            <p className="text-gray-400">
              Join our biggest capsule opening event yet! Thousands of time capsules will unlock 
              simultaneously as we enter 2026. Mint a unique NFT capsule and add your messages, art, predictions, or secrets.
            </p>
            <motion.div 
              className="mt-4 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="inline-block bg-slate-800 px-3 py-1 rounded-full text-xs text-gray-300">
                238 days remaining
              </div>
              
            </motion.div>
           
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA