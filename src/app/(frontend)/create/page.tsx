"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lock, Image, MessageSquare, Zap, Users, Target, Upload, X, File, Video, Music } from 'lucide-react';

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
    { id: 'art', label: 'Digital Art', icon: Image, desc: 'Creative content & assets' },
    { id: 'secret', label: 'Secret', icon: Lock, desc: 'Encrypted content' }
  ];

  const lockTypes = [
    { id: 'time', label: 'Time Lock', icon: Clock, desc: 'Unlock at specific date' },
    { id: 'block', label: 'Block Height', icon: Zap, desc: 'Unlock at block number' },
    { id: 'community', label: 'Community Vote', icon: Users, desc: 'Community decides unlock' }
  ];

  const assetTypes = [
    { id: 'image', label: 'Images', icon: Image, accept: 'image/*', desc: 'JPG, PNG, GIF, WebP' },
    { id: 'video', label: 'Videos', icon: Video, accept: 'video/*', desc: 'MP4, WebM, AVI' },
    { id: 'audio', label: 'Audio', icon: Music, accept: 'audio/*', desc: 'MP3, WAV, FLAC' },
    { id: 'document', label: 'Documents', icon: File, accept: '.pdf,.doc,.docx,.txt', desc: 'PDF, DOC, TXT' }
  ];

  const handleNext = () => setStep(Math.min(step + 1, 3));
  const handlePrev = () => setStep(Math.max(step - 1, 1));

  const handleSubmit = () => {
    console.log('Creating capsule:', capsuleData);
    // Simulate minting process
    setStep(4);
  };

  // @ts-ignore
  const handleFileUpload = (event, assetType) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      //@ts-ignore
      name: file.name,
      //@ts-ignore
      size: file.size,
      type: assetType,
      //@ts-ignore
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    
    setCapsuleData({
      ...capsuleData,
      //@ts-ignore
      attachments: [...capsuleData.attachments, ...newAttachments]
    });
  };
//@ts-ignore
  const removeAttachment = (id) => {
    setCapsuleData({
      ...capsuleData,
      //@ts-ignore
      attachments: capsuleData.attachments.filter(att => att.id !== id)
    });
  };
//@ts-ignore
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              className="max-w-6xl mx-auto"
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

              {/* Digital Assets Upload Section - Only shown when 'art' type is selected */}
              {capsuleData.type === 'art' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-12"
                >
                  <div className="border-t border-gray-800 pt-8">
                    <h3 className="text-2xl font-semibold text-cyan-400 mb-6">Add Digital Assets</h3>
                    
                    {/* Asset Type Upload Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {assetTypes.map((asset) => (
                        <motion.label
                          key={asset.id}
                          className="relative cursor-pointer group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="file"
                            multiple
                            accept={asset.accept}
                            onChange={(e) => handleFileUpload(e, asset.id)}
                            className="hidden"
                          />
                          <div className="p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-cyan-400 transition-colors group-hover:bg-cyan-400/5">
                            <asset.icon className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                            <div className="text-center">
                              <div className="font-medium text-sm">{asset.label}</div>
                              <div className="text-xs text-gray-400 mt-1">{asset.desc}</div>
                            </div>
                          </div>
                        </motion.label>
                      ))}
                    </div>

                    {/* Uploaded Files Display */}
                    {capsuleData.attachments.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-300">Uploaded Assets ({capsuleData.attachments.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {capsuleData.attachments.map((attachment) => (
                            <motion.div
                            // @ts-ignore
                              key={attachment.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative bg-gray-900/50 border border-gray-700 rounded-lg p-4"
                            >
                              {/* Remove button */}
                              <button
                              //@ts-ignore
                                onClick={() => removeAttachment(attachment.id)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center transition-colors"
                              >
                                <X className="w-3 h-3 text-red-400" />
                              </button>

                              {/* Preview */}
                              <div className="mb-3">
                                {/* @ts-ignore */}
                                {attachment.preview ? (
                                  <img
                                  //@ts-ignore
                                    src={attachment.preview}
                                    //@ts-ignore
                                    alt={attachment.name}
                                    className="w-full h-24 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-full h-24 bg-gray-800 rounded flex items-center justify-center">
                                    <File className="w-8 h-8 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* File info */}
                              <div className="space-y-1">
                                {/* @ts-ignore */}
                                <div className="text-sm font-medium text-white truncate" title={attachment.name}>
                                  {/* @ts-ignore */}
                                  {attachment.name}
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-400">
                                  {/* @ts-ignore */}
                                  <span className="capitalize">{attachment.type}</span>
                                  {/* @ts-ignore */}
                                  <span>{formatFileSize(attachment.size)}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Upload summary */}
                        <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-cyan-300">
                              Total files: {capsuleData.attachments.length}
                            </span>
                            <span className="text-cyan-300">
                              {/* @ts-ignore */}
                              Total size: {formatFileSize(capsuleData.attachments.reduce((acc, att) => acc + att.size, 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload tips */}
                    <div className="mt-6 p-4 bg-gray-900/30 border border-gray-800 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Upload Guidelines:</h5>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Maximum file size: 50MB per file</li>
                        <li>• Supported formats: Images, Videos, Audio, Documents</li>
                        <li>• NFT metadata will be automatically generated</li>
                        <li>• All files are encrypted and stored on IPFS</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
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

                  {/* Digital Assets Summary */}
                  {capsuleData.type === 'art' && capsuleData.attachments.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-400">Digital Assets ({capsuleData.attachments.length})</label>
                      <div className="mt-2 space-y-2">
                        {capsuleData.attachments.map((attachment) => (
                          //@ts-ignore
                          <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                            {/* @ts-ignore */}
                            <span className="text-sm text-white truncate">{attachment.name}</span>
                            {/* @ts-ignore */}
                            <span className="text-xs text-gray-400 ml-2">{formatFileSize(attachment.size)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
                    <strong>Estimated minting cost:</strong> {0.025 + (capsuleData.attachments.length * 0.01)} ETH + gas fees
                    {capsuleData.attachments.length > 0 && (
                      <span className="block mt-1 text-xs">
                        (+{capsuleData.attachments.length * 0.01} ETH for {capsuleData.attachments.length} digital assets)
                      </span>
                    )}
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
                  className="text-green-400 text-3xl"
                >
                  ✓
                </motion.div>
              </motion.div>
              
              <h3 className="text-3xl font-bold text-green-400 mb-4">Capsule Created!</h3>
              <p className="text-gray-400 mb-8">
                Your time capsule has been successfully minted and stored on the blockchain.
                {capsuleData.attachments.length > 0 && (
                  <span className="block mt-2">
                    All {capsuleData.attachments.length} digital assets have been uploaded to IPFS.
                  </span>
                )}
              </p>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-400 mb-2">Transaction Hash</p>
                <p className="font-mono text-cyan-400 break-all">0x1234...abcd</p>
              </div>
              
              <motion.button
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStep(1);
                  setCapsuleData({
                    title: '', message: '', type: 'message', lockType: 'time',
                    unlockDate: '', blockNumber: '', condition: '', isPrivate: false, attachments: []
                  });
                }}
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