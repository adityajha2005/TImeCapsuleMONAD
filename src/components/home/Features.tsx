"use client"

import { motion } from "framer-motion"
import { 
  Clock, 
  Key, 
  Shield, 
  Trophy,
  MessageSquare,
  Image,
  FileText
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription,  } from "@/components/ui/card"
import GlobeComponent from "../Globe"

const Features = () => {
  const features = [
    {
      icon: <Clock className="h-10 w-10 text-cyan-500" />,
      title: "Time-Locked Content",
      description: "Lock your content until a specific date, block number, or trigger event occurs on the blockchain."
    },
    {
      icon: <Shield className="h-10 w-10 text-cyan-500" />,
      title: "Cryptographically Secure",
      description: "All capsule content is securely encrypted until unlock conditions are met."
    },
    {
      icon: <Trophy className="h-10 w-10 text-amber-500" />,
      title: "Reward Mechanisms",
      description: "Set rewards to be distributed when your capsule is opened or conditions are met."
    },
    {
      icon: <Key className="h-10 w-10 text-emerald-500" />,
      title: "Conditional Unlocking",
      description: "Create complex conditions for unlocking based on on-chain events or community votes."
    },
  ]

  const contentTypes = [
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-400" />,
      title: "Messages",
      description: "Leave notes for your future self or others"
    },
    {
      icon: <FileText className="h-6 w-6 text-cyan-400" />,
      title: "Predictions",
      description: "Record your forecasts about future events"
    },
    {
      icon: <Image className="h-6 w-6 text-teal-400" />,
      title: "Digital Art",
      description: "Store creative works to be revealed later"
    },
  ]

  // Animation variants for gradient overlay
  const gradientVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 0.1, 
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  }

  // Animation variants for section title
  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  }

  // Animation variants for cards
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  // Animation variants for content type cards
  const contentTypeVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  }

  

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-50 opacity-60"><GlobeComponent /></div>
       
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600 rounded-full filter blur-[128px]"/>
       
        <motion.div 
          
          variants={gradientVariants}
          initial="initial"
          animate="animate"
        />
      </div>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={titleVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-400">
                The Next Evolution
              </span>{" "}
              of Digital Time Capsules
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Combine social, creative, and game mechanics with blockchain permanence for 
              a truly unique way to connect past, present, and future.
            </p>
          </motion.div>

          {/* Main features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="relative bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 h-full">
                <div className=" absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"/>
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* What you can store */}
          <div className="mt-24 text-center">
            <motion.h3 
              className="text-2xl md:text-3xl font-bold mb-12 font-space-grotesk"
              variants={titleVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              What You Can Store In Your Time Capsule
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contentTypes.map((type, index) => (
                <motion.div
                  key={index}
                  variants={contentTypeVariants}
                  initial="initial"
                  whileInView="animate"
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-transparent to-stone-950 p-6 rounded-xl border border-white/5 relative hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className=" absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"/>
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center">
                      {type.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-medium mb-2">{type.title}</h4>
                  <p className="text-gray-400">{type.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features