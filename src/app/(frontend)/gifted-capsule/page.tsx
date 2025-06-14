'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Clock, Lock, Unlock, Gift, Zap, Users, Calendar, Sparkles, Timer, Globe, Eye, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useGetOwnedCapsules,
  useGetCapsule,
  useUnlockCapsule,
  useTransactionReceipt,
  formatCapsuleData,
  isUnlockable,
  getTimeUntilUnlock,
  type Capsule,
} from '@/hooks/useTimeCapsule';

interface GiftedCapsuleDisplay {
  id: bigint;
  title: string;
  isUnlocked: boolean;
  type: 'memory' | 'prediction' | 'secret' | 'art' | 'message';
  creator: string;
  recipient: string;
  unlockCondition: string;
  unlockDate: string;
  blockNumber?: number;
  currentBlock?: number;
  communityVotes?: number;
  requiredVotes?: number;
  rarity: 'common' | 'rare' | 'legendary';
  rewards: string[];
  previewImage?: string;
  isGifted: boolean;
  giftedBy: string;
  encryptedURI: string;
  unlockTime: bigint;
  lockType: number;
  visibility: number;
  timeRemaining: number;
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

// MediaRenderer component that fetches and renders media
interface MediaRendererProps {
  mediaUri: string;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ mediaUri }) => {
  const [mediaData, setMediaData] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to determine the media type from URL
        const isImage = mediaUri.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        const isVideo = mediaUri.match(/\.(mp4|webm|avi|mov)$/i);

        if (isImage) {
          setMediaType('image');
        } else if (isVideo) {
          setMediaType('video');
        } else {
          // Try to fetch and determine from content-type
          const response = await fetch(mediaUri, { method: 'HEAD' });
          const contentType = response.headers.get('content-type');
          
          if (contentType?.startsWith('image/')) {
            setMediaType('image');
          } else if (contentType?.startsWith('video/')) {
            setMediaType('video');
          } else {
            setMediaType('unknown');
          }
        }

        // For images, fetch as blob and create object URL
        if (mediaType === 'image' || isImage) {
          const response = await fetch(mediaUri);
          if (!response.ok) throw new Error('Failed to fetch media');
          
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setMediaData(objectUrl);
        } else {
          // For videos and unknown types, use the original URL
          setMediaData(mediaUri);
        }
      } catch (err) {
        console.error('Error fetching media:', err);
        setError(err instanceof Error ? err.message : 'Failed to load media');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();

    // Cleanup object URL on unmount
    return () => {
      if (mediaData && mediaData.startsWith('blob:')) {
        URL.revokeObjectURL(mediaData);
      }
    };
  }, [mediaUri]);

  if (loading) {
    return (
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">Media</h4>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            <span className="ml-3 text-gray-400">Loading media...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">Media</h4>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-red-400 text-sm mb-2">Failed to load media: {error}</div>
          <a 
            href={mediaUri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline break-all"
          >
            Open original link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-lg font-semibold text-white mb-2">Media</h4>
      <div className="bg-gray-800/50 rounded-lg p-4">
        {mediaType === 'image' && mediaData ? (
          <img 
            src={mediaData} 
            alt="Capsule media"
            className="max-w-full h-auto rounded-lg"
            onError={() => setError('Failed to display image')}
          />
        ) : mediaType === 'video' && mediaData ? (
          <video 
            src={mediaData} 
            controls
            className="max-w-full h-auto rounded-lg"
            onError={() => setError('Failed to display video')}
          />
        ) : (
          <a 
            href={mediaUri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline break-all"
          >
            {mediaUri}
          </a>
        )}
      </div>
    </div>
  );
};

export default function GiftedCapsules() {
  const { address, isConnected } = useAccount();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [hoveredCapsule, setHoveredCapsule] = useState<bigint | null>(null);
  const [viewingCapsule, setViewingCapsule] = useState<GiftedCapsuleDisplay | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6); // Show 6 capsules per page

  // Contract hooks
  const { data: ownedCapsuleIds, isLoading: isLoadingCapsules } = useGetOwnedCapsules(address || '');
  const { unlockCapsule, hash: unlockHash, isPending: isUnlocking } = useUnlockCapsule();
  const { isLoading: isUnlockLoading, isSuccess: isUnlockSuccess } = useTransactionReceipt(unlockHash);

  // Get capsule data for owned capsules - limit to first 20 for better display
  const capsuleIds = Array.isArray(ownedCapsuleIds) ? ownedCapsuleIds.slice(0, 20) : [];
  
  // Call hooks for each capsule at the top level (fixed number of hooks)
  const capsule0 = useGetCapsule(capsuleIds[0] || BigInt(0));
  const capsule1 = useGetCapsule(capsuleIds[1] || BigInt(0));
  const capsule2 = useGetCapsule(capsuleIds[2] || BigInt(0));
  const capsule3 = useGetCapsule(capsuleIds[3] || BigInt(0));
  const capsule4 = useGetCapsule(capsuleIds[4] || BigInt(0));
  const capsule5 = useGetCapsule(capsuleIds[5] || BigInt(0));
  const capsule6 = useGetCapsule(capsuleIds[6] || BigInt(0));
  const capsule7 = useGetCapsule(capsuleIds[7] || BigInt(0));
  const capsule8 = useGetCapsule(capsuleIds[8] || BigInt(0));
  const capsule9 = useGetCapsule(capsuleIds[9] || BigInt(0));
  const capsule10 = useGetCapsule(capsuleIds[10] || BigInt(0));
  const capsule11 = useGetCapsule(capsuleIds[11] || BigInt(0));
  const capsule12 = useGetCapsule(capsuleIds[12] || BigInt(0));
  const capsule13 = useGetCapsule(capsuleIds[13] || BigInt(0));
  const capsule14 = useGetCapsule(capsuleIds[14] || BigInt(0));
  const capsule15 = useGetCapsule(capsuleIds[15] || BigInt(0));
  const capsule16 = useGetCapsule(capsuleIds[16] || BigInt(0));
  const capsule17 = useGetCapsule(capsuleIds[17] || BigInt(0));
  const capsule18 = useGetCapsule(capsuleIds[18] || BigInt(0));
  const capsule19 = useGetCapsule(capsuleIds[19] || BigInt(0));

  // Collect all capsule data
  const allCapsuleData = [
    { id: capsuleIds[0], data: capsule0.data },
    { id: capsuleIds[1], data: capsule1.data },
    { id: capsuleIds[2], data: capsule2.data },
    { id: capsuleIds[3], data: capsule3.data },
    { id: capsuleIds[4], data: capsule4.data },
    { id: capsuleIds[5], data: capsule5.data },
    { id: capsuleIds[6], data: capsule6.data },
    { id: capsuleIds[7], data: capsule7.data },
    { id: capsuleIds[8], data: capsule8.data },
    { id: capsuleIds[9], data: capsule9.data },
    { id: capsuleIds[10], data: capsule10.data },
    { id: capsuleIds[11], data: capsule11.data },
    { id: capsuleIds[12], data: capsule12.data },
    { id: capsuleIds[13], data: capsule13.data },
    { id: capsuleIds[14], data: capsule14.data },
    { id: capsuleIds[15], data: capsule15.data },
    { id: capsuleIds[16], data: capsule16.data },
    { id: capsuleIds[17], data: capsule17.data },
    { id: capsuleIds[18], data: capsule18.data },
    { id: capsuleIds[19], data: capsule19.data },
  ].filter(item => item.id && item.data);

  // Process capsule data
  const giftedCapsules: GiftedCapsuleDisplay[] = useMemo(() => {
    const processedCapsules = allCapsuleData
      .map(({ id, data }) => {
        const formatted = formatCapsuleData(data);
        if (!formatted) return null;

        // Check if this capsule was gifted (recipient is different from creator)
        const isGifted = formatted.creator.toLowerCase() !== formatted.recipient.toLowerCase();
        if (!isGifted) return null;

        const timeRemaining = getTimeUntilUnlock(formatted);
        
        // Determine type based on lock type and other factors
        const getType = (): 'memory' | 'prediction' | 'secret' | 'art' | 'message' => {
          if (formatted.encryptedURI.includes('prediction')) return 'prediction';
          if (formatted.encryptedURI.includes('art')) return 'art';
          if (formatted.encryptedURI.includes('secret')) return 'secret';
          if (formatted.encryptedURI.includes('memory')) return 'memory';
          return 'message';
        };

        // Determine rarity based on unlock time and visibility
        const getRarity = (): 'common' | 'rare' | 'legendary' => {
          const unlockTimeInDays = Number(formatted.unlockTime - BigInt(Math.floor(Date.now() / 1000))) / 86400;
          if (unlockTimeInDays > 365) return 'legendary';
          if (unlockTimeInDays > 30) return 'rare';
          return 'common';
        };

        // Extract title from encrypted URI (simplified)
        const getTitle = (): string => {
          try {
            if (formatted.encryptedURI.startsWith('data:application/json;base64,')) {
              const decoded = atob(formatted.encryptedURI.split(',')[1]);
              const parsed = JSON.parse(decoded);
              return parsed.title || `Capsule #${formatted.id.toString()}`;
            }
          } catch (e) {
            // Fallback if decoding fails
          }
          return `Capsule #${formatted.id.toString()}`;
        };

        return {
          id: formatted.id,
          title: getTitle(),
          isUnlocked: formatted.isOpened,
          type: getType(),
          creator: formatted.creator,
          recipient: formatted.recipient,
          unlockCondition: formatted.lockType === 0 ? 'Time-based' : 'Block-based',
          unlockDate: new Date(Number(formatted.unlockTime) * 1000).toISOString().split('T')[0],
          rarity: getRarity(),
          rewards: ['Capsule NFT', 'CAPS Tokens'],
          isGifted: true,
          giftedBy: formatted.creator,
          encryptedURI: formatted.encryptedURI,
          unlockTime: formatted.unlockTime,
          lockType: formatted.lockType,
          visibility: formatted.visibility,
          timeRemaining
        } as GiftedCapsuleDisplay;
      });
    
    return processedCapsules
      .filter((capsule): capsule is GiftedCapsuleDisplay => capsule !== null)
      .sort((a, b) => {
        // Sort by unlock time (most recent first)
        return Number(b.unlockTime) - Number(a.unlockTime);
      });
  }, [allCapsuleData]);

  const filteredCapsules = giftedCapsules.filter(capsule => {
    if (selectedFilter === 'locked') return !capsule.isUnlocked;
    if (selectedFilter === 'unlocked') return capsule.isUnlocked;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCapsules.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCapsules = filteredCapsules.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  const handleFilterChange = (filter: 'all' | 'locked' | 'unlocked') => {
    setSelectedFilter(filter);
    setCurrentPage(0);
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        prevPage();
      } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        nextPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages]);

  const getProgressPercentage = (capsule: GiftedCapsuleDisplay) => {
    if (capsule.unlockCondition === 'Time-based' && capsule.unlockDate) {
      const now = new Date();
      const unlock = new Date(capsule.unlockDate);
      const start = new Date(Date.now() - (365 * 24 * 60 * 60 * 1000)); // Assume 1 year ago as start
      const total = unlock.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      return Math.min(Math.max((elapsed / total) * 100, 0), 100);
    }
    return 0;
  };

  const formatTimeRemaining = (timeRemaining: number) => {
    if (timeRemaining <= 0) return 'Ready to unlock!';
    
    const days = Math.floor(timeRemaining / 86400);
    const hours = Math.floor((timeRemaining % 86400) / 3600);
    
    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    return 'Soon';
  };

  const handleUnlock = (capsuleId: bigint) => {
    unlockCapsule(capsuleId);
  };

  const handleViewContent = (capsule: GiftedCapsuleDisplay) => {
    setViewingCapsule(capsule);
    setShowContentModal(true);
  };

  const parseEncryptedURI = (encryptedURI: string) => {
    try {
      if (encryptedURI.startsWith('data:application/json;base64,')) {
        const base64Data = encryptedURI.replace('data:application/json;base64,', '');
        try {
          // Try Unicode-safe decoding first
          const binaryString = atob(base64Data);
          const utf8Bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            utf8Bytes[i] = binaryString.charCodeAt(i);
          }
          const jsonString = new TextDecoder().decode(utf8Bytes);
          return JSON.parse(jsonString);
        } catch (unicodeError) {
          // Fallback to regular atob for older capsules
          const jsonString = atob(base64Data);
          return JSON.parse(jsonString);
        }
      } else if (encryptedURI.startsWith('data:application/json,')) {
        const jsonString = decodeURIComponent(encryptedURI.replace('data:application/json,', ''));
        return JSON.parse(jsonString);
      }
      return { message: 'Unable to decode content', title: 'Unknown' };
    } catch (error) {
      console.error('Error parsing encrypted URI:', error);
      return { message: 'Error decoding content', title: 'Error' };
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Show wallet connection if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black pt-12 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent mb-8">
            Connect Your Wallet
          </h1>
          <p className="text-gray-400 mb-8">Connect your wallet to view your gifted time capsules</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16 min-h-screen mt-12"
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
      <div className="text-center mb-12 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 relative mb-4"
        >
          <Gift className="w-8 h-8 text-cyan-300" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            Gifted Capsules
          </h1>
          <Gift className="w-8 h-8 text-cyan-300" />
        </motion.div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Discover time capsules gifted to you by friends and the community. Each capsule holds unique surprises waiting to be unlocked.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        <div className="bg-gradient-to-br from-stone-950/20 via-stone-950 to-stone-950/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
          <div className=" absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"/>

          <h3 className="text-lg font-semibold text-cyan-400 mb-2">Total Gifted</h3>
          <p className="text-3xl font-bold text-white">{giftedCapsules.length}</p>
        </div>
        <div className="bg-gradient-to-br from-stone-950/20 via-stone-950 to-stone-950/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
          <div className=" absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"/>

          <h3 className="text-lg font-semibold text-green-500 mb-2">Unlocked</h3>
          <p className="text-3xl font-bold text-white">
            {giftedCapsules.filter(c => c.isUnlocked).length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-stone-950/20 via-stone-950 to-stone-950/20 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
          <div className=" absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"/>

          <h3 className="text-lg font-semibold text-red-500 mb-2">Locked</h3>
          <p className="text-3xl font-bold text-white">
            {giftedCapsules.filter(c => !c.isUnlocked).length}
          </p>
        </div>
      </div>

      {/* Transaction Status */}
      {isUnlockSuccess && (
        <div className="mb-6 relative z-10">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400">✅ Capsule unlocked successfully!</p>
            {unlockHash && (
              <a 
                href={`https://testnet.monadexplorer.com/tx/${unlockHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-300 hover:text-green-200 text-sm inline-flex items-center gap-1"
              >
                View transaction <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex justify-center mb-8 relative z-10">
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700">
          {['all', 'locked', 'unlocked'].map((filter) => (
            <motion.button
              key={filter}
              onClick={() => handleFilterChange(filter as any)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedFilter === filter
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              <span className="ml-2 text-xs opacity-75">
                ({filter === 'all' ? giftedCapsules.length : 
                  filter === 'locked' ? giftedCapsules.filter(c => !c.isUnlocked).length :
                  giftedCapsules.filter(c => c.isUnlocked).length})
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoadingCapsules && (
        <div className="text-center py-12 relative z-10">
          <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading your gifted capsules...</p>
        </div>
      )}

      {/* Results Summary */}
      {filteredCapsules.length > 0 && (
        <div className="text-center mb-6 relative z-10">
          <p className="text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredCapsules.length)} of {filteredCapsules.length} capsules
            {totalPages > 1 && ` • Page ${currentPage + 1} of ${totalPages}`}
          </p>
        </div>
      )}

      {/* Capsules Grid */}
      {filteredCapsules.length > 0 ? (
        <div className="relative z-10">
          {/* Carousel Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentPage ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <motion.div 
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {currentCapsules.map((capsule, index) => {
              const TypeIcon = capsuleTypeIcons[capsule.type];
              const progress = getProgressPercentage(capsule);
              const canUnlock = !capsule.isUnlocked && capsule.timeRemaining <= 0;

              return (
                <motion.div
                  key={capsule.id.toString()}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  onHoverStart={() => setHoveredCapsule(capsule.id)}
                  onHoverEnd={() => setHoveredCapsule(null)}
                  className={`relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-500 cursor-pointer group ${
                    rarityColors[capsule.rarity]
                  } ${
                    hoveredCapsule === capsule.id ? `shadow-2xl ${rarityGlows[capsule.rarity]} scale-105` : 'shadow-lg'
                  }`}
                >
                  {/* Rarity Glow Effect */}
                  <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${
                    capsule.rarity === 'legendary' ? 'from-amber-400 to-orange-500' :
                    capsule.rarity === 'rare' ? 'from-cyan-400 to-pink-500' :
                    'from-cyan-400 to-cyan-600'
                  }`} />
                  
                  <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${
                          capsule.isUnlocked ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          <TypeIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                            {capsule.title}
                          </h3>
                          <p className="text-sm text-slate-400">#{capsule.id.toString()}</p>
                        </div>
                      </div>
                      
                      {/* Status Icon */}
                      <div className={`p-2 rounded-lg ${
                        capsule.isUnlocked ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {capsule.isUnlocked ? (
                          <Unlock className="w-5 h-5 text-green-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>

                    {/* Gift Info */}
                    <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Gifted by</span>
                      </div>
                      <p className="text-white font-mono text-sm">{formatAddress(capsule.giftedBy || '')}</p>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Type</span>
                        <span className="text-white capitalize">{capsule.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Rarity</span>
                        <span className={`capitalize font-medium ${
                          capsule.rarity === 'legendary' ? 'text-amber-400' :
                          capsule.rarity === 'rare' ? 'text-pink-400' :
                          'text-cyan-400'
                        }`}>
                          {capsule.rarity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Status</span>
                        <span className={`font-medium ${
                          capsule.isUnlocked ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {capsule.isUnlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                      {!capsule.isUnlocked && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">Time Remaining</span>
                          <span className="text-cyan-400 font-medium">
                            {formatTimeRemaining(capsule.timeRemaining)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {!capsule.isUnlocked && capsule.unlockCondition === 'Time-based' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">Progress</span>
                          <span className="text-slate-300 text-sm">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {capsule.isUnlocked ? (
                        <button 
                          onClick={() => handleViewContent(capsule)}
                          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Content
                        </button>
                      ) : canUnlock ? (
                        <button
                          onClick={() => handleUnlock(capsule.id)}
                          disabled={isUnlocking || isUnlockLoading}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Unlock className="w-4 h-4" />
                          {isUnlocking || isUnlockLoading ? 'Unlocking...' : 'Unlock Now'}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 bg-gray-600 opacity-50 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Timer className="w-4 h-4" />
                          Locked
                        </button>
                      )}
                    </div>

                    {/* Unlock Date */}
                    {!capsule.isUnlocked && capsule.unlockDate && (
                      <div className="mt-3 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Unlocks on {new Date(capsule.unlockDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rarity Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      capsule.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      capsule.rarity === 'rare' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {capsule.rarity.toUpperCase()}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          </motion.div>
        </div>
      ) : !isLoadingCapsules ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 relative z-10"
        >
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-2">No Gifted Capsules Found</h3>
          <p className="text-gray-400 mb-8">
            You haven't received any gifted capsules yet. Ask friends to gift you some time capsules!
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Create Your First Capsule
          </Link>
        </motion.div>
      ) : null}

      {/* Content Viewing Modal */}
      <AnimatePresence>
        {showContentModal && viewingCapsule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowContentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-cyan-400">
                  {viewingCapsule.title} - Capsule #{viewingCapsule.id.toString()}
                </h3>
                <button
                  onClick={() => setShowContentModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {(() => {
                const content = parseEncryptedURI(viewingCapsule.encryptedURI);
                return (
                  <div className="space-y-6">
                    {/* Gift Info */}
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-purple-400" />
                        <span className="text-lg font-semibold text-purple-300">Gifted Capsule</span>
                      </div>
                      <p className="text-gray-300">
                        This capsule was gifted to you by: <span className="font-mono text-cyan-400">{formatAddress(viewingCapsule.giftedBy || '')}</span>
                      </p>
                    </div>

                    {content.title && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Title</h4>
                        <p className="text-gray-300">{content.title}</p>
                      </div>
                    )}
                    
                    {content.message && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Message</h4>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <p className="text-gray-300 whitespace-pre-wrap">{content.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Media Content */}
                    {content.mediaUri && (
                      <MediaRenderer mediaUri={content.mediaUri} />
                    )}

                    {content.type && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Type</h4>
                        <p className="text-gray-300 capitalize">{content.type}</p>
                      </div>
                    )}

                    {content.attachments && content.attachments.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Attachments</h4>
                        <div className="space-y-2">
                          {content.attachments.map((attachment: any, index: number) => (
                            <div key={index} className="bg-gray-800/50 rounded-lg p-3">
                              <p className="text-gray-300 text-sm">
                                📎 {attachment.name} ({attachment.type})
                              </p>
                              {attachment.size && (
                                <p className="text-gray-500 text-xs">
                                  Size: {(attachment.size / 1024).toFixed(1)} KB
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                                         {content.createdAt && (
                       <div>
                         <h4 className="text-lg font-semibold text-white mb-2">Created</h4>
                         <p className="text-gray-300">
                           {new Date(content.createdAt).toLocaleString()}
                         </p>
                       </div>
                     )}

                     {content.creator && (
                       <div>
                         <h4 className="text-lg font-semibold text-white mb-2">Original Creator</h4>
                         <p className="text-gray-300 font-mono text-sm">{content.creator}</p>
                       </div>
                     )}

                     {content.network && (
                       <div>
                         <h4 className="text-lg font-semibold text-white mb-2">Network</h4>
                         <p className="text-gray-300 capitalize">{content.network}</p>
                       </div>
                     )}

                     <div className="pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-2 text-green-400">
                        <Unlock className="w-5 h-5" />
                        <span className="font-semibold">Capsule Unlocked!</span>
                      </div>
                      <p className="text-sm text-green-300 mt-1">
                        This content has been permanently revealed on the blockchain.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}