'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { readContract } from '@wagmi/core';
import { config } from '@/lib/config';
import contractABI from '@/lib/contractutils.json';
import contractAddress from '@/lib/contractAddress.json';
import { 
  Unlock, 
  Vote, 
  Sparkles, 
  Gift, 
  Users, 
  Heart, 
  MessageCircle, 
  Share, 
  Trophy,
  Zap,
  Hash,
  User,
  ChevronDown,
  Filter,
  } from 'lucide-react';

interface Capsule {
  id: bigint;
  creator: string;
  recipient: string;
  unlockTime: bigint;
  encryptedURI: string;
  lockType: number;
  visibility: number;
  isOpened: boolean;
}

interface Post {
  id: number;
  type: 'mint' | 'unlock' | 'vote' | 'gift' | 'community' | 'achievement' | 'prediction';
  title: string;
  content: string;
  user: {
    address: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  blockNumber?: number;
  capsuleId?: number;
  capsuleTitle?: string;
  transactionHash?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  tags?: string[];
  metadata?: {
    amount?: string;
    recipient?: string;
    votes?: number;
    totalVotes?: number;
    rarity?: 'common' | 'rare' | 'legendary';
    rewards?: string[];
    eventType?: string;
  };
}

const postTypeConfig = {
  mint: {
    icon: Sparkles,
    color: 'from-cyan-500 to-pink-500',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    textColor: 'text-cyan-400'
  },
  unlock: {
    icon: Unlock,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10 border-green-500/20',
    textColor: 'text-green-400'
  },
  vote: {
    icon: Vote,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    textColor: 'text-blue-400'
  },
  gift: {
    icon: Gift,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10 border-pink-500/20',
    textColor: 'text-pink-400'
  },
  community: {
    icon: Users,
    color: 'from-indigo-500 to-cyan-500',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    textColor: 'text-indigo-400'
  },
  achievement: {
    icon: Trophy,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    textColor: 'text-amber-400'
  },
  prediction: {
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    textColor: 'text-yellow-400'
  }
};

// Utility function to format addresses
const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Function to fetch all capsules from the contract
const fetchAllCapsules = async (): Promise<Capsule[]> => {
  try {
    const result = await readContract(config, {
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'getAllCapsules',
    });
    return result as Capsule[];
  } catch (error) {
    console.error('Error fetching capsules:', error);
    return [];
  }
};

// Function to transform capsules into feed posts
const transformCapsulesIntoPosts = (capsules: Capsule[]): Post[] => {
  return capsules.map((capsule, index) => {
    const now = Date.now();
    const unlockTime = Number(capsule.unlockTime) * 1000; // Convert to milliseconds
    const isUnlocked = now >= unlockTime || capsule.isOpened;
    const timeUntilUnlock = unlockTime - now;
    
    // Determine post type based on capsule state
    let postType: Post['type'] = 'mint';
    let title = '';
    let content = '';
    
    if (isUnlocked && capsule.isOpened) {
      postType = 'unlock';
      title = 'Time Capsule Revealed!';
      content = `Capsule #${capsule.id.toString()} has been unlocked and opened, revealing its hidden contents.`;
    } else if (isUnlocked && !capsule.isOpened) {
      postType = 'unlock';
      title = 'Time Capsule Ready to Open!';
      content = `Capsule #${capsule.id.toString()} is now unlocked and ready to be opened.`;
    } else {
      postType = 'mint';
      title = 'New Time Capsule Created';
      content = `A new time capsule #${capsule.id.toString()} has been minted and is waiting to be unlocked.`;
    }

    // Check if it's a gift (creator != recipient)
    if (capsule.creator.toLowerCase() !== capsule.recipient.toLowerCase()) {
      postType = 'gift';
      title = 'Time Capsule Gifted';
      content = `A time capsule #${capsule.id.toString()} has been gifted and is waiting to be unlocked.`;
    }

    const formatTimeRemaining = (ms: number): string => {
      if (ms <= 0) return 'Unlocked';
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      if (days > 0) return `${days}d ${hours}h remaining`;
      if (hours > 0) return `${hours}h remaining`;
      return 'Less than 1h remaining';
    };

    return {
      id: Number(capsule.id),
      type: postType,
      title,
      content,
      user: {
        address: capsule.creator,
        name: `${formatAddress(capsule.creator)}`,
      },
      timestamp: formatTimeRemaining(timeUntilUnlock),
      capsuleId: Number(capsule.id),
      capsuleTitle: `Capsule #${capsule.id.toString()}`,
      likes: Math.floor(Math.random() * 50), // Random likes for demo
      comments: Math.floor(Math.random() * 10),
      shares: Math.floor(Math.random() * 5),
      isLiked: false,
      tags: [
        capsule.lockType === 0 ? 'time-locked' : 'block-locked',
        capsule.visibility === 0 ? 'private' : 'public',
        isUnlocked ? 'unlocked' : 'locked'
      ],
      metadata: {
        rarity: 'common' as const,
        recipient: capsule.recipient !== capsule.creator ? formatAddress(capsule.recipient) : undefined,
      }
    };
  });
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'mint' | 'unlock' | 'vote' | 'gift'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch real capsules and mock data
  useEffect(() => {
    const loadFeedData = async () => {
      try {
        // Fetch real capsules from contract
        const capsules = await fetchAllCapsules();
        const capsulePosts = transformCapsulesIntoPosts(capsules);
        
        // Mock posts for demo purposes
        const mockPosts: Post[] = [
      {
        id: 1,
        type: 'mint',
        title: 'Legendary Time Capsule Minted',
        content: 'A rare "Future Vision" capsule containing AI predictions for 2030 has been minted with exclusive digital art!',
        user: { address: '0x1234...5678', name: 'Alice.eth' },
        timestamp: '2 minutes ago',
        blockNumber: 18456789,
        capsuleId: 101,
        capsuleTitle: 'Future Vision 2030',
        transactionHash: '0xabc123...def456',
        likes: 42,
        comments: 8,
        shares: 12,
        isLiked: false,
        tags: ['legendary', 'prediction', 'AI'],
        metadata: {
          rarity: 'legendary',
          rewards: ['Oracle Badge', '1000 CAPS', 'Exclusive Art NFT']
        }
      },
      {
        id: 2,
        type: 'unlock',
        title: 'Time Capsule Revealed!',
        content: 'The "Childhood Dreams" capsule has been unlocked after 365 days, revealing heartwarming memories and triggering reward distribution.',
        user: { address: '0x9876...5432', name: 'Bob.eth' },
        timestamp: '15 minutes ago',
        blockNumber: 18456750,
        capsuleId: 89,
        capsuleTitle: 'Childhood Dreams',
        transactionHash: '0xdef789...abc123',
        likes: 128,
        comments: 24,
        shares: 35,
        isLiked: true,
        tags: ['memory', 'unlock', 'rewards'],
        metadata: {
          rarity: 'rare',
          rewards: ['Memory Keeper Badge', '500 CAPS']
        }
      },
      {
        id: 3,
        type: 'vote',
        title: 'Community Vote in Progress',
        content: 'The community is voting to unlock a shared capsule containing a collaborative art project. Current progress: 347/500 votes needed.',
        user: { address: '0x1111...2222', name: 'Charlie.eth' },
        timestamp: '1 hour ago',
        capsuleId: 156,
        capsuleTitle: 'Collaborative Masterpiece',
        likes: 89,
        comments: 18,
        shares: 22,
        isLiked: false,
        tags: ['community', 'vote', 'art'],
        metadata: {
          votes: 347,
          totalVotes: 500,
          rarity: 'rare'
        }
      },
      {
        id: 4,
        type: 'gift',
        title: 'Capsule Gifted with Love',
        content: '@Diana.eth gifted a "Secret Love Letter" capsule to @Eve.eth, set to unlock on their anniversary date!',
        user: { address: '0x3333...4444', name: 'Diana.eth' },
        timestamp: '2 hours ago',
        capsuleId: 203,
        capsuleTitle: 'Secret Love Letter',
        likes: 256,
        comments: 42,
        shares: 67,
        isLiked: true,
        tags: ['gift', 'love', 'anniversary'],
        metadata: {
          recipient: 'Eve.eth',
          rarity: 'common'
        }
      },
      {
        id: 5,
        type: 'achievement',
        title: 'Milestone Reached!',
        content: 'The Time Capsule Network has reached 10,000 capsules minted! Early supporters receive exclusive "Pioneer" badges.',
        user: { address: '0x0000...0000', name: 'TimeCapsule.eth' },
        timestamp: '4 hours ago',
        likes: 512,
        comments: 89,
        shares: 156,
        isLiked: false,
        tags: ['milestone', 'achievement', 'pioneer'],
        metadata: {
          rewards: ['Pioneer Badge', '2000 CAPS', 'Special Access']
        }
      },
      {
        id: 6,
        type: 'prediction',
        title: 'Prediction Capsule Verified',
        content: 'A 2024 election prediction capsule was opened and verified as accurate! The creator receives Oracle status and bonus rewards.',
        user: { address: '0x5555...6666', name: 'Prophet.eth' },
        timestamp: '6 hours ago',
        capsuleId: 78,
        capsuleTitle: '2024 Election Prediction',
        likes: 189,
        comments: 33,
        shares: 45,
        isLiked: false,
        tags: ['prediction', 'verified', 'oracle'],
        metadata: {
          rarity: 'legendary',
          rewards: ['Oracle Status', '5000 CAPS', 'Truth Seeker NFT']
        }
      },
      {
        id: 7,
        type: 'community',
        title: 'New Community Challenge',
        content: 'Create a capsule themed around "Future of Web3" to participate in this month\'s community challenge. Winner gets exclusive rewards!',
        user: { address: '0x7777...8888', name: 'Community.eth' },
        timestamp: '8 hours ago',
        likes: 94,
        comments: 15,
        shares: 28,
        isLiked: false,
        tags: ['challenge', 'web3', 'community'],
        metadata: {
          rewards: ['Challenge Winner NFT', '1500 CAPS']
        }
        }
      ];

      // Combine real capsule posts with mock posts
      const allPosts = [...capsulePosts, ...mockPosts];
      
      setTimeout(() => {
        setPosts(allPosts);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error loading feed data:', error);
      // Fallback to mock data only
      const mockPosts: Post[] = [
        {
          id: 1,
          type: 'mint',
          title: 'Error Loading Real Data',
          content: 'Unable to fetch capsules from blockchain. Showing demo data.',
          user: { address: '0x0000...0000', name: 'System' },
          timestamp: 'Just now',
          likes: 0,
          comments: 0,
          shares: 0,
          isLiked: false,
          tags: ['error', 'demo']
        }
      ];
      
      setTimeout(() => {
        setPosts(mockPosts);
        setIsLoading(false);
      }, 1000);
    }
  };

  loadFeedData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newPost: Post = {
          id: Date.now(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          type: ['mint', 'unlock', 'vote', 'gift'][Math.floor(Math.random() * 4)] as any,
          title: 'New Activity Detected',
          content: 'Real-time blockchain event just occurred...',
          user: { address: '0x' + Math.random().toString(16).substr(2, 8) + '...', name: 'User.eth' },
          timestamp: 'Just now',
          likes: 0,
          comments: 0,
          shares: 0,
          isLiked: false,
          tags: ['live']
        };
        setPosts(prev => [newPost, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredPosts = posts.filter(post => 
    selectedFilter === 'all' || post.type === selectedFilter
  );

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16 min-h-screen mt-12"
    >
      {/* Header */}
      <div className="absolute fixed  inset-0">
              <div className="absolute   inset-0 min-h-screen bg-gradient-to-br bg-transparent" />
              <div
                className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
                
                
              />
              <div
                className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
              
              />
            </div>
      <div className="flex relative items-center justify-between mb-8">
        <div>
          <motion.h1 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent mb-2"
          >
            Community Feed
          </motion.h1>
          <p className="text-slate-400">Real-time blockchain events and community activities</p>
        </div>
        
        {/* Filter Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filter
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700">
              {['all', 'mint', 'unlock', 'vote', 'gift'].map((filter) => (
                <button
                  key={filter}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={() => setSelectedFilter(filter as any)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                    selectedFilter === filter
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Posts */
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => {
              const config = postTypeConfig[post.type];
              const IconComponent = config.icon;

              return (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ x: -100, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: 100, opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className={`relative overflow-hidden rounded-xl backdrop-blur-sm border transition-all duration-500 hover:shadow-2xl ${config.bgColor}`}
                >
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${config.color}`} />
                  
                  <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <IconComponent className={`w-5 h-5 ${config.textColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3 h-3 text-slate-500" />
                            <span className="text-sm font-medium text-slate-300">{post.user.name}</span>
                            <span className="text-xs text-slate-500">
                              {formatAddress(post.user.address)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>{post.timestamp}</span>
                            {post.blockNumber && (
                              <div className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                <span>{post.blockNumber.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Post Type Badge */}
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${config.bgColor} ${config.textColor}`}>
                        {post.type}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                      <p className="text-slate-300 leading-relaxed">{post.content}</p>
                    </div>

                    {/* Tags */}
                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 text-xs bg-slate-700/50 text-slate-400 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    {post.metadata && (
                      <div className="mb-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700">
                        {post.capsuleTitle && (
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-slate-300">Capsule: {post.capsuleTitle}</span>
                          </div>
                        )}
                        {post.metadata.votes !== undefined && (
                          <div className="flex items-center gap-2 mb-2">
                            <Vote className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-slate-300">
                              Progress: {post.metadata.votes}/{post.metadata.totalVotes} votes
                            </span>
                            <div className="flex-1 bg-slate-700 rounded-full h-2 ml-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(post.metadata.votes! / post.metadata.totalVotes!) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {post.metadata.rewards && (
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <div className="flex flex-wrap gap-1">
                              {post.metadata.rewards.slice(0, 2).map((reward, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full">
                                  {reward}
                                </span>
                              ))}
                              {post.metadata.rewards.length > 2 && (
                                <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded-full">
                                  +{post.metadata.rewards.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 transition-colors ${
                            post.isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm">{post.likes}</span>
                        </motion.button>
                        
                        <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        
                        <button className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors">
                          <Share className="w-4 h-4" />
                          <span className="text-sm">{post.shares}</span>
                        </button>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${config.bgColor} ${config.textColor} hover:shadow-lg`}
                      >
                        {post.type === 'vote' ? 'Vote Now' : 
                         post.type === 'unlock' ? 'View Capsule' :
                         post.type === 'mint' ? 'Explore' : 'Interact'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Live indicator for new posts */}
                  {post.timestamp === 'Just now' && (
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        LIVE
                      </div>
                    </div>
                  )}
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Load More */}
      {!isLoading && filteredPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-12"
        >
          <button className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-all duration-300">
            Load More Posts
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16"
        >
          <div className="text-6xl mb-4">📡</div>
          <h3 className="text-xl font-medium text-slate-300 mb-2">No posts found</h3>
          <p className="text-slate-400">Try adjusting your filter or check back later for new activity!</p>
        </motion.div>
      )}
    </motion.div>
  );
}