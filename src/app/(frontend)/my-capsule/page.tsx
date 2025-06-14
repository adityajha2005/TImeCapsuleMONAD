"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Clock, Users, Zap, Eye, Heart, MessageSquare,  Search, Plus, Grid, List } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MyCapsules = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [capsules] = useState([
    {
      id: 'TC-001',
      title: 'Letter to Future Me',
      type: 'message',
      status: 'locked',
      unlockDate: '2025-12-31',
      lockType: 'time',
      createdAt: '2024-01-15',
      views: 1432,
      likes: 247,
      preview: 'Dear Future Me, I hope by the time you read this...',
      timeLeft: { days: 204, hours: 12, minutes: 34 }
    },
    {
      id: 'TC-002',
      title: 'My 2024 Predictions',
      type: 'prediction',
      status: 'unlocked',
      unlockDate: '2024-12-31',
      lockType: 'time',
      createdAt: '2024-01-01',
      views: 2156,
      likes: 389,
      preview: 'I predict that by end of 2024, AI will revolutionize...',
      timeLeft: null
    },
    {
      id: 'TC-003',
      title: 'Digital Art Collection',
      type: 'art',
      status: 'locked',
      unlockDate: '2026-01-01',
      lockType: 'block',
      createdAt: '2024-03-10',
      views: 892,
      likes: 156,
      preview: 'A collection of my digital artworks from 2024...',
      timeLeft: { days: 571, hours: 8, minutes: 22 }
    },
    {
      id: 'TC-004',
      title: 'Secret Recipe',
      type: 'secret',
      status: 'locked',
      unlockDate: '2025-06-15',
      lockType: 'community',
      createdAt: '2024-02-28',
      views: 543,
      likes: 89,
      preview: 'The secret ingredient to my grandmother\'s famous...',
      timeLeft: { days: 6, hours: 14, minutes: 56 }
    },
    {
      id: 'TC-005',
      title: 'Wedding Vows',
      type: 'message',
      status: 'unlocked',
      unlockDate: '2024-06-20',
      lockType: 'time',
      createdAt: '2024-01-20',
      views: 3421,
      likes: 892,
      preview: 'These are the vows I wrote before our wedding...',
      timeLeft: null
    },
    {
      id: 'TC-006',
      title: 'Crypto Market Analysis',
      type: 'prediction',
      status: 'locked',
      unlockDate: '2025-12-31',
      lockType: 'time',
      createdAt: '2024-04-01',
      views: 1876,
      likes: 334,
      preview: 'My analysis of the crypto market trends for 2025...',
      timeLeft: { days: 204, hours: 12, minutes: 34 }
    }
  ]);

  const filterTypes = [
    { id: 'all', label: 'All Capsules', count: capsules.length },
    { id: 'locked', label: 'Locked', count: capsules.filter(c => c.status === 'locked').length },
    { id: 'unlocked', label: 'Unlocked', count: capsules.filter(c => c.status === 'unlocked').length },
    { id: 'message', label: 'Messages', count: capsules.filter(c => c.type === 'message').length },
    { id: 'prediction', label: 'Predictions', count: capsules.filter(c => c.type === 'prediction').length },
    { id: 'art', label: 'Art', count: capsules.filter(c => c.type === 'art').length },
    { id: 'secret', label: 'Secrets', count: capsules.filter(c => c.type === 'secret').length }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'unlock-soon', label: 'Unlocking Soon' },
    { id: 'most-liked', label: 'Most Liked' },
    { id: 'most-viewed', label: 'Most Viewed' }
  ];

  const filteredCapsules = capsules
    .filter(capsule => {
      if (filterType === 'all') return true;
      if (filterType === 'locked' || filterType === 'unlocked') return capsule.status === filterType;
      return capsule.type === filterType;
    })
    .filter(capsule => 
      capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capsule.preview.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'most-liked': return b.likes - a.likes;
        case 'most-viewed': return b.views - a.views;
        case 'unlock-soon': 
          if (!a.timeLeft && !b.timeLeft) return 0;
          if (!a.timeLeft) return 1;
          if (!b.timeLeft) return -1;
          return (a.timeLeft.days * 24 * 60 + a.timeLeft.hours * 60 + a.timeLeft.minutes) - 
                 (b.timeLeft.days * 24 * 60 + b.timeLeft.hours * 60 + b.timeLeft.minutes);
        default: return 0;
      }
    });

  const getTypeIcon = (type : string) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'prediction': return Zap;
      case 'art': return Eye;
      case 'secret': return Lock;
      default: return MessageSquare;
    }
  };

  const getLockIcon = (lockType : string) => {
    switch (lockType) {
      case 'time': return Clock;
      case 'block': return Zap;
      case 'community': return Users;
      default: return Clock;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTimeLeft = (timeLeft : any) => {
    if (!timeLeft) return null;
    const { days, hours, minutes } = timeLeft;
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
  const CapsuleCard = ({ capsule, index } : { capsule: Capsule, index: number }) => {
    const TypeIcon = getTypeIcon(capsule.type);
    const LockIcon = getLockIcon(capsule.lockType);
    const isLocked = capsule.status === 'locked';

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-gray-900/50 border  border-gray-800 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isLocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">
                {capsule.title}
              </h3>
              <p className="text-gray-400 text-sm">{capsule.id}</p>
            </div>
          </div>
          <div className={`p-2 rounded-lg ${
            isLocked ? 'bg-red-500/20' : 'bg-green-500/20'
          }`}>
            {isLocked ? (
              <Lock className="w-5 h-5 text-red-400" />
            ) : (
              <Unlock className="w-5 h-5 text-green-400" />
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-4">
          <p className={`text-gray-300 leading-relaxed ${
            isLocked ? 'blur-sm' : ''
          }`}>
            {capsule.preview}
          </p>
        </div>

        {/* Status Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-400">
              <LockIcon className="w-4 h-4" />
              <span className="text-sm">
                {isLocked ? 'Unlocks' : 'Unlocked'} {new Date(capsule.unlockDate).toLocaleDateString()}
              </span>
            </div>
            {capsule.timeLeft && (
              <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                {formatTimeLeft(capsule.timeLeft)} left
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{capsule.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{capsule.likes.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Created {new Date(capsule.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
  const CapsuleListItem = ({ capsule, index }) => {
    const TypeIcon = getTypeIcon(capsule.type);
    const LockIcon = getLockIcon(capsule.lockType);
    const isLocked = capsule.status === 'locked';

    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ x: 5 }}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`p-2 rounded-lg ${
              isLocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-lg hover:text-blue-400 transition-colors">
                  {capsule.title}
                </h3>
                <span className="text-gray-400 text-sm">{capsule.id}</span>
                {isLocked ? (
                  <Lock className="w-4 h-4 text-red-400" />
                ) : (
                  <Unlock className="w-4 h-4 text-green-400" />
                )}
              </div>
              <p className={`text-gray-400 text-sm mt-1 ${
                isLocked ? 'blur-sm' : ''
              }`}>
                {capsule.preview.substring(0, 100)}...
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{capsule.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{capsule.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LockIcon className="w-4 h-4" />
              <span className="text-sm">
                {new Date(capsule.unlockDate).toLocaleDateString()}
              </span>
            </div>
            {capsule.timeLeft && (
              <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                {formatTimeLeft(capsule.timeLeft)}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20" />
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 mt-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent mb-4">
              My Time Capsules
            </h1>
            <p className="text-gray-400 text-lg">Manage your digital memories and predictions</p>
          </div>
          
          <motion.button
            className="mt-6 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/25 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/create')}
          >
            <Plus className="w-5 h-5" />
            <span>Create New Capsule</span>
          </motion.button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
            <motion.div
              className="text-3xl font-bold text-blue-400 mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {capsules.length}
            </motion.div>
            <p className="text-gray-400 text-sm">Total Capsules</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
            <motion.div
              className="text-3xl font-bold text-red-400 mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              {capsules.filter(c => c.status === 'locked').length}
            </motion.div>
            <p className="text-gray-400 text-sm">Locked</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
            <motion.div
              className="text-3xl font-bold text-green-400 mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              {capsules.filter(c => c.status === 'unlocked').length}
            </motion.div>
            <p className="text-gray-400 text-sm">Unlocked</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
            <motion.div
              className="text-3xl font-bold text-purple-400 mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {capsules.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
            </motion.div>
            <p className="text-gray-400 text-sm">Total Views</p>
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search capsules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
              >
                {filterTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label} ({type.count})
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-800/50 border border-gray-700 rounded-lg p-1">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Grid className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Capsules Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredCapsules.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">No capsules found</h3>
              <p className="text-gray-400">
                {searchQuery ? 'Try adjusting your search terms' : 'Create your first time capsule to get started'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredCapsules.map((capsule, index) => (
                    <CapsuleCard key={capsule.id} capsule={capsule} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {filteredCapsules.map((capsule, index) => (
                    <CapsuleListItem key={capsule.id} capsule={capsule} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Results Count */}
        {filteredCapsules.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8 pt-8 border-t border-gray-800"
          >
            <p className="text-gray-400">
              Showing {filteredCapsules.length} of {capsules.length} capsules
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyCapsules;