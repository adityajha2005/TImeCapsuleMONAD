"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lock, Image, MessageSquare, Zap,  Users, Target } from 'lucide-react';

const CreateCapsule = () => {
  const [step, setStep] = useState(1);
  const [capsuleData, setCapsuleData] = useState({
    title: '',
    message: '',
    type: 'message',
    lockType: 'time',
    unlockDate: '',
    blockNumber: '',
    condition: '',
    isPrivate: false,
    attachments: []
  });

  const capsuleTypes = [
    { id: 'message', label: 'Message', icon: MessageSquare, desc: 'Text-based capsule' },
    { id: 'prediction', label: 'Prediction', icon: Target, desc: 'Future prediction' },
    { id: 'art', label: 'Digital Art', icon: Image, desc: 'Creative content' },
    { id: 'secret', label: 'Secret', icon: Lock, desc: 'Encrypted content' }
  ];

  const lockTypes = [
    { id: 'time', label: 'Time Lock', icon: Clock, desc: 'Unlock at specific date' },
    { id: 'block', label: 'Block Height', icon: Zap, desc: 'Unlock at block number' },
    { id: 'community', label: 'Community Vote', icon: Users, desc: 'Community decides unlock' }
  ];

  const handleNext = () => setStep(Math.min(step + 1, 3));
  const handlePrev = () => setStep(Math.max(step - 1, 1));

  const handleSubmit = () => {
    console.log('Creating capsule:', capsuleData);
    // Simulate minting process
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-black pt-12 text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-cyan-900/20" />
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent mb-4">
            Create Time Capsule
          </h1>
          <p className="text-gray-400 text-lg">Mint your memories into the blockchain forever</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    i <= step ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' : 'border-gray-600 text-gray-600'
                  }`}
                  animate={{ scale: i === step ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {i}
                </motion.div>
                {i < 3 && (
                  <div className={`w-64 h-0.5 mx-4 ${i < step ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Content</span>
            <span>Lock Settings</span>
            <span>Review</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Content */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Type Selection */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-cyan-400 mb-6">Choose Capsule Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {capsuleTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        onClick={() => setCapsuleData({...capsuleData, type: type.id})}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          capsuleData.type === type.id
                            ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/25'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <type.icon className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                        <div className="text-sm font-medium">{type.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{type.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Content Input */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-cyan-400 mb-6">Add Content</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={capsuleData.title}
                      onChange={(e) => setCapsuleData({...capsuleData, title: e.target.value})}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors"
                      placeholder="Enter capsule title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                      value={capsuleData.message}
                      onChange={(e) => setCapsuleData({...capsuleData, message: e.target.value})}
                      rows={6}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors"
                      placeholder="What would you like to preserve for the future?"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Lock Settings */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Lock Type */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-cyan-400 mb-6">Lock Mechanism</h3>
                  <div className="space-y-4">
                    {lockTypes.map((lock) => (
                      <motion.button
                        key={lock.id}
                        onClick={() => setCapsuleData({...capsuleData, lockType: lock.id})}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          capsuleData.lockType === lock.id
                            ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/25'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <lock.icon className="w-6 h-6 text-cyan-400" />
                          <div>
                            <div className="font-medium">{lock.label}</div>
                            <div className="text-sm text-gray-400">{lock.desc}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Lock Configuration */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-cyan-400 mb-6">Configure Lock</h3>
                  {capsuleData.lockType === 'time' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Unlock Date</label>
                      <input
                        type="datetime-local"
                        value={capsuleData.unlockDate}
                        onChange={(e) => setCapsuleData({...capsuleData, unlockDate: e.target.value})}
                        className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  )}
                  {capsuleData.lockType === 'block' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Block Number</label>
                      <input
                        type="number"
                        value={capsuleData.blockNumber}
                        onChange={(e) => setCapsuleData({...capsuleData, blockNumber: e.target.value})}
                        className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-cyan-400 focus:outline-none"
                        placeholder="e.g., 18500000"
                      />
                    </div>
                  )}
                  {capsuleData.lockType === 'community' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Unlock Condition</label>
                      <textarea
                        value={capsuleData.condition}
                        onChange={(e) => setCapsuleData({...capsuleData, condition: e.target.value})}
                        rows={4}
                        className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-cyan-400 focus:outline-none"
                        placeholder="Describe the condition for community voting..."
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="private"
                      checked={capsuleData.isPrivate}
                      onChange={(e) => setCapsuleData({...capsuleData, isPrivate: e.target.checked})}
                      className="w-4 h-4 text-cyan-400 border-gray-700 rounded focus:ring-cyan-400"
                    />
                    <label htmlFor="private" className="text-sm text-gray-300">
                      Make this capsule private (only you can view)
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-cyan-400 mb-6">Review Your Capsule</h3>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-400">Title</label>
                      <p className="text-white font-medium">{capsuleData.title || 'Untitled'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Type</label>
                      <p className="text-white font-medium capitalize">{capsuleData.type}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400">Message</label>
                    <p className="text-white mt-1 p-3 bg-gray-800/50 rounded-lg">
                      {capsuleData.message || 'No message provided'}
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-400">Lock Type</label>
                      <p className="text-white font-medium capitalize">{capsuleData.lockType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Privacy</label>
                      <p className="text-white font-medium">{capsuleData.isPrivate ? 'Private' : 'Public'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
                  <p className="text-sm text-cyan-300">
                    <strong>Estimated minting cost:</strong> 0.025 ETH + gas fees
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-green-400"
                >
                  ✓
                </motion.div>
              </motion.div>
              
              <h3 className="text-3xl font-bold text-green-400 mb-4">Capsule Created!</h3>
              <p className="text-gray-400 mb-8">
                Your time capsule has been successfully minted and stored on the blockchain.
              </p>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-400 mb-2">Transaction Hash</p>
                <p className="font-mono text-cyan-400 break-all">0x1234...abcd</p>
              </div>
              
              <motion.button
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(1)}
              >
                Create Another Capsule
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 4 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between max-w-4xl mx-auto mt-12"
          >
            <motion.button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-6 py-3 border border-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-600 transition-colors"
              whileHover={{ scale: step > 1 ? 1.05 : 1 }}
              whileTap={{ scale: step > 1 ? 0.95 : 1 }}
            >
              Previous
            </motion.button>
            
            <motion.button
              onClick={step === 3 ? handleSubmit : handleNext}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-700 hover:to-cyan-700 rounded-lg font-medium transition-all shadow-lg shadow-cyan-600/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step === 3 ? 'Create Capsule' : 'Next'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreateCapsule;