/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lock, Unlock, Eye, Share2, Heart, MessageSquare, Calendar, Users, Zap, Copy, ExternalLink } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-gray-400">Loading capsule...</p>
    </motion.div>
  </div>
);

// Separate component that uses useSearchParams
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CapsuleDetailContent = ({ params }: { params: any }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [capsuleId] = useState<string>(id || ''); 
  const [isLoading, setIsLoading] = useState(true);
  const [capsule, setCapsule] = useState({
    id: params.id, 
    title: 'Letter to Future Me',
    type: 'message',
    creator: '0x1234...abcd',
    createdAt: '2024-01-15',
    unlockDate: '2025-12-31',
    lockType: 'time',
    isLocked: true,
    isPrivate: false,
    likes: 247,
    views: 1432,
    message: 'Dear Future Me, I hope by the time you read this, we have achieved our dreams of building a decentralized future...',
    metadata: {
      blockHeight: 18234567,
      network: 'Ethereum',
      contractAddress: '0xabcd...1234',
    },
  });
  console.log("capsuleId:", capsule);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);

  // Simulate loading and fetch capsule data
  useEffect(() => {
    const fetchCapsuleData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you'd fetch data based on capsuleId
        // const response = await fetch(`/api/capsules/${capsuleId}`);
        // const data = await response.json();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching capsule data:', error);
        setIsLoading(false);
      }
    };

    if (capsuleId) {
      fetchCapsuleData();
    }
  }, [capsuleId]);

  useEffect(() => {
    if (!capsule.unlockDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const unlockTime = new Date(capsule.unlockDate).getTime();
      const difference = unlockTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setCapsule((prev) => ({ ...prev, isLocked: false }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [capsule.unlockDate]);

  const handleUnlock = async () => {
    try {
      setShowUnlockModal(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUnlockProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCapsule((prev) => ({ ...prev, isLocked: false }));
            setShowUnlockModal(false);
            setUnlockProgress(0);
          }, 500);
        }
      }, 200);
    } catch (error) {
      console.error('Unlock failed:', error);
      setShowUnlockModal(false);
      setUnlockProgress(0);
      alert('Failed to unlock capsule');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20" />
        <motion.div
          className="absolute top-32 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.7, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back navigation */}
          <motion.button
            onClick={() => router.push('/capsules')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
            whileHover={{ x: -5 }}
            aria-label="Back to capsules"
          >
            <span>←</span>
            <span>Back to Capsules</span>
          </motion.button>

          {/* Capsule Header */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    capsule.isLocked 
                      ? 'bg-red-500/20 border-2 border-red-500/50' 
                      : 'bg-green-500/20 border-2 border-green-500/50'
                  }`}
                  animate={{ 
                    scale: capsule.isLocked ? [1, 1.1, 1] : 1,
                    rotate: capsule.isLocked ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 2, repeat: capsule.isLocked ? Infinity : 0 }}
                >
                  {capsule.isLocked ? (
                    <Lock className="w-8 h-8 text-red-400" />
                  ) : (
                    <Unlock className="w-8 h-8 text-green-400" />
                  )}
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    {capsule.title}
                  </h1>
                  <p className="text-gray-400 text-sm">ID: {capsule.id}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-5 h-5 text-gray-400" />
                </motion.button>
                <motion.button
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                <Eye className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-sm text-gray-400">Views</p>
                <p className="font-semibold">{capsule.views.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <p className="text-sm text-gray-400">Likes</p>
                <p className="font-semibold">{capsule.likes}</p>
              </div>
              <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                <Calendar className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-sm text-gray-400">Created</p>
                <p className="font-semibold">{new Date(capsule.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                <MessageSquare className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-sm text-gray-400">Type</p>
                <p className="font-semibold capitalize">{capsule.type}</p>
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">A</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created by</p>
                  <p className="font-mono text-sm">{capsule.creator}</p>
                </div>
              </div>
              <motion.button
                onClick={() => copyToClipboard(capsule.creator)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>
          </div>

          {/* Lock Status */}
          <AnimatePresence>
            {capsule.isLocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-2xl p-8 mb-8"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-red-400 mb-2">🔒 Capsule Locked</h3>
                  <p className="text-gray-300">This capsule will unlock on {new Date(capsule.unlockDate).toLocaleDateString()}</p>
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds }
                  ].map((time, index) => (
                    <motion.div
                      key={time.label}
                      className="text-center p-4 bg-black/30 rounded-xl border border-red-500/20"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="text-3xl font-bold text-red-400 mb-1"
                        key={time.value}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {time.value.toString().padStart(2, '0')}
                      </motion.div>
                      <div className="text-sm text-gray-400">{time.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Time Progress</span>
                    <span>67%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '67%' }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && (
                  <motion.button
                    onClick={handleUnlock}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-semibold transition-all shadow-lg shadow-green-600/25"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    🔓 Unlock Capsule Now
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <motion.div
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-6">Capsule Content</h3>
                
                {capsule.isLocked ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Lock className="w-12 h-12 text-gray-600" />
                    </motion.div>
                    <h4 className="text-xl font-semibold text-gray-400 mb-2">Content Hidden</h4>
                    <p className="text-gray-500">This capsule&apos;s content will be revealed when unlocked</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {capsule.message}
                      </p>
                    </div>
                    
                    <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-400">
                        <Unlock className="w-5 h-5" />
                        <span className="font-semibold">Capsule Unlocked!</span>
                      </div>
                      <p className="text-sm text-green-300 mt-1">
                        This content has been permanently revealed on the blockchain.
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Blockchain Info */}
              <motion.div
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Blockchain Details</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Network</p>
                    <p className="font-mono text-sm">{capsule.metadata.network}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Block Height</p>
                    <p className="font-mono text-sm">{capsule.metadata.blockHeight.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Contract</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-mono text-sm truncate">{capsule.metadata.contractAddress}</p>
                      <motion.button
                        onClick={() => copyToClipboard(capsule.metadata.contractAddress)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </motion.button>
                    </div>
                  </div>
                  <motion.button
                    className="w-full py-2 px-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Etherscan</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Lock Settings */}
              <motion.div
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Lock Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {capsule.lockType === 'time' && <Clock className="w-5 h-5 text-blue-400" />}
                    {capsule.lockType === 'block' && <Zap className="w-5 h-5 text-yellow-400" />}
                    {capsule.lockType === 'community' && <Users className="w-5 h-5 text-purple-400" />}
                    <div>
                      <p className="font-medium capitalize">{capsule.lockType} Lock</p>
                      <p className="text-sm text-gray-400">
                        {capsule.lockType === 'time' && `Unlocks: ${new Date(capsule.unlockDate).toLocaleDateString()}`}
                        {capsule.lockType === 'block' && 'Block-based unlock'}
                        {capsule.lockType === 'community' && 'Community voting required'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Actions</h4>
                <div className="space-y-3">
                  <motion.button
                    className="w-full py-2 px-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Share Capsule
                  </motion.button>
                  <motion.button
                    className="w-full py-2 px-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Favorites
                  </motion.button>
                  <motion.button
                    className="w-full py-2 px-4 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg text-sm transition-colors text-red-400"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Report Content
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Unlock Modal */}
      <AnimatePresence>
        {showUnlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center"
            >
              <motion.div
                className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Unlock className="w-12 h-12 text-green-400" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-green-400 mb-4">Unlocking Capsule...</h3>
              <p className="text-gray-400 mb-6">Processing blockchain transaction</p>
              
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${unlockProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <p className="text-sm text-gray-500">{unlockProgress}% Complete</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main component wrapped with Suspense
// @ts-ignore
const CapsuleDetail = ({ params }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CapsuleDetailContent params={params} />
    </Suspense>
  );
};

export default CapsuleDetail;