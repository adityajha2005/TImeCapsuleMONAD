'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Clock, Lock, Unlock, Gift, Zap, Users, Calendar, Sparkles, Timer, Globe } from 'lucide-react';

interface Capsule {
  id: number;
  title: string;
  isUnlocked: boolean;
  type: 'memory' | 'prediction' | 'secret' | 'art' | 'message';
  creator: string;
  unlockCondition: string;
  unlockDate?: string;
  blockNumber?: number;
  currentBlock?: number;
  communityVotes?: number;
  requiredVotes?: number;
  rarity: 'common' | 'rare' | 'legendary';
  rewards?: string[];
  previewImage?: string;
  isGifted: boolean;
  giftedBy?: string;
}

const capsuleTypeIcons = {
  memory: Clock,
  prediction: Zap,
  secret: Lock,
  art: Sparkles,
  message: Gift
};

const rarityColors = {
  common: 'from-cyan-500/20 to-cyan-500/20 border-cyan-400/30',
  rare: 'from-cyan-500/20 to-pink-500/20 border-cyan-400/30',
  legendary: 'from-amber-500/20 to-orange-500/20 border-amber-400/30'
};

const rarityGlows = {
  common: 'shadow-cyan-500/20',
  rare: 'shadow-cyan-500/20',
  legendary: 'shadow-amber-500/20'
};

export default function GiftedCapsules() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [hoveredCapsule, setHoveredCapsule] = useState<number | null>(null);

  const capsules: Capsule[] = [
    {
      id: 1,
      title: 'Childhood Dreams',
      type: 'memory',
      isUnlocked: false,
      creator: '0x1234...5678',
      unlockCondition: 'Time-based',
      unlockDate: '2025-12-25',
      rarity: 'rare',
      rewards: ['Special NFT Badge', '100 CAPS tokens'],
      isGifted: true,
      giftedBy: 'Alice.eth'
    },
    {
      id: 2,
      title: 'AI Prediction 2030',
      type: 'prediction',
      isUnlocked: true,
      creator: '0x9876...5432',
      unlockCondition: 'Event-based',
      rarity: 'legendary',
      rewards: ['Prediction Oracle Status', '500 CAPS tokens', 'Exclusive Art'],
      isGifted: true,
      giftedBy: 'Bob.eth'
    },
    {
      id: 3,
      title: 'Love Letter',
      type: 'secret',
      isUnlocked: false,
      creator: '0x1111...2222',
      unlockCondition: 'Community Vote',
      communityVotes: 247,
      requiredVotes: 500,
      rarity: 'common',
      rewards: ['Heart NFT', '50 CAPS tokens'],
      isGifted: true,
      giftedBy: 'Charlie.eth'
    },
    {
      id: 4,
      title: 'Digital Masterpiece',
      type: 'art',
      isUnlocked: false,
      creator: '0x3333...4444',
      unlockCondition: 'Block-based',
      blockNumber: 18500000,
      currentBlock: 18456789,
      rarity: 'legendary',
      rewards: ['Exclusive Art Collection', '1000 CAPS tokens'],
      isGifted: true,
      giftedBy: 'Diana.eth'
    },
    {
      id: 5,
      title: 'Future Message',
      type: 'message',
      isUnlocked: false,
      creator: '0x5555...6666',
      unlockCondition: 'Time-based',
      unlockDate: '2026-01-01',
      rarity: 'rare',
      rewards: ['Time Traveler Badge', '200 CAPS tokens'],
      isGifted: true,
      giftedBy: 'Eve.eth'
    }
  ];

  const filteredCapsules = capsules.filter(capsule => {
    if (selectedFilter === 'locked') return !capsule.isUnlocked;
    if (selectedFilter === 'unlocked') return capsule.isUnlocked;
    return true;
  });

  const getProgressPercentage = (capsule: Capsule) => {
    if (capsule.unlockCondition === 'Community Vote' && capsule.communityVotes && capsule.requiredVotes) {
      return (capsule.communityVotes / capsule.requiredVotes) * 100;
    }
    if (capsule.unlockCondition === 'Block-based' && capsule.blockNumber && capsule.currentBlock) {
      return Math.min((capsule.currentBlock / capsule.blockNumber) * 100, 100);
    }
    if (capsule.unlockCondition === 'Time-based' && capsule.unlockDate) {
      const now = new Date();
      const unlock = new Date(capsule.unlockDate);
      const total = unlock.getTime() - new Date('2025-01-01').getTime();
      const elapsed = now.getTime() - new Date('2025-01-01').getTime();
      return Math.min((elapsed / total) * 100, 100);
    }
    return 0;
  };

  const formatTimeRemaining = (date: string) => {
    const now = new Date();
    const unlock = new Date(date);
    const diff = unlock.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days` : 'Soon';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16 min-h-screen mt-12 "
    >
        <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-cyan-900/20" />
              <motion.div
                className="absolute top-32 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
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
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 relative mb-4"
        >
          <Gift className="w-8 h-8 text-cyan-300" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent ">
            Gifted Capsules
          </h1>
          <Gift className="w-8 h-8 text-cyan-300" />
        </motion.div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Discover time capsules gifted to you by friends and the community. Each capsule holds unique surprises waiting to be unlocked.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700">
          {['all', 'locked', 'unlocked'].map((filter) => (
            <button
              key={filter}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-6 py-2 rounded-full capitalize transition-all duration-300 ${
                selectedFilter === filter
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Capsules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCapsules.map((capsule, index) => {
            const IconComponent = capsuleTypeIcons[capsule.type];
            const progress = getProgressPercentage(capsule);
            
            return (
              <motion.div
                key={capsule.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  rotateY: 5,
                  rotateX: 5,
                }}
                onHoverStart={() => setHoveredCapsule(capsule.id)}
                onHoverEnd={() => setHoveredCapsule(null)}
                className={`relative overflow-hidden rounded-2xl border-2 backdrop-blur-sm transition-all duration-500 ${
                  rarityColors[capsule.rarity]
                } ${rarityGlows[capsule.rarity]} shadow-2xl hover:shadow-3xl`}
                style={{
                  background: `linear-gradient(135deg, ${
                    capsule.rarity === 'common' ? 'rgba(59, 130, 246, 0.1)' :
                    capsule.rarity === 'rare' ? 'rgba(147, 51, 234, 0.1)' :
                    'rgba(245, 158, 11, 0.1)'
                  }, rgba(0, 0, 0, 0.3))`
                }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    capsule.rarity === 'common' ? 'from-cyan-500/20 to-cyan-500/20' :
                    capsule.rarity === 'rare' ? 'from-cyan-500/20 to-pink-500/20' :
                    'from-amber-500/20 to-orange-500/20'
                  }`} />
                  {hoveredCapsule === capsule.id && (
                    <motion.div
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1.5, rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />
                  )}
                </div>

                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        capsule.isUnlocked ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{capsule.title}</h3>
                        <p className="text-sm text-slate-400 capitalize">{capsule.type} Capsule</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {capsule.isUnlocked ? (
                        <Unlock className="w-5 h-5 text-green-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        capsule.rarity === 'common' ? 'bg-cyan-500/20 text-cyan-400' :
                        capsule.rarity === 'rare' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {capsule.rarity}
                      </span>
                    </div>
                  </div>

                  {/* Gift Info */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-lg border border-pink-500/20">
                    <div className="flex items-center gap-2 text-pink-400">
                      <Gift className="w-4 h-4" />
                      <span className="text-sm">Gifted by {capsule.giftedBy}</span>
                    </div>
                  </div>

                  {/* Unlock Condition */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {capsule.unlockCondition === 'Time-based' && <Calendar className="w-4 h-4 text-cyan-400" />}
                      {capsule.unlockCondition === 'Community Vote' && <Users className="w-4 h-4 text-cyan-400" />}
                      {capsule.unlockCondition === 'Block-based' && <Globe className="w-4 h-4 text-green-400" />}
                      {capsule.unlockCondition === 'Event-based' && <Zap className="w-4 h-4 text-yellow-400" />}
                      <span className="text-sm text-slate-300">{capsule.unlockCondition}</span>
                    </div>
                    
                    {!capsule.isUnlocked && (
                      <div className="space-y-2">
                        {capsule.unlockDate && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Timer className="w-3 h-3" />
                            <span>Unlocks in {formatTimeRemaining(capsule.unlockDate)}</span>
                          </div>
                        )}
                        {capsule.communityVotes && capsule.requiredVotes && (
                          <div className="text-xs text-slate-400">
                            Votes: {capsule.communityVotes}/{capsule.requiredVotes}
                          </div>
                        )}
                        {capsule.blockNumber && capsule.currentBlock && (
                          <div className="text-xs text-slate-400">
                            Block: {capsule.currentBlock.toLocaleString()}/{capsule.blockNumber.toLocaleString()}
                          </div>
                        )}
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${
                              capsule.rarity === 'common' ? 'bg-cyan-500' :
                              capsule.rarity === 'rare' ? 'bg-cyan-500' :
                              'bg-amber-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rewards Preview */}
                  {capsule.rewards && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Rewards:</h4>
                      <div className="flex flex-wrap gap-1">
                        {capsule.rewards.slice(0, 2).map((reward, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full"
                          >
                            {reward}
                          </span>
                        ))}
                        {capsule.rewards.length > 2 && (
                          <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full">
                            +{capsule.rewards.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    href={`/capsule/${capsule.id}`}
                    className={`w-full block text-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                      capsule.isUnlocked
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {capsule.isUnlocked ? 'Open Capsule' : 'View Details'}
                  </Link>
                </div>

                {/* Floating particles for unlocked capsules */}
                {capsule.isUnlocked && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-green-400 rounded-full"
                        initial={{ 
                          x: Math.random() * 300, 
                          y: Math.random() * 200,
                          opacity: 0 
                        }}
                        animate={{ 
                          y: [null, -20, -40],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredCapsules.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-slate-400 mt-16"
        >
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-xl font-medium mb-2">No capsules found</h3>
          <p>Try adjusting your filter or check back later for new gifts!</p>
        </motion.div>
      )}
    </motion.div>
  );
}